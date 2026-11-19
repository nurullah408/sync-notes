import type { Folder } from "../entities/Folder";
import type { NoteMeta } from "../entities/Note";

export type SidebarData = {
    notes: NoteMeta[];
    folders: Folder[];
};
