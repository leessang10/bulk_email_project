import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FindEmailGroupsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: '검색어 (그룹 이름, 설명)',
  })
  @IsString()
  @IsOptional()
  override search: string = '';

  @ApiPropertyOptional({
    description: '활성화 여부',
    default: true,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}
