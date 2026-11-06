import type { Folder } from "@/types/entities/Folder";

export function createNewFolder(props?: Partial<Folder>): Folder {
  const id = crypto.randomUUID();
  return {
    id,
    name: props?.name ?? "Untitled",
    color: props?.color ?? "#ffff",
    createdAt: props?.createdAt ?? new Date().toISOString(),
    updatedAt: props?.updatedAt ?? new Date().toISOString(),
    deletedAt: props?.deletedAt ?? null,
    isDeleted: props?.isDeleted ?? false,
  };
}
