import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';

import type { SyncNotesEditorState } from '@sync-notes/lexical';

export class BaseNoteDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string; // This will be generated on the client side

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  folderId!: string | null;

  @IsString()
  @IsNotEmpty()
  content!: SyncNotesEditorState; // To Map seamlessly to Prisma's native JSON typing

  @IsString()
  searchContent!: string;

  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @IsBoolean()
  isDeleted!: boolean;
}
