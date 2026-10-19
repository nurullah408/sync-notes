import { Controller, Get, UseGuards } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.auth-guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import type { RequestUser } from '@/auth/types/JwtPayload';

@UseGuards(JwtAuthGuard)
@Controller('sidebar')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Get()
  getSidebar(@GetUser() user: RequestUser) {
    return this.sidebarService.getSidebar(user.id);
  }
}
