import type { Note } from "@/types/entities/Note";
import { INITIAL_EDITOR_STATE } from "../constants";

export function createNewNote(props?: Partial<Note>): Note {
  const id = crypto.randomUUID();
  return {
    id,
    title: props?.title ?? "Untitled",
    content: INITIAL_EDITOR_STATE,
    searchContent: "",
    createdAt: props?.createdAt ?? new Date().toISOString(),
    updatedAt: props?.updatedAt ?? new Date().toISOString(),
    deletedAt: props?.deletedAt ?? null,
    isDeleted: props?.isDeleted ?? false,
    folderId: props?.folderId ?? null,
  };
}
