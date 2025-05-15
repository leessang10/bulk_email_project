import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailAddressType } from '../../../common/enums/email-address.enum';
import { BaseEntity } from '../base.entity';
import { EmailAddressGroup } from './email-group.entity';

@Entity({
  comment: '이메일 주소',
  name: 'tb_email_address',
  database: 'bulk_email',
})
@Index(['addressGroupId', 'email'], { unique: true })
export class EmailAddress extends BaseEntity {
  @ApiProperty({ description: '이메일 주소 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '주소 유형',
    enum: EmailAddressType,
  })
  @Column({
    type: 'enum',
    enum: EmailAddressType,
    default: EmailAddressType.NORMAL,
  })
  addressType: EmailAddressType;

  @ApiProperty({ description: '이메일 주소' })
  @Column({ length: 255 })
  email: string;

  @ApiProperty({ description: '이름' })
  @Column({ length: 100, nullable: true })
  name: string;

  @ApiProperty({ description: '구독 여부' })
  @Column({
    name: 'is_subscribed',
    type: 'boolean',
    default: true,
  })
  isSubscribed: boolean;

  @ApiProperty({ description: '메모' })
  @Column({ type: 'text', nullable: true })
  memo: string;

  @ApiProperty({ description: '이메일 그룹 ID' })
  @Column({ name: 'address_group_id' })
  addressGroupId: number;

  @ManyToOne(() => EmailAddressGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'address_group_id' })
  addressGroup: EmailAddressGroup;
}
