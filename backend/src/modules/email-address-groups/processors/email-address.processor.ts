import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { EmailAddressType } from '../../../common/enums/email-address.enum';
import { EmailGroupStatus } from '../../../common/enums/email-group.enum';
import { validateEmail } from '../../../common/utils/email-validator';
import { EmailAddress } from '../../../database/entities/bulk-email/email-address.entity';
import { EmailAddressGroup } from '../../../database/entities/bulk-email/email-group.entity';

interface InsertEmailsJobData {
  groupId: number;
  emails: string[];
}

@Processor('INSERT_EMAILS')
export class EmailAddressProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailAddressProcessor.name);
  private readonly BATCH_SIZE = 1000;

  constructor(
    @InjectRepository(EmailAddress, 'bulk_email')
    private readonly emailAddressRepository: Repository<EmailAddress>,
    @InjectRepository(EmailAddressGroup, 'bulk_email')
    private readonly emailGroupRepository: Repository<EmailAddressGroup>,
  ) {
    super();
    this.logger.log('EmailAddressProcessor initialized');
  }

  async process(job: Job<InsertEmailsJobData>) {
    const { groupId, emails } = job.data;
    this.logger.debug(
      `Processing ${emails.length} emails for group ${groupId}`,
    );

    try {
      // 상태를 PROCESSING으로 업데이트
      await this.emailGroupRepository.update(groupId, {
        status: EmailGroupStatus.PROCESSING,
      });

      // 1. 엑셀 내부 중복 제거 (대소문자 구분 없이)
      const uniqueEmails = [
        ...new Set(emails.map((email) => email.toLowerCase())),
      ];

      // 2. 이메일 유효성 검증
      const validEmails = uniqueEmails.filter((email) => validateEmail(email));

      // 3. 기존 이메일 주소 조회 (대소문자 구분 없이)
      const existingEmails = await this.emailAddressRepository
        .createQueryBuilder('email')
        .where('LOWER(email.email) IN (:...emails)', {
          emails: validEmails,
        })
        .andWhere('email.addressGroupId = :groupId', { groupId })
        .getMany();

      const existingEmailSet = new Set(
        existingEmails.map((e) => e.email.toLowerCase()),
      );

      // 4. 중복 제거된 새 이메일 목록
      const newEmails = validEmails.filter(
        (email) => !existingEmailSet.has(email),
      );

      // 5. 배치 처리
      for (let i = 0; i < newEmails.length; i += this.BATCH_SIZE) {
        const batch = newEmails.slice(i, i + this.BATCH_SIZE);

        // 배치 단위로 트랜잭션 처리
        await this.emailAddressRepository.manager.transaction(
          async (transactionalEntityManager) => {
            await transactionalEntityManager
              .createQueryBuilder()
              .insert()
              .into(EmailAddress)
              .values(
                batch.map((email) => ({
                  addressGroupId: groupId,
                  email,
                  name: '',
                  addressType: EmailAddressType.NORMAL,
                  memo: '',
                  isSubscribed: true,
                })),
              )
              .orIgnore() // 혹시 모를 중복에 대해 무시
              .execute();
          },
        );

        // 진행률 업데이트
        await job.updateProgress(
          Math.floor(((i + batch.length) / newEmails.length) * 100),
        );
      }

      // 6. 실제 추가된 이메일 수 계산
      const actualCount = await this.emailAddressRepository.count({
        where: { addressGroupId: groupId },
      });

      // 7. 이메일 그룹 카운트 업데이트
      await this.emailGroupRepository
        .createQueryBuilder()
        .update(EmailAddressGroup)
        .set({
          addressCount: actualCount,
          status: EmailGroupStatus.COMPLETED,
        })
        .where('id = :groupId', { groupId })
        .execute();

      this.logger.log(
        `Successfully processed ${newEmails.length} new emails for group ${groupId}`,
      );

      return {
        totalEmails: emails.length,
        uniqueEmails: uniqueEmails.length,
        validEmails: validEmails.length,
        newEmails: newEmails.length,
        duplicateEmails: validEmails.length - newEmails.length,
        invalidEmails: uniqueEmails.length - validEmails.length,
      };
    } catch (error) {
      this.logger.error(`Error processing emails for group ${groupId}:`, error);

      // 에러 발생 시 상태를 FAILED로 업데이트
      await this.emailGroupRepository.update(groupId, {
        status: EmailGroupStatus.FAILED,
      });

      throw error;
    }
  }
}
