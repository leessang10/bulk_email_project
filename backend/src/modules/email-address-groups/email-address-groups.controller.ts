import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EmailAddressGroup } from '../../database/entities/bulk-email/email-group.entity';
import { CreateEmailGroupDto } from './dto/create-email-group.dto';
import { UpdateEmailGroupDto } from './dto/update-email-group.dto';
import { EmailAddressGroupsService } from './email-address-groups.service';

@ApiTags('이메일 그룹')
@Controller('email-address-groups')
export class EmailAddressGroupsController {
  constructor(
    private readonly emailAddressGroupsService: EmailAddressGroupsService,
  ) {}

  @Post()
  @ApiOperation({ summary: '이메일 그룹 생성' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '이메일 그룹 이름' },
        description: { type: 'string', description: '이메일 그룹 설명' },
        file: {
          type: 'string',
          format: 'binary',
          description: '이메일 주소 목록 엑셀 파일',
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: EmailAddressGroup })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createEmailGroupDto: CreateEmailGroupDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.emailAddressGroupsService.create(createEmailGroupDto, file);
  }

  @Get()
  @ApiOperation({ summary: '이메일 그룹 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/EmailGroup' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        pageSize: { type: 'number' },
      },
    },
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.emailAddressGroupsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '이메일 그룹 상세 조회' })
  @ApiParam({ name: 'id', description: '이메일 그룹 ID' })
  @ApiResponse({ status: HttpStatus.OK, type: EmailAddressGroup })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이메일 그룹을 찾을 수 없음',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emailAddressGroupsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '이메일 그룹 수정' })
  @ApiParam({ name: 'id', description: '이메일 그룹 ID' })
  @ApiResponse({ status: HttpStatus.OK, type: EmailAddressGroup })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이메일 그룹을 찾을 수 없음',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailGroupDto: UpdateEmailGroupDto,
  ) {
    return this.emailAddressGroupsService.update(id, updateEmailGroupDto);
  }

  @Post(':id/emails')
  @ApiOperation({ summary: '이메일 그룹에 이메일 일괄 추가' })
  @ApiParam({ name: 'id', description: '이메일 그룹 ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '이메일 주소 목록 엑셀 파일',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: HttpStatus.OK, type: EmailAddressGroup })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이메일 그룹을 찾을 수 없음',
  })
  @UseInterceptors(FileInterceptor('file'))
  async addEmails(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.emailAddressGroupsService.addEmails(id, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: '이메일 그룹 삭제' })
  @ApiParam({ name: 'id', description: '이메일 그룹 ID' })
  @ApiResponse({ status: HttpStatus.OK, type: EmailAddressGroup })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이메일 그룹을 찾을 수 없음',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.emailAddressGroupsService.remove(id);
  }
}
