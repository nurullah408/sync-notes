import type { FolderMeta } from "../entities/Folder";

export interface FolderItem extends FolderMeta {
  type: "folder";
  isCollapsed: boolean;
  depth: number;
}
