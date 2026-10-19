import type { NoteMeta } from "../entities/Note";

export interface NoteItem extends NoteMeta {
  type: "note";
  depth: number;
}
