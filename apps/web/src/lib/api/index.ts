import type { FolderMeta } from "@/types/entities/Folder";
import type { NoteMeta } from "@/types/entities/Note";
import type { ApiResponse } from "@/types/response/ApiResponse";
import { apiClient } from "../api-client";
import { BASE_URL } from "@/constants";

export const getSidebar = async (): Promise<
  ApiResponse<{ notes: NoteMeta[]; folders: FolderMeta[] }>
> => {
  const response = await apiClient(`${BASE_URL}/sidebar`);
  return response.json();
};
