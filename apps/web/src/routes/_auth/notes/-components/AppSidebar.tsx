import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { FolderPlus, Plus } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useMemo, useReducer } from "react";
import { buildFlatList } from "@/lib/sidebar-utils.ts";
import type { FlatListItem } from "@/types/util-types/FlatListItem.ts";
import type { NoteItem } from "@/types/util-types/NoteItem.ts";
import { useGlobalStore } from "@/store/store.tsx";
import type { Folder } from "@/types/entities/Folder";
import type { Note } from "@/types/entities/Note";
import { INITIAL_EDITOR_STATE } from "@/lib/constants";
import { FolderRow } from "./FolderRow";
import { NoteRow } from "./NoteRow";
import { useQuery } from "@tanstack/react-query";
import { foldersCollection, notesCollection } from "@/collections";
import { getSidebar } from "@/lib/api";
import { initialSidebarState, sidebarReducer } from "../-hooks/useSidebarState";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar Query
  const { data, isLoading } = useQuery({
    queryKey: ["sidebar"],
    queryFn: getSidebar,
  });

  const [sidebarState, sidebarDispatch] = useReducer(
    sidebarReducer,
    initialSidebarState,
  );

  const toggleFolder = (folderId: string) => {
    sidebarDispatch({ type: "toggle_folder", payload: folderId });
  };

  const visibleItems = useMemo(() => {
    if (isLoading || !data) return [];

    const { notes, folders } = data.data;

    return buildFlatList(notes, folders, sidebarState.collapsedFolders);
  }, [data, sidebarState.collapsedFolders, isLoading]);

  const openModal = useGlobalStore((state) => state.openModal);

  const saveNote = async (note: Partial<Note> & { id: string }) => {
    notesCollection.update(note.id, (draft) => ({
      ...draft,
      ...note,
    }));
  };

  const createNote = async (note: Note) => {
    notesCollection.insert({ ...note });
  };

  const createFolder = async (folder: Folder) => {
    foldersCollection.insert({ ...folder });
    sidebarDispatch({ type: "start_editing_folder", payload: folder.id });
  };

  const onCreateNewNote = async () => {
    const newNoteId = crypto.randomUUID();
    const newNote: Note = {
      id: newNoteId,
      title: "Untitled",
      content: INITIAL_EDITOR_STATE,
      searchContent: "",
      createdAt: new Date().toISOString(),
      deletedAt: null,
      isDeleted: false,
      folderId: null,
      updatedAt: new Date().toISOString(),
    };
    await createNote(newNote);
    navigate({ to: `/notes/$noteId`, params: { noteId: newNoteId } });
  };

  const onCreateNewFolder = async () => {
    const newFolderId = crypto.randomUUID();
    const newFolder: Folder = {
      id: newFolderId,
      name: "Untitled",
      color: "#ffff",
      createdAt: new Date().toISOString(),
      deletedAt: null,
      isDeleted: false,
      updatedAt: new Date().toISOString(),
    };
    await createFolder(newFolder);
  };

  const onDelete = async (itemType: "folder" | "note", itemId: string) => {
    if (!visibleItems.length || !data) {
      return;
    }
    const { notes } = data.data;

    if (itemType === "note") {
      const active = location.pathname.includes(`/notes/${itemId}`);
      if (active) {
        let nextRoute = "/notes";
        let nextParams = {};

        if (data.data.notes && data.data.notes.length > 1) {
          const currentIndex = notes.findIndex((n) => n.id === itemId);
          const nextNote =
            currentIndex === notes.length - 1
              ? notes[currentIndex - 1]
              : notes[currentIndex + 1];
          if (nextNote) {
            nextRoute = "/notes/$noteId";
            nextParams = {
              $noteId: nextNote,
            };
          }
        }
        navigate({ to: nextRoute, params: nextParams });
      }
      await saveNote({ id: itemId, isDeleted: true });
      return;
    } else {
      return;
    }
  };

  const onMoveNote = (noteId: string) => {
    openModal("MOVE_NOTE", { noteId });
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex-row h-16 items-center justify-between font-bold text-primary">
        Sync Notes
        <SidebarTrigger className="rounded-[10px]" />
      </SidebarHeader>
      <SidebarContent className="px-2 mt-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={onCreateNewNote}
            variant="outline"
            size="icon-sm"
            className="rounded-[10px]"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            onClick={onCreateNewFolder}
            variant="outline"
            size="icon-sm"
            className="rounded-[10px]"
          >
            <FolderPlus className="size-4" />
          </Button>
        </div>
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <SidebarMenuItem
                key={i}
                className="w-full flex justify-center rounded-[10px] overflow-hidden duration-400 animate-pulse"
              />
            ))
          : visibleItems?.map((item: FlatListItem) => {
              if (item.type === "folder") {
                const folderChildren = visibleItems.filter(
                  (i) => i.type === "note" && i.folderId === item.id,
                ) as NoteItem[];
                return (
                  <div key={item.id}>
                    <FolderRow
                      folder={{ ...item }}
                      isOpen={!sidebarState.collapsedFolders[item.id]}
                      onDelete={onDelete}
                      editing={sidebarState.editingFolders.has(item.id)}
                      sidebarDispatch={sidebarDispatch}
                      onToggle={() => toggleFolder(item.id)}
                    />
                    <div
                      className={cn(
                        "overflow-hidden mt-2 transition-[max-height,opacity] duration-300 ease-in-out",
                        sidebarState.collapsedFolders[item.id]
                          ? "max-h-0 opacity-0"
                          : "max-h-[100px] opacity-100",
                      )}
                    >
                      {folderChildren.map((note: NoteItem) => (
                        <NoteRow
                          key={note.id}
                          note={{ ...note }}
                          onMoveNote={(noteId: string) => onMoveNote(noteId)}
                          onDelete={onDelete}
                        />
                      ))}
                    </div>
                  </div>
                );
              }
              if (!item.folderId) {
                return (
                  <NoteRow
                    key={item.id}
                    note={{ ...item }}
                    onMoveNote={(noteId) => onMoveNote(noteId)}
                    onDelete={onDelete}
                  />
                );
              }
            })}
      </SidebarContent>
    </Sidebar>
  );
}
