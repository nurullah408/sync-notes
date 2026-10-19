import type { Note } from "../entities/Note";

export interface GetNoteParams {
  noteId: string;
}

export interface UpdateNoteParams {
  body: Partial<Note>;
}
