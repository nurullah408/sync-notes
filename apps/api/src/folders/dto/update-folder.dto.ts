import { PartialType } from '@nestjs/mapped-types';
import { BaseFolderDto } from './base-folder.dto';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFolderDto extends PartialType(BaseFolderDto) {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  color!: string;

  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @IsOptional()
  @Type(() => Date)
  deletedAt: Date;

  @IsBoolean()
  isDeleted!: boolean;
}
