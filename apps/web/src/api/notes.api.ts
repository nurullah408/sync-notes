import { BASE_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import type { Note } from "@/types/entities/Note";
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
