import type { Entity } from "./Entity";

export interface Folder extends Entity {
  name: string;
  color: string;
}

export interface FolderMeta extends Pick<
  Folder,
  "id" | "name" | "color" | "createdAt"
> {}
