import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: '페이지 번호',
    default: 1,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    default: 10,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize: number = 10;

  @ApiPropertyOptional({
    description: '정렬 기준 필드',
    default: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';

  @ApiPropertyOptional({
    description: '정렬 방향',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: '검색어',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
