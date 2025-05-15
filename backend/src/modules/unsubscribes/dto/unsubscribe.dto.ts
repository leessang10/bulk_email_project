import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUnsubscribeDto {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '수신거부 사유', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class UnsubscribeResponseDto {
  @ApiProperty({ description: '수신거부 ID' })
  id: number;

  @ApiProperty({ description: '이메일 주소' })
  email: string;

  @ApiProperty({ description: '수신거부 사유' })
  reason: string;

  @ApiProperty({ description: '생성일시' })
  createdAt: Date;
}

export class FindUnsubscribeDto {
  @ApiProperty({ description: '검색할 이메일 주소', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '페이지', required: false, default: 1 })
  page?: number;

  @ApiProperty({
    description: '페이지당 항목 수',
    required: false,
    default: 10,
  })
  limit?: number;

  @ApiProperty({
    description: '정렬 기준',
    required: false,
    default: 'createdAt',
  })
  sortBy?: string;

  @ApiProperty({ description: '정렬 방향', required: false, default: 'DESC' })
  sortOrder?: 'ASC' | 'DESC';
}
