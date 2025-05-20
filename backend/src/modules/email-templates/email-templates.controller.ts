import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailTemplate } from '../../database/entities/bulk-email/email-template.entity';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { FindTemplatesDto } from './dto/find-templates.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { EmailTemplatesService } from './email-templates.service';

@ApiTags('이메일 템플릿')
@Controller('api/v1/email-templates')
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Post()
  @ApiOperation({ summary: '이메일 템플릿 생성' })
  @ApiResponse({ status: 201, type: EmailTemplate })
  create(
    @Body() createEmailTemplateDto: CreateEmailTemplateDto,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.create(createEmailTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: '이메일 템플릿 목록 조회' })
  @ApiResponse({ status: 200, type: [EmailTemplate] })
  async findAll(@Query() findTemplatesDto: FindTemplatesDto): Promise<{
    items: EmailTemplate[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const [items, total] =
      await this.emailTemplatesService.findAll(findTemplatesDto);
    const { page, pageSize } = findTemplatesDto;

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '이메일 템플릿 상세 조회' })
  @ApiResponse({ status: 200, type: EmailTemplate })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EmailTemplate> {
    return this.emailTemplatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '이메일 템플릿 수정' })
  @ApiResponse({ status: 200, type: EmailTemplate })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.update(id, updateEmailTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '이메일 템플릿 삭제 (소프트 삭제)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.emailTemplatesService.softDelete(id);
  }

  @Delete(':id/permanent')
  @ApiOperation({ summary: '이메일 템플릿 영구 삭제' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async permanentRemove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.emailTemplatesService.remove(id);
  }
}
