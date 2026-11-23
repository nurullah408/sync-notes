import { updateNote } from "@/api/notes.api";
import { queryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/query-keys";
import { showRetryCountdownToast } from "@/lib/utils";
import type { Note } from "@/types/entities/Note";
import type { ApiResponse } from "@/types/response/ApiResponse";
import type { SidebarData } from "@/types/response/Sidebar";
import { useMutation } from "@tanstack/react-query";

type UseNoteMutationsParams = {
    noteId: string;
};

export function useNoteMutations({ noteId }: UseNoteMutationsParams) {
    const updateNoteMutation = useMutation({
        mutationKey: ["notes", "update"],
        mutationFn: updateNote,
        scope: {
            id: `note-${noteId}`,
        },
        retry: 3,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
        onMutate: async (variables) => {
            const noteQueryKey = QUERY_KEYS.notesDetail(noteId);
            const sidebarQueryKey = QUERY_KEYS.sidebar;
            // prevent an in-flight request
            await Promise.all([
                queryClient.cancelQueries({ queryKey: noteQueryKey }),
                queryClient.cancelQueries({ queryKey: sidebarQueryKey }),
            ]);

            const previousNote =
                queryClient.getQueryData<ApiResponse<Note>>(noteQueryKey);

            const previousSidebar =
                queryClient.getQueryData<ApiResponse<SidebarData>>(
                    sidebarQueryKey,
                );
            // Note Detail Update
            queryClient.setQueryData<ApiResponse<Note>>(noteQueryKey, (old) => {
                if (!old) return old;
                const { id: _id, ...patch } = variables;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        ...patch,
                    },
                };
            });

            //Sidebar Update
            if (variables.title !== undefined) {
                queryClient.setQueryData<ApiResponse<SidebarData>>(
                    sidebarQueryKey,
                    (old) => {
                        if (!old) return old;

                        return {
                            ...old,
                            data: {
                                ...old.data,
                                notes: old.data.notes.map((note) =>
                                    note.id === variables.id
                                        ? {
                                              ...note,
                                              title:
                                                  variables.title ?? "Untitled",
                                          }
                                        : note,
                                ),
                            },
                        };
                    },
                );
            }

            return {
                previousNote,
                previousSidebar,
                noteQueryKey,
                sidebarQueryKey,
            };
        },
        onError: (_error, _variables, context) => {
            // Show error for note if request fails.
            if (context?.previousNote) {
                showRetryCountdownToast(10, _error?.message);
            }
            // Roll back sidebar if request fails
            if (context?.previousSidebar) {
                queryClient.setQueryData(
                    context.sidebarQueryKey,
                    context.previousSidebar,
                );
            }
        },
        onSuccess: (response, variables) => {
            // Reconcile the cache with the server's authoritative response.
            queryClient.setQueryData(
                QUERY_KEYS.notesDetail(variables.id),
                (old) =>
                    old
                        ? {
                              ...old,
                              updatedAt: response.data.updatedAt,
                          }
                        : old,
            );
        },
    });

    const moveNoteMutation = useMutation({
        mutationKey: ["notes", "update"],
        mutationFn: updateNote,
        scope: {
            id: `note-${noteId}`,
        },
        onMutate: async (variables) => {
            const sidebarQueryKey = QUERY_KEYS.sidebar;
            // prevent an in-flight request
            await Promise.all([
                queryClient.cancelQueries({ queryKey: sidebarQueryKey }),
            ]);

            const previousSidebar =
                queryClient.getQueryData<ApiResponse<SidebarData>>(
                    sidebarQueryKey,
                );

            //Sidebar Update
            if (variables.folderId !== undefined) {
                queryClient.setQueryData<ApiResponse<SidebarData>>(
                    sidebarQueryKey,
                    (old) => {
                        if (!old) return old;

                        return {
                            ...old,
                            data: {
                                ...old.data,
                                notes: old.data.notes.map((note) =>
                                    note.id === variables.id
                                        ? {
                                              ...note,
                                              foldeId: variables.folderId,
                                          }
                                        : note,
                                ),
                            },
                        };
                    },
                );
            }

            return {
                previousSidebar,
                sidebarQueryKey,
            };
        },
        onError: (_error, _variables, context) => {
            // Roll back sidebar if request fails
            if (context?.previousSidebar) {
                queryClient.setQueryData(
                    context.sidebarQueryKey,
                    context.previousSidebar,
                );
            }
        },
        onSuccess: (response, variables) => {
            // Reconcile the cache with the server's authoritative response.
            queryClient.setQueryData(
                QUERY_KEYS.notesDetail(variables.id),
                (old) =>
                    old ? { ...old, folderId: response.data.folderId } : old,
            );
        },
    });

    return {
        updateNoteMutation,
        moveNoteMutation,
    };
}
