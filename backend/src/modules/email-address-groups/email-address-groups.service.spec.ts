import { Test, TestingModule } from '@nestjs/testing';
import { EmailAddressGroupsService } from './email-address-groups.service';

describe('EmailAddressGroupsService', () => {
  let service: EmailAddressGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailAddressGroupsService],
    }).compile();

    service = module.get<EmailAddressGroupsService>(EmailAddressGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
