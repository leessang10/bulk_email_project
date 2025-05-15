import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FindUnsubscribeDto,
  UnsubscribeResponseDto,
} from './dto/unsubscribe.dto';
import { UnsubscribesService } from './unsubscribes.service';

@ApiTags('수신거부')
@Controller('unsubscribe')
export class UnsubscribesController {
  constructor(private readonly unsubscribeService: UnsubscribesService) {}

  @Get()
  @ApiOperation({ summary: '수신거부 목록 조회' })
  @ApiResponse({ status: 200, type: [UnsubscribeResponseDto] })
  async findAll(@Query() findUnsubscribeDto: FindUnsubscribeDto) {
    return await this.unsubscribeService.findAll(findUnsubscribeDto);
  }
}
