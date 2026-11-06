import { BASE_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import type { Folder } from "@/types/entities/Folder";
import type { GetFolderParams } from "@/types/requests/folders";
import type { ApiResponse } from "@/types/response/ApiResponse";

export async function createFolder(
  body: Partial<Folder> & { id: string },
): Promise<ApiResponse<Folder>> {
  const response = await apiClient(`${BASE_URL}/folders`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to create folder");
  }
  return response.json();
}

export async function getFolder({
  id,
}: GetFolderParams): Promise<ApiResponse<Folder>> {
  const response = await apiClient(`${BASE_URL}/folders/${id}`);
  if (!response.ok) {
    throw new Error("Failed to create folder");
  }
  return response.json();
}

export async function updateFolder(
  body: Partial<Folder> & { id: string },
): Promise<ApiResponse<Folder>> {
  const response = await apiClient(`${BASE_URL}/folders/${body.id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to update Folder");
  }
  return response.json();
}

export async function deleteFolder(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient(`${BASE_URL}/folders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete folder");
  }
  return response.json();
}
