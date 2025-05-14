import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: '페이지당 항목 수', default: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @ApiProperty({ description: '건너뛸 항목 수', default: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  skip: number = 0;

  @ApiProperty({ description: '정렬 기준', default: 'created_at' })
  @IsString()
  @IsOptional()
  sortBy: string = 'created_at';

  @ApiProperty({ description: '정렬 방향', default: 'DESC' })
  @IsString()
  @IsOptional()
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ description: '검색어', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
