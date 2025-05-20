import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({
  comment: '이메일 템플릿',
  name: 'tb_email_template',
  database: 'bulk_email',
})
export class EmailTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true, name: 'mail_merge_fields' })
  mailMergeFields: Record<string, string>[];

  @Column({ type: 'json', nullable: true, name: 'test_data' })
  testData: Record<string, any>;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt: Date;
}
