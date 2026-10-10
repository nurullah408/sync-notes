import { Test, TestingModule } from '@nestjs/testing';
import { FoldersService } from './folders.service';
import { Prisma } from '@/prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';

type MockPrisma = {
  folder: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    upsert: jest.Mock;
  };
  $queryRaw: jest.Mock;
};

describe('FoldersService', () => {
  let service: FoldersService;
  const mockPrisma: MockPrisma = {
    folder: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoldersService, { provide: Prisma, useValue: mockPrisma }],
    }).compile();

    service = module.get<FoldersService>(FoldersService);
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('Should create a folder when passed folderId, name and userId', async () => {
      const dto: CreateFolderDto = {
        id: 'folder-1',
        name: 'folder 1',
        color: '#2312',
        updatedAt: new Date(),
        isDeleted: false,
        deletedAt: new Date(),
      };
      const createdFolder = { ...dto, userId: 123 };
      mockPrisma.folder.create.mockResolvedValue(createdFolder);
      const result = await service.create(123, dto);
      expect(result).toEqual(createdFolder);
      expect(mockPrisma.folder.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          userId: 123,
        },
      });
    });
  });
});
