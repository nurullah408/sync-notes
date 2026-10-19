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
import { useNotesCollection } from "@/collections";
import { eq, useLiveQuery } from "@tanstack/react-db";

export function Note() {
  const params = useParams({ from: "/_auth/notes/$noteId" });

  const { open } = useSidebar();

  const { isSyncing } = useSyncContext();

  const openModal = useGlobalStore((state) => state.openModal);

  const notesCollection = useNotesCollection();

  const { data: notes } = useLiveQuery({
    query: (q) =>
      q
        .from({ note: notesCollection })
        .where(({ note }) => eq(note.id, params.noteId))
        .select(({ note }) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          searchContent: note.searchContent,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          isDeleted: note.isDeleted,
        })),
  });

  const note = notes[0];

  const updateTitle = useDebouncedCallback((title: string) => {
    notesCollection.update(params.noteId, (draft: Note) => {
      draft.title = title;
      draft.updatedAt = new Date().toISOString();
    });
  }, 500);

  const updateContent = useDebouncedCallback((editorState: EditorState) => {
    const { json, textContent } = editorState.read(() => {
      const root = $getRoot();
      const json = root.isEmpty()
        ? INITIAL_EDITOR_STATE // This is already stringified
        : JSON.stringify(editorState.toJSON());
      return { json, textContent: root.getTextContent() };
    });

    notesCollection.update(params.noteId, (draft: Note) => {
      draft.content = json;
      draft.searchContent = textContent;
      draft.updatedAt = new Date().toISOString();
    });
  }, 500);

  function onOpenSearch() {
    openModal("GLOBAL_SEARCH", null);
  }

  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    updateTitle(value);
  }

  function onEditorChange(editorState: EditorState) {
    updateContent(editorState);
  }

  useHandleInternalLinkClick();

  const title = note ? note.title : "Untitled";

  const content = note ? note.content : INITIAL_EDITOR_STATE;

  if (!note) {
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
    </div>;
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
