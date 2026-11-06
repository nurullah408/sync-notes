import { createFolder, updateFolder, deleteFolder } from "@/api/folder.api";
import { createNote, deleteNote } from "@/api/notes.api";
import { queryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { Folder } from "@/types/entities/Folder";
import type { NoteMeta } from "@/types/entities/Note";
import type { ApiResponse } from "@/types/response/ApiResponse";
import { useMutation } from "@tanstack/react-query";

type SidebarData = {
  notes: NoteMeta[];
  folders: Folder[];
};

export function useSidebarMutations() {
  const createNoteMutation = useMutation({
    mutationKey: ["notes"],
    mutationFn: createNote,
    onMutate: async (variables) => {
      const queryKey = QUERY_KEYS.sidebar;

      await queryClient.cancelQueries({ queryKey });

      const previousSidebar =
        queryClient.getQueryData<ApiResponse<SidebarData>>(queryKey);

      queryClient.setQueryData<ApiResponse<SidebarData>>(queryKey, (old) => {
        if (!old) return old;
        const { id: _id, content, searchContent, ...patch } = variables;
        return {
          ...old,
          data: {
            ...old.data,
            notes: [
              ...old.data.notes,
              {
                id: _id,
                title: "Untitled",
                folderId: patch.folderId ?? null,
                createdAt: patch.createdAt ?? new Date().toISOString(),
                updatedAt: patch.updatedAt ?? new Date().toISOString(),
                deletedAt: patch.deletedAt ?? null,
                isDeleted: patch.isDeleted ?? false,
              },
            ],
          },
        };
      });
      return { previousSidebar, queryKey };
    },
    onError: (_error, _variables, context) => {
      // Roll back if the request fails.
      if (context?.previousSidebar) {
        queryClient.setQueryData(context.queryKey, context.previousSidebar);
      }
    },
  });

  const deleteNoteMutation = useMutation({
    mutationKey: ["notes"],
    mutationFn: deleteNote,
    onMutate: async (noteId) => {
      const queryKey = QUERY_KEYS.sidebar;

      await queryClient.cancelQueries({ queryKey });

      const previousSidebar =
        queryClient.getQueryData<ApiResponse<SidebarData>>(queryKey);

      queryClient.setQueryData<ApiResponse<SidebarData>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            notes: old.data.notes.filter((note) => note.id !== noteId),
          },
        };
      });
      return { previousSidebar, queryKey };
    },
    onError: (_error, _variables, context) => {
      // Roll back if the request fails.
      if (context?.previousSidebar) {
        queryClient.setQueryData(context.queryKey, context.previousSidebar);
      }
    },
  });

  const createFolderMutation = useMutation({
    mutationKey: ["folders"],
    mutationFn: createFolder,
    onMutate: async (variables) => {
      const queryKey = QUERY_KEYS.sidebar;

      await queryClient.cancelQueries({ queryKey });

      const previousSidebar =
        queryClient.getQueryData<ApiResponse<SidebarData>>(queryKey);

      queryClient.setQueryData<ApiResponse<SidebarData>>(queryKey, (old) => {
        if (!old) return old;

        const { id: _id, ...patch } = variables;

        return {
          ...old,
          data: {
            ...old.data,
            folders: [
              ...old.data.folders,
              {
                id: _id,
                name: patch.name ?? "Untitled",
                color: patch.color ?? "#ffff",
                createdAt: patch.createdAt ?? new Date().toISOString(),
                updatedAt: patch.updatedAt ?? new Date().toISOString(),
                deletedAt: null,
                isDeleted: false,
              },
            ],
          },
        };
      });
      return { queryKey, previousSidebar };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSidebar) {
        queryClient.setQueryData(context.queryKey, context.previousSidebar);
      }
    },
  });

  const updateFolderMutation = useMutation({
    mutationKey: ["folders"],
    mutationFn: updateFolder,
    onMutate: async (variables) => {
      const queryKey = QUERY_KEYS.sidebar;

      await queryClient.cancelQueries({ queryKey });

      const previousSidebar =
        queryClient.getQueryData<ApiResponse<SidebarData>>(queryKey);

      queryClient.setQueryData<ApiResponse<SidebarData>>(queryKey, (old) => {
        if (!old) return old;

        const { id: _id, ...patch } = variables;

        return {
          ...old,
          data: {
            ...old.data,
            folders: old.data.folders.map((f) => {
              return f.id === _id ? { ...f, ...patch } : f;
            }),
          },
        };
      });
      return { queryKey, previousSidebar };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSidebar) {
        queryClient.setQueryData(context.queryKey, context.previousSidebar);
      }
    },
  });

  const deleteFolderMutation = useMutation({
    mutationKey: ["folders"],
    mutationFn: deleteFolder,
    onMutate: async (folderId) => {
      const queryKey = QUERY_KEYS.sidebar;

      await queryClient.cancelQueries({ queryKey });

      const previousSidebar =
        queryClient.getQueryData<ApiResponse<SidebarData>>(queryKey);

      queryClient.setQueryData<ApiResponse<SidebarData>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            folders: old.data.folders.filter((f) => f.id !== folderId),
            notes: old.data.notes.filter((note) => note.folderId !== folderId),
          },
        };
      });
      return { previousSidebar, queryKey };
    },
    onError: (_error, _variables, context) => {
      // Roll back if the request fails.
      if (context?.previousSidebar) {
        queryClient.setQueryData(context.queryKey, context.previousSidebar);
      }
    },
  });

  return {
    createNoteMutation,
    deleteNoteMutation,
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
  };
}
