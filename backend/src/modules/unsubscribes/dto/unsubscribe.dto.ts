import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: '페이지당 항목 수',
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({
    description: '정렬 기준',
    required: false,
    default: 'createdAt',
    enum: ['email', 'createdAt'],
  })
  @IsString()
  @IsIn(['email', 'createdAt'])
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: '정렬 방향',
    required: false,
    default: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class UnsubscribeListResponseDto {
  @ApiProperty({ description: '수신거부 목록' })
  items: UnsubscribeResponseDto[];

  @ApiProperty({ description: '전체 항목 수' })
  total: number;

  @ApiProperty({ description: '현재 페이지' })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수' })
  pageSize: number;

  @ApiProperty({ description: '전체 페이지 수' })
  totalPages: number;
}
