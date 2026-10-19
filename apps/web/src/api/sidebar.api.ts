import { BASE_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import type { Folder } from "@/types/entities/Folder";
import type { NoteMeta } from "@/types/entities/Note";
import type { ApiResponse } from "@/types/response/ApiResponse";

export async function getSidebar(): Promise<
  ApiResponse<{ notes: NoteMeta[]; folders: Folder[] }>
> {
  const response = await apiClient(`${BASE_URL}/sidebar`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sidebar`);
  }
  return response.json();
}
