import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from './prisma.service';

describe('PrismaDbService', () => {
  let service: Prisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Prisma],
    }).compile();

    service = module.get<Prisma>(Prisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
