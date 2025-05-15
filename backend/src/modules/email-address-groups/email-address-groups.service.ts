import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import * as csv from 'csv-parse/sync';
import { Like, Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EmailGroupStatus } from '../../common/enums/email-group.enum';
import { EmailAddressGroup } from '../../database/entities/bulk-email/email-group.entity';
import { CreateEmailGroupDto } from './dto/create-email-group.dto';
import { UpdateEmailGroupDto } from './dto/update-email-group.dto';

@Injectable()
export class EmailAddressGroupsService {
  constructor(
    @InjectRepository(EmailAddressGroup, 'bulk_email')
    private readonly emailGroupRepository: Repository<EmailAddressGroup>,
    @InjectQueue('INSERT_EMAILS')
    private readonly emailQueue: Queue,
  ) {}

  async create(
    createEmailGroupDto: CreateEmailGroupDto,
    file?: Express.Multer.File,
  ) {
    const emailGroup = this.emailGroupRepository.create(createEmailGroupDto);
    const savedGroup = await this.emailGroupRepository.save(emailGroup);

    if (file) {
      await this.processEmailFile(savedGroup.id, file);
    }

    return savedGroup;
  }

  async findAll(paginationDto: PaginationDto) {
    const [items, total] = await this.emailGroupRepository.findAndCount({
      skip: paginationDto.skip,
      take: paginationDto.limit,
      order: { [paginationDto.sortBy]: paginationDto.sortOrder },
      where: paginationDto.search
        ? [
            { name: Like(`%${paginationDto.search}%`) },
            { region: Like(`%${paginationDto.search}%`) as any },
          ]
        : {},
    });

    return {
      items,
      total,
      page: Math.floor(paginationDto.skip / paginationDto.limit) + 1,
      pageSize: paginationDto.limit,
    };
  }

  async findOne(id: number) {
    const emailGroup = await this.emailGroupRepository.findOne({
      where: { id },
    });
    if (!emailGroup) {
      throw new NotFoundException(`이메일 그룹 ID ${id}를 찾을 수 없습니다.`);
    }
    return emailGroup;
  }

  async update(id: number, updateEmailGroupDto: UpdateEmailGroupDto) {
    const emailGroup = await this.findOne(id);
    Object.assign(emailGroup, updateEmailGroupDto);
    return this.emailGroupRepository.save(emailGroup);
  }

  async addEmails(id: number, file: Express.Multer.File) {
    const emailGroup = await this.findOne(id);
    await this.processEmailFile(emailGroup.id, file);
    return emailGroup;
  }

  async remove(id: number) {
    const emailGroup = await this.findOne(id);
    return this.emailGroupRepository.remove(emailGroup);
  }

  private async processEmailFile(groupId: number, file: Express.Multer.File) {
    let emails: string[] = [];

    if (file.mimetype === 'text/csv') {
      const content = file.buffer.toString('utf-8');
      const records = csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
      });

      emails = records.map((record: { email: string }) => record.email);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const records = xlsx.utils.sheet_to_json(worksheet);

      emails = records.map((record: { email: string }) => record.email);
    } else {
      throw new BadRequestException('지원하지 않는 파일 형식입니다.');
    }

    // 상태를 WAITING으로 업데이트
    await this.emailGroupRepository.update(groupId, {
      status: EmailGroupStatus.WAITING,
    });

    // 이메일 처리 작업을 큐에 추가
    const job = await this.emailQueue.add({ groupId, emails });

    return job;
  }
}
