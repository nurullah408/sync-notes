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
import { useMemo, useState } from "react";
import { buildFlatList } from "@/lib/sidebar-utils.ts";
import type { FlatListItem } from "@/types/util-types/FlatListItem.ts";
import type { NoteItem } from "@/types/util-types/NoteItem.ts";
import { useGlobalStore } from "@/store/store.tsx";
import { FolderRow } from "./FolderRow";
import { NoteRow } from "./NoteRow";
import { useQuery } from "@tanstack/react-query";
import { getSidebar } from "@/api/sidebar.api";
import { createNewNote } from "@/lib/factories/notes.factory";
import { createNewFolder } from "@/lib/factories/folders.factory";
import { useSidebarMutations } from "../-hooks/useSidebarMutations";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = useGlobalStore((state) => state.openModal);

  const { data, isLoading } = useQuery({
    queryKey: ["sidebar"],
    queryFn: getSidebar,
    staleTime: 1000 * 60 * 5,
  });

  const {
    createNoteMutation,
    deleteNoteMutation,
    createFolderMutation,
    deleteFolderMutation,
  } = useSidebarMutations();

  const [collapsedFolders, setCollapsedFolders] = useState<
    Record<string, boolean>
  >({});

  const [editingFolders, setEditingFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const onCreateNewNote = async () => {
    const note = createNewNote();
    await createNoteMutation.mutateAsync(note);
    navigate({ to: `/notes/$noteId`, params: { noteId: note.id } });
  };

  const onCreateNewFolder = async () => {
    const folder = createNewFolder();
    await createFolderMutation.mutateAsync(folder);
    setEditingFolders((prev) => {
      const newSet = new Set(prev);
      newSet.add(folder.id);
      return newSet;
    });
  };

  const onDelete = async (itemType: "folder" | "note", itemId: string) => {
    if (!data) return;
    const { notes } = data.data;

    let currentIndex: number | undefined;
    let nextNoteId: string | undefined;

    const active = location.pathname.includes(`/notes/${itemId}`);

    if (itemType === "note") {
      if (active) {
        if (notes && notes.length > 1) {
          currentIndex = notes.findIndex((n) => n.id === itemId);
          if (currentIndex !== -1) {
            nextNoteId =
              currentIndex === notes.length - 1
                ? notes[currentIndex - 1].id
                : notes[currentIndex + 1].id;
          }
        }
      }

      await deleteNoteMutation.mutateAsync(itemId);

      if (nextNoteId) {
        await navigate({
          to: "/notes/$noteId",
          params: { noteId: nextNoteId },
        });
      } else {
        await navigate({ to: "/notes" });
      }
      return;
    } else {
      await deleteFolderMutation.mutateAsync(itemId);
      let noteId = location.pathname.split("/").reverse()[0];
      const inFolder = notes.find(
        (n) => n.id === noteId && n.folderId === itemId,
      );
      if (inFolder) {
        const nextNoteIndex = notes.findIndex(
          (note) => note.folderId !== itemId,
        );
        if (nextNoteIndex === -1) {
          await navigate({ to: "/notes" });
        } else {
          nextNoteId = notes[nextNoteIndex].id;
          await navigate({
            to: "/notes/$noteId",
            params: { noteId: nextNoteId },
          });
        }
      }
    }
  };

  const onMoveNote = (noteId: string) => {
    openModal("MOVE_NOTE", { noteId });
  };

  const visibleItems = useMemo(() => {
    if (isLoading || !data) return [];
    const { notes, folders } = data.data;
    return buildFlatList(notes, folders, collapsedFolders);
  }, [data, collapsedFolders]);

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
                      isOpen={!collapsedFolders[item.id]}
                      onDelete={onDelete}
                      editing={editingFolders.has(item.id)}
                      setEditing={setEditingFolders}
                      onToggle={() => toggleFolder(item.id)}
                    />
                    <div
                      className={cn(
                        "overflow-hidden mt-2 transition-[max-height,opacity] duration-300 ease-in-out",
                        collapsedFolders[item.id]
                          ? "max-h-0 opacity-0"
                          : "max-h-25 opacity-100",
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
