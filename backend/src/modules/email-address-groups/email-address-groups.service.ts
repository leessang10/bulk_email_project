import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import * as csv from 'csv-parse/sync';
import { Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EmailGroupStatus } from '../../common/enums/email-group.enum';
import { EmailAddressGroup } from '../../database/entities/bulk-email/email-group.entity';
import { CreateEmailGroupDto } from './dto/create-email-group.dto';
import { UpdateEmailGroupDto } from './dto/update-email-group.dto';

const ALLOWED_SORT_FIELDS = [
  'name',
  'addressCount',
  'createdAt',
  'updatedAt',
  'status',
];

@Injectable()
export class EmailAddressGroupsService {
  private readonly logger = new Logger(EmailAddressGroupsService.name);
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
    const {
      page,
      pageSize,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
    } = paginationDto;

    // 정렬 필드 유효성 검사
    if (sortBy && !ALLOWED_SORT_FIELDS.includes(sortBy)) {
      throw new BadRequestException(
        `Invalid sortBy field. Allowed fields are: ${ALLOWED_SORT_FIELDS.join(', ')}`,
      );
    }

    const queryBuilder = this.emailGroupRepository.createQueryBuilder('group');

    // 검색어가 있는 경우
    if (search) {
      queryBuilder.where('group.name ILIKE :search', { search: `%${search}%` });
    }

    // 정렬
    if (sortBy) {
      queryBuilder.orderBy(
        `group.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // 페이지네이션
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
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

      emails = records.map((record: { Email: string }) => record.Email);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const records = xlsx.utils.sheet_to_json(worksheet);

      emails = records.map((record: { Email: string }) => record.Email);
    } else {
      throw new BadRequestException('지원하지 않는 파일 형식입니다.');
    }

    // 상태를 WAITING으로 업데이트
    await this.emailGroupRepository.update(groupId, {
      status: EmailGroupStatus.WAITING,
    });

    this.logger.log(`이메일 처리 작업을 큐에 추가: ${groupId}`);
    this.logger.log(`이메일 갯수: ${emails.length}`);

    // 이메일 처리 작업을 큐에 추가
    const job = await this.emailQueue.add('INSERT_EMAILS', {
      groupId: Number(groupId),
      emails: emails,
    });

    return job;
  }
}
