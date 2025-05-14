import { Test, TestingModule } from '@nestjs/testing';
import { EmailAddressGroupsController } from './email-address-groups.controller';
import { EmailAddressGroupsService } from './email-address-groups.service';

describe('EmailAddressGroupsController', () => {
  let controller: EmailAddressGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailAddressGroupsController],
      providers: [EmailAddressGroupsService],
    }).compile();

    controller = module.get<EmailAddressGroupsController>(EmailAddressGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
