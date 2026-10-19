import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { apiClient } from "@/lib/api-client";
import { BASE_URL } from "@/constants";
import type { Note } from "@/types/entities/Note";
import { queryClient } from "@/lib/query-client";

export const notesCollection = createCollection(
  queryCollectionOptions({
    queryClient: queryClient,
    id: "notes",
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await apiClient(`${BASE_URL}/sidebar`);
      return response.json();
    },
    select: (response) => response.data.notes,
    getKey: (note: Note) => note.id,
    // Handle Crud Operations
    onInsert: async ({ transaction }) => {
      const { modified: newNote } = transaction.mutations[0];
      await apiClient(`${BASE_URL}/notes`, {
        method: "POST",
        body: JSON.stringify(newNote),
      });
      return { refetch: false };
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await apiClient(`${BASE_URL}/notes/${original.id}`, {
        method: "PATCH",
        body: JSON.stringify(modified),
      });
      return { refetch: false };
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await apiClient(`${BASE_URL}/notes/${original.id}`, {
        method: "DELETE",
      });
      return { refetch: false };
    },
  }),
);
