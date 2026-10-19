import { Prisma } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SidebarService {
  constructor(private prisma: Prisma) {}

  async getSidebar(userId: number) {
    const [notes, folders] = await Promise.all([
      this.prisma.note.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        select: {
          id: true,
          title: true,
          folderId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.folder.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          color: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);
    return { notes, folders };
  }
}
