import { Module } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { SidebarController } from './sidebar.controller';
import { Prisma } from '@/prisma/prisma.service';

@Module({
  controllers: [SidebarController],
  providers: [SidebarService, Prisma],
})
export class SidebarModule {}
