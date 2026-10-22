import { BASE_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import type { Note } from "@/types/entities/Note";
import type { SearchNoteResult } from "@/types/NoteSearchResult";
import type { GetNoteParams } from "@/types/requests/notes";
import type { ApiResponse } from "@/types/response/ApiResponse";

export async function getNote({
  noteId,
}: GetNoteParams): Promise<ApiResponse<Note>> {
  const response = await apiClient(`${BASE_URL}/notes/${noteId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch note. Status: ${response.status}`);
  }
  return response.json();
}

export async function searchNotes(
  search: string,
): Promise<ApiResponse<SearchNoteResult[]>> {
  const response = await apiClient(
    `${BASE_URL}/notes/search?query=${encodeURIComponent(search)}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  return response.json();
}

export async function createNote(body: Partial<Note> & { id: string }) {
  const response = await apiClient(`${BASE_URL}/notes`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to create note");
  }
  return response.json();
}

export async function updateNote(
  body: Partial<Note> & { id: string },
): Promise<ApiResponse<Note>> {
  const response = await apiClient(`${BASE_URL}/notes/${body.id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to update note`);
  }
  return response.json();
}

export async function deleteNote(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete note");
  }
  return response.json();
}
