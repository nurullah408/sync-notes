import { BASE_URL } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import type { Folder, FolderMeta } from "@/types/entities/Folder";
import type { NoteMeta } from "@/types/entities/Note";
import type { ApiResponse } from "@/types/response/ApiResponse";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";

export const foldersCollection = createCollection(
  queryCollectionOptions({
    queryClient: queryClient,
    id: "folders",
    queryKey: ["sidebar"],
    queryFn: async () => {
      const response = await apiClient(`${BASE_URL}/sidebar`);
      return response.json();
    },
    select: (response) => response.data.folders,
    getKey: (folder: Folder) => folder.id,
    // Handle CRUD operations
    onInsert: async ({ transaction }) => {
      const { modified: newFolder } = transaction.mutations[0];
      await apiClient(`${BASE_URL}/folders`, {
        method: "POST",
        body: JSON.stringify(newFolder),
      });
      return { refetch: false };
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await apiClient(`${BASE_URL}/folders/${original.id}`, {
        method: "PATCH",
        body: JSON.stringify(modified),
      });
      return { refetch: false };
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await apiClient(`${BASE_URL}/folders/${original.id}`, {
        method: "DELETE",
      });
      return { refetch: false };
    },
  }),
);
