import { BASE_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import type { INodeEdge } from "@/types/entities/INodeEdge";
import type { ApiResponse } from "@/types/response/ApiResponse";

export async function createNodeEdge(
  body: INodeEdge,
): Promise<ApiResponse<INodeEdge>> {
  const response = await apiClient(`${BASE_URL}/edge`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to create Node Edge");
  }
  return response.json();
}

export async function getNodeEdgesOfNote(
  noteId: string,
): Promise<ApiResponse<INodeEdge[]>> {
  const response = await apiClient(`${BASE_URL}/edge/note/${noteId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch linked notes");
  }
  return response.json();
}
