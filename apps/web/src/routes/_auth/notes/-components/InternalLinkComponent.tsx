import { getNote } from "@/api/notes.api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import type { MouseEvent } from "react";

interface IInternalLinkComponentProps {
  noteId: string;
  nodeKey: string;
}

export function InternalLinkComponent({
  noteId,
  nodeKey,
}: IInternalLinkComponentProps) {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.notesDetail(noteId),
    queryFn: () => getNote({ noteId }),
  });

  if (isLoading || !data) {
    return (
      <div
        data-note-id={noteId}
        onClick={(e) => e.preventDefault()}
        className="internal-link animate-pulse duration-400 cursor-pointer inline-flex items-center gap-1 font-medium text-primary underline hover:text-primary/80"
      >
        Loading
      </div>
    );
  }

  const title = data?.data?.title;

  const isDeleted = data?.data?.isDeleted;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDeleted) return;
    window.dispatchEvent(
      new CustomEvent("internal-link:click", {
        detail: { noteId, nodeKey },
      }),
    );
  };

  return (
    <a
      href={`/notes/${noteId}`}
      onClick={handleClick}
      data-note-id={noteId}
      className={cn(
        "internal-link cursor-pointer inline-flex items-center gap-1 font-medium text-primary underline hover:text-primary/80",
        {
          "line-through": isDeleted,
        },
      )}
    >
      <FileText className="size-4" />
      {title || "Untitled"}
    </a>
  );
}
