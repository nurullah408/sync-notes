import { PartialType } from '@nestjs/swagger';
import { CreateSidebarDto } from './create-sidebar.dto';

export class UpdateSidebarDto extends PartialType(CreateSidebarDto) {}
