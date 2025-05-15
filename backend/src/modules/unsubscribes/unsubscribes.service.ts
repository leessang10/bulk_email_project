import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unsubscribe } from '../../database/entities/bulk-email/unsubscribe.entity';
import { FindUnsubscribeDto } from './dto/unsubscribe.dto';

@Injectable()
export class UnsubscribesService {
  constructor(
    @InjectRepository(Unsubscribe, 'bulk_email')
    private readonly unsubscribeRepository: Repository<Unsubscribe>,
  ) {}

  async findAll(findUnsubscribeDto: FindUnsubscribeDto) {
    const {
      email,
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = findUnsubscribeDto;

    const queryBuilder =
      this.unsubscribeRepository.createQueryBuilder('unsubscribe');

    if (email) {
      queryBuilder.where('unsubscribe.email LIKE :email', {
        email: `%${email}%`,
      });
    }

    const [items, total] = await queryBuilder
      .orderBy(`unsubscribe.${sortBy}`, sortOrder)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
