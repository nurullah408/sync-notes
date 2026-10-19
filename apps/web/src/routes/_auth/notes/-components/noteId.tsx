import { Editor } from "@/components/lexical-editor";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useDebouncedCallback } from "@/hooks/useDebounce.ts";
import { INITIAL_EDITOR_STATE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/entities/Note";
import { useParams } from "@tanstack/react-router";
import { $getRoot, type EditorState } from "lexical";
import { Check, LoaderPinwheel, Search } from "lucide-react";
import { type ChangeEvent } from "react";
import { useSyncContext } from "@/context/SyncContext";
import { useGlobalStore } from "@/store/store.tsx";
import { useHandleInternalLinkClick } from "../-hooks/useHandleInternalLinkClick";
import Profile from "@/components/Profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getNote, updateNote } from "@/api/notes.api";
import { queryClient } from "@/lib/query-client";
import type { ApiResponse } from "@/types/response/ApiResponse";

export function Note() {
  const params = useParams({ from: "/_auth/notes/$noteId" });

  const { open } = useSidebar();

  const { isSyncing } = useSyncContext();

  const openModal = useGlobalStore((state) => state.openModal);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.notesDetail(params.noteId),
    queryFn: () => getNote({ noteId: params.noteId }),
    staleTime: 5 * 60 * 1000,
  });

  const { mutate } = useMutation({
    mutationKey: ["notes", "update"],
    mutationFn: updateNote,
    scope: {
      id: `note-${params.noteId}`,
    },
    onMutate: async (variables) => {
      const queryKey = QUERY_KEYS.notesDetail(params.noteId);
      // prevent an in-flight request
      await queryClient.cancelQueries({ queryKey });

      const previousNote =
        queryClient.getQueryData<ApiResponse<Note>>(queryKey);

      queryClient.setQueryData<ApiResponse<Note>>(queryKey, (old) => {
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
      return { previousNote, queryKey };
    },
    onError: (_error, _variables, context) => {
      // Roll back if the request fails.
      if (context?.previousNote) {
        queryClient.setQueryData(context.queryKey, context.previousNote);
      }
    },
    onSuccess: (response, variables) => {
      // Reconcile the cache with the server's authoritative response.
      queryClient.setQueryData(QUERY_KEYS.notesDetail(variables.id), response);
    },
  });

  const note = data?.data;

  const updateNoteTitle = useDebouncedCallback(async (title: string) => {
    mutate({
      id: params.noteId,
      title,
      updatedAt: new Date().toISOString(),
    });
  }, 500);

  const updateNoteContent = useDebouncedCallback(
    async (editorState: EditorState) => {
      const { json, textContent } = editorState.read(() => {
        const root = $getRoot();
        const json = root.isEmpty()
          ? INITIAL_EDITOR_STATE // This is already stringified
          : JSON.stringify(editorState.toJSON());
        return { json, textContent: root.getTextContent() };
      });

      mutate({
        id: params.noteId,
        content: json,
        searchContent: textContent,
        updatedAt: new Date().toISOString(),
      } as Note);
    },
    500,
  );

  function onOpenSearch() {
    openModal("GLOBAL_SEARCH", null);
  }

  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    updateNoteTitle(value);
  }

  function onEditorChange(editorState: EditorState) {
    updateNoteContent(editorState);
  }

  useHandleInternalLinkClick();

  const title = note ? note.title : "Untitled";

  const content = note ? note.content : INITIAL_EDITOR_STATE;

  if (isLoading) {
    return (
      <div className="px-4 pt-2 border rounded h-full w-full">
        {/* Header */}
        <div className="flex gap-1 items-center justify-between">
          {/* Note header left side */}
          <div
            className={cn(
              "flex gap-1 items-center",
              open ? "invisible pointer-events-none" : "visible",
            )}
          >
            <SidebarTrigger />
          </div>
          <Button
            variant={"outline"}
            className="justify-between w-[40%] rounded-[10px]"
            onClick={onOpenSearch}
          >
            <Search />
            {"cmd+k"}
          </Button>
          {/* Note header right side */}
          <div className="flex gap-1 items-center">
            <div className="flex items-center gap-1">
              {isSyncing ? (
                <>
                  <LoaderPinwheel className="text-gray-500 duration-400 animate-spin size-4" />
                </>
              ) : (
                <>
                  <Check className="text-accent-foreground size-4" />
                </>
              )}
            </div>
            <Profile />
          </div>
        </div>
        <div className="relative flex flex-col gap-2 h-full overflow-hidden">
          <div className="w-full animate-pulse duration-300" />
          <h3 className="text-sm font-semibold text-gray-600">
            Last updated on{" "}
            <span className="italic text-sm animate-pulse duration-300" />
          </h3>
          <div className="h-[80%] rounded-lg overflow-y-auto animate-pulse duration-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 border rounded h-full w-full">
      <div className="flex gap-1 items-center justify-between">
        {/* Note header left side */}
        <div
          className={cn(
            "flex gap-1 items-center rounded-xl",
            open ? "invisible pointer-events-none" : "visible",
          )}
        >
          <SidebarTrigger />
        </div>
        <Button
          variant={"outline"}
          className="justify-between w-[40%] rounded-[10px]"
          onClick={onOpenSearch}
        >
          <Search />
          {"cmd+k"}
        </Button>
        {/* Note header right side */}
        <div className="flex gap-1 items-center">
          <div className="flex items-center gap-1">
            {isSyncing ? (
              <>
                <LoaderPinwheel className="text-gray-500 duration-400 animate-spin size-4" />
              </>
            ) : (
              <>
                <Check className="text-accent-foreground size-4" />
              </>
            )}
          </div>
          <Profile />
        </div>
      </div>
      <div className="relative flex flex-col gap-2 h-full overflow-hidden">
        <label htmlFor="noteTitle" className="sr-only">
          Note Title:
        </label>
        <input
          key={`${params.noteId}-${note ? "new" : "old"}`}
          name="noteTitle"
          className="text-3xl my-2 w-full border-none underline font-extrabold focus:outline-none"
          type="text"
          placeholder="Untitled"
          defaultValue={title}
          onChange={onChangeTitle}
        />
        <h3 className="text-sm font-semibold text-gray-600">
          Last updated on{" "}
          <span className="italic text-sm">
            {note?.updatedAt ? new Date(note.updatedAt).toLocaleString() : ""}
          </span>
        </h3>
        <div className="h-[80%] rounded-lg overflow-y-auto">
          <Editor
            currentNodeId={params.noteId}
            className="px-1 w-full focus:outline-none"
            placeholderClassName="absolute top-22 left-1 text-gray-400"
            initialContent={content}
            onChange={onEditorChange}
          />
        </div>
      </div>
    </div>
  );
}
