import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateEmailGroupDto {
  @ApiProperty({ description: '이메일 그룹 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '이메일 그룹 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '머지 필드 목록',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  mergeFields?: string[];
}
