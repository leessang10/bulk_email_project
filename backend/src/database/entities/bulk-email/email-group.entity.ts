import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  EmailGroupRegion,
  EmailGroupStatus,
} from '../../../common/enums/email-group.enum';
import { BaseEntity } from '../base.entity';

@Entity({
  comment: '이메일 그룹',
  name: 'tb_email_address_group',
  database: 'bulk_email',
})
export class EmailAddressGroup extends BaseEntity {
  @ApiProperty({ description: '이메일 그룹 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '이메일 그룹 이름' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: '지역', enum: EmailGroupRegion })
  @Column({
    type: 'enum',
    enum: EmailGroupRegion,
    default: EmailGroupRegion.DOMESTIC,
  })
  region: EmailGroupRegion;

  @ApiProperty({ description: '상태', enum: EmailGroupStatus })
  @Column({
    type: 'enum',
    enum: EmailGroupStatus,
    default: EmailGroupStatus.PENDING,
  })
  status: EmailGroupStatus;

  @ApiProperty({ description: '이메일 주소 수' })
  @Column({ name: 'address_count', default: 0 })
  addressCount: number;

  @ApiProperty({ description: '메일 머지 데이터' })
  @Column({
    name: 'mail_merge_data',
    type: 'json',
    nullable: true,
  })
  mailMergeData: Record<string, any>;
}
