import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from '../../database/entities/bulk-email/email-template.entity';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { FindTemplatesDto } from './dto/find-templates.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';

@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate, 'bulk_email')
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
  ) {}

  async create(
    createEmailTemplateDto: CreateEmailTemplateDto,
  ): Promise<EmailTemplate> {
    const template = this.emailTemplateRepository.create(
      createEmailTemplateDto,
    );
    return this.emailTemplateRepository.save(template);
  }

  async findAll(dto: FindTemplatesDto): Promise<[EmailTemplate[], number]> {
    const { category, isActive, search, page, pageSize, sortBy, sortOrder } =
      dto;

    const queryBuilder = this.emailTemplateRepository
      .createQueryBuilder('template')
      .where('template.isActive = :isActive', { isActive });

    if (category) {
      queryBuilder.andWhere('template.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(template.name LIKE :search OR template.subject LIKE :search OR template.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder
      .orderBy(`template.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  }

  async findOne(id: number): Promise<EmailTemplate> {
    const template = await this.emailTemplateRepository.findOne({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException(`Email template with ID ${id} not found`);
    }
    return template;
  }

  async update(
    id: number,
    updateEmailTemplateDto: UpdateEmailTemplateDto,
  ): Promise<EmailTemplate> {
    const template = await this.findOne(id);

    Object.assign(template, updateEmailTemplateDto);

    return this.emailTemplateRepository.save(template);
  }

  async remove(id: number): Promise<void> {
    const template = await this.findOne(id);
    await this.emailTemplateRepository.remove(template);
  }

  async softDelete(id: number): Promise<void> {
    const template = await this.findOne(id);
    template.isActive = false;
    await this.emailTemplateRepository.save(template);
  }

  async updateLastUsed(id: number): Promise<void> {
    await this.emailTemplateRepository.update(id, {
      lastUsedAt: new Date(),
    });
  }
}
