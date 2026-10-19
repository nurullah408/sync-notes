import type { Entity } from "./Entity";

export interface Note extends Entity {
  title: string;
  folderId: string | null;
  content: string;
  searchContent: string;
}

export interface NoteMeta extends Pick<Note, "id" | "title" | "folderId"> {}
