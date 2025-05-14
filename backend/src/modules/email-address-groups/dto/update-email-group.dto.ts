import { PartialType } from '@nestjs/swagger';
import { CreateEmailGroupDto } from './create-email-group.dto';

export class UpdateEmailGroupDto extends PartialType(CreateEmailGroupDto) {}
