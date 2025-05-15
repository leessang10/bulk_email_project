import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateEmailGroupDto {
  @ApiProperty({ description: '이메일 그룹 이름' })
  @IsString()
  name: string;

  mailMergeData?: Record<string, any>;
}
