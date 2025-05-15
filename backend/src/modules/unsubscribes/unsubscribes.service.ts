import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unsubscribe } from '../../database/entities/bulk-email/unsubscribe.entity';
import { FindUnsubscribeDto } from './dto/unsubscribe.dto';

@Injectable()
export class UnsubscribesService {
  constructor(
    @InjectRepository(Unsubscribe)
    private readonly unsubscribeRepository: Repository<Unsubscribe>,
  ) {}

  async findAll(findUnsubscribeDto: FindUnsubscribeDto) {
    const {
      email,
      page = 1,
      limit = 10,
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
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
