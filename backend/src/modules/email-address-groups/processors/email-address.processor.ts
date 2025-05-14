import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { In, Repository } from 'typeorm';
import { validateEmail } from '../../../common/utils/email-validator';
import { EmailAddress } from '../../../database/entities/bulk-email/email-address.entity';
import { EmailAddressGroup } from '../../../database/entities/bulk-email/email-group.entity';

interface EmailData {
  email: string;
  name?: string;
  addressType?: 'PERSONAL' | 'WORK' | 'OTHER';
  memo?: string;
}

interface InsertEmailsJobData {
  groupId: number;
  emails: EmailData[];
}

@Processor('INSERT_EMAILS')
export class EmailAddressProcessor {
  private readonly logger = new Logger(EmailAddressProcessor.name);
  private readonly BATCH_SIZE = 1000;

  constructor(
    @InjectRepository(EmailAddress, 'bulk_email')
    private readonly emailAddressRepository: Repository<EmailAddress>,
    @InjectRepository(EmailAddressGroup, 'bulk_email')
    private readonly emailGroupRepository: Repository<EmailAddressGroup>,
  ) {}

  @Process()
  async processEmails(job: Job<InsertEmailsJobData>) {
    const { groupId, emails } = job.data;
    this.logger.log(`Processing ${emails.length} emails for group ${groupId}`);

    try {
      // 1. 이메일 유효성 검증
      const validEmails = emails.filter(({ email }) => validateEmail(email));

      // 2. 기존 이메일 주소 조회
      const existingEmails = await this.emailAddressRepository.find({
        where: {
          addressGroupId: groupId,
          email: In(validEmails.map(({ email }) => email)),
        },
        select: ['email'],
      });
      const existingEmailSet = new Set(existingEmails.map((e) => e.email));

      // 3. 중복 제거
      const newEmails = validEmails.filter(
        ({ email }) => !existingEmailSet.has(email),
      );

      // 4. 배치 처리
      for (let i = 0; i < newEmails.length; i += this.BATCH_SIZE) {
        const batch = newEmails.slice(i, i + this.BATCH_SIZE);
        await this.emailAddressRepository
          .createQueryBuilder()
          .insert()
          .into(EmailAddress)
          .values(
            batch.map(({ email, name, addressType, memo }) => ({
              addressGroupId: groupId,
              email,
              name: name || '',
              addressType: addressType || 'normal',
              memo: memo || '',
              isSubscribed: true,
            })),
          )
          .execute();

        // 진행률 업데이트
        await job.progress(((i + batch.length) / newEmails.length) * 100);
      }

      // 5. 이메일 그룹 카운트 업데이트
      await this.emailGroupRepository
        .createQueryBuilder()
        .update(EmailAddressGroup)
        .set({
          addressCount: () => 'address_count + :count',
        })
        .where('id = :groupId', { groupId })
        .setParameter('count', newEmails.length)
        .execute();

      this.logger.log(
        `Successfully processed ${newEmails.length} new emails for group ${groupId}`,
      );
      return {
        totalEmails: emails.length,
        validEmails: validEmails.length,
        newEmails: newEmails.length,
        duplicateEmails: validEmails.length - newEmails.length,
        invalidEmails: emails.length - validEmails.length,
      };
    } catch (error) {
      this.logger.error(`Error processing emails for group ${groupId}:`, error);
      throw error;
    }
  }
}
