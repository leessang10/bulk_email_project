import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FindTemplatesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: '카테고리',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    description: '활성화 여부',
    default: true,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @ApiPropertyOptional({
    description: '검색어 (템플릿 이름, 설명, 제목)',
  })
  @IsString()
  @IsOptional()
  override search: string = '';
}
