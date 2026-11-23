import { Editor } from "@/components/lexical-editor";
import { useDebouncedCallback } from "@/hooks/useDebounce.ts";
import { INITIAL_EDITOR_STATE } from "@/lib/constants";
import type { Note } from "@/types/entities/Note";
import { useParams } from "@tanstack/react-router";
import { $getRoot, type EditorState } from "lexical";
import { type ChangeEvent } from "react";
import { useGlobalStore } from "@/store/store.tsx";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getNote } from "@/api/notes.api";
import { useNoteMutations } from "../-hooks/useNoteMutation";
import NoteHeader from "./NoteHeader";
import NoteLoader from "./NoteLoader";

export function Note() {
    const params = useParams({ from: "/_auth/notes/$noteId" });

    const openModal = useGlobalStore((state) => state.openModal);

    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.notesDetail(params.noteId),
        queryFn: () => getNote({ noteId: params.noteId }),
        staleTime: 5 * 60 * 1000,
    });

    const { updateNoteMutation } = useNoteMutations({ noteId: params.noteId });

    const note = data?.data;

    const updateNoteTitle = useDebouncedCallback(async (title: string) => {
        updateNoteMutation.mutate({
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

            updateNoteMutation.mutate({
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
        if (value === "" || value === undefined) {
            updateNoteTitle("Untitled");
            return;
        }
        updateNoteTitle(value);
    }

    function onEditorChange(editorState: EditorState) {
        updateNoteContent(editorState);
    }

    const title = note ? note.title : "Untitled";

    const content = note ? note.content : INITIAL_EDITOR_STATE;

    if (isLoading) {
        return <NoteLoader />;
    }

    return (
        <div className="px-4 pt-2 border rounded h-full w-full">
            <title>{`${note?.title || "Untitled"} | Sync Notes`}</title>
            <NoteHeader
                onOpenSearch={onOpenSearch}
                isPending={updateNoteMutation.isPending}
                isError={updateNoteMutation.isError}
            />
            <div className="relative flex flex-col gap-2 h-full overflow-hidden">
                <label htmlFor="noteTitle" className="sr-only">
                    Note Title:
                </label>
                <input
                    key={`${params.noteId}-${note ? "new" : "old"}`}
                    name="noteTitle"
                    className="px-8 text-3xl my-2 w-full border-none underline font-extrabold focus:outline-none"
                    type="text"
                    placeholder="Untitled"
                    defaultValue={title}
                    onChange={onChangeTitle}
                />
                <h3 className="px-8 text-sm font-semibold text-gray-600">
                    Last updated on{" "}
                    <span className="italic text-sm">
                        {note?.updatedAt
                            ? new Date(note.updatedAt).toLocaleString()
                            : ""}
                    </span>
                </h3>
                <div className="h-[80%] rounded-lg overflow-y-auto overflow-x-hidden">
                    <Editor
                        className="px-8 w-full focus:outline-none overflow-hidden"
                        placeholderClassName="absolute top-0 left-8 text-gray-400"
                        initialContent={content}
                        onChange={onEditorChange}
                    />
                </div>
            </div>
        </div>
    );
}
