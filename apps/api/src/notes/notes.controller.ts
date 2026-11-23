import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth-guard';
import type { RequestUser } from '@/auth/types/JwtPayload';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { SyncChangesDto } from './dto/sync-changes.dto';
import { SyncService } from './sync.service';
import { SearchNotesDto } from './dto/search-notes.dto';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly syncService: SyncService,
  ) {}

  @Post()
  create(@GetUser() user: RequestUser, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(user.id, createNoteDto);
  }

  @Get()
  findAll(@GetUser() user: RequestUser) {
    return this.notesService.findAll(user.id);
  }

  @Get('search')
  async searchNotes(
    @GetUser() user: RequestUser,
    @Query() searchDto: SearchNotesDto,
  ) {
    return this.notesService.searchNotes(user.id, searchDto.query);
  }

  @Get(':id')
  findOne(@GetUser() user: RequestUser, @Param('id') id: string) {
    return this.notesService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: RequestUser,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(user.id, id, updateNoteDto);
  }

  @Delete(':id')
  remove(@GetUser() user: RequestUser, @Param('id') id: string) {
    return this.notesService.remove(user.id, id);
  }

  @Post('sync/changes')
  async syncChanges(
    @GetUser() user: RequestUser,
    @Body() syncChangesDto: SyncChangesDto,
  ) {
    return this.syncService.processSyncChanges(user.id, syncChangesDto);
  }
}
