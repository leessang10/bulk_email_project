import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ comment: '수신거부', name: 'tb_unsubscribe', database: 'bulk_email' })
export class Unsubscribe {
  @ApiProperty({ description: '수신거부 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '이메일 주소' })
  @Column({ length: 255 })
  email: string;

  @ApiProperty({ description: '수신거부 사유' })
  @Column({ type: 'text', nullable: true })
  reason: string;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
