import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  comment: '이메일 그룹',
  name: 'tb_email_address_group',
  database: 'bulk_email',
})
export class EmailAddressGroup {
  @ApiProperty({ description: '이메일 그룹 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '이메일 그룹 이름' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: '지역' })
  @Column({ length: 50 })
  region: string;

  @ApiProperty({ description: '상태', enum: ['ACTIVE', 'INACTIVE', 'DELETED'] })
  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
    default: 'ACTIVE',
  })
  status: string;

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

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
