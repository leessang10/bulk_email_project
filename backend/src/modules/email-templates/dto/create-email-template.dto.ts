import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEmailTemplateDto {
  @ApiProperty({ description: '템플릿 이름', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '이메일 제목', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  subject: string;

  @ApiProperty({ description: '이메일 본문 내용' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '메일 머지 필드 정보' })
  @IsArray()
  @IsOptional()
  mailMergeFields?: Record<string, string>[];

  @ApiPropertyOptional({ description: '테스트 데이터' })
  @IsObject()
  @IsOptional()
  testData?: Record<string, any>;

  @ApiPropertyOptional({ description: '카테고리', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;
}
