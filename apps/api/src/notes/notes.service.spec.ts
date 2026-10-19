import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

type MockPrisma = {
  note: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    upsert: jest.Mock;
  };
  $queryRaw: jest.Mock;
};

describe('NotesService', () => {
  let service: NotesService;
  // 1. Create a Mock Prisma Object
  const mockPrisma: MockPrisma = {
    note: {
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
      providers: [
        NotesService,
        {
          provide: Prisma,
          useValue: mockPrisma,
        }, // Inject the mock
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clean up between tests
  });

  describe('create', () => {
    it('should preserve lexical editor state when creating a note', async () => {
      const content = JSON.stringify({
        root: {
          type: 'root',
          version: 1,
          indent: 0,
          format: 'start',
          direction: null,
          children: [],
        },
      });

      const dto: CreateNoteDto = {
        id: 'note-1',
        title: 'test note',
        content,
        searchContent: '',
        isDeleted: false,
        folderId: null,
        updatedAt: new Date(),
      };

      const createdNote = { ...dto, userId: 123 };

      mockPrisma.note.create.mockResolvedValue(createdNote);

      const result = await service.create(123, dto);

      expect(result).toEqual(createdNote);
      expect(mockPrisma?.note?.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          userId: 123,
        },
      });
    });

    it('should throw NotFoundException if note does not exist', async () => {
      mockPrisma.note.findUnique.mockResolvedValue(null);

      await expect(service.findOne(123, '999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('Should return notes for the user ordered by updatedAt descending', async () => {
      const notes = [{ id: 'note-1' }, { id: 'note-2' }];
      mockPrisma.note.findMany.mockResolvedValue(notes);

      const result = await service.findAll(123);

      expect(result).toEqual(notes);

      expect(mockPrisma.note.findMany).toHaveBeenCalledWith({
        where: { userId: 123 },
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('remove', () => {
    it('Should delete a note belonging to a user', async () => {
      const deletedNote = { id: 'note-1', userId: 123 };
      mockPrisma.note.delete.mockResolvedValue(deletedNote);

      const result = await service.remove(123, 'note-1');

      expect(result).toEqual(deletedNote);
      expect(mockPrisma.note.delete).toHaveBeenCalledWith({
        where: {
          userId: 123,
          id: 'note-1',
        },
      });
    });

    it('Should propagate an error if prisma cannot delete a note', async () => {
      mockPrisma.note.delete.mockRejectedValue(new Error('Database Error'));
      await expect(service.remove(123, 'note-2')).rejects.toThrow(
        'Database Error',
      );
    });
  });
});
