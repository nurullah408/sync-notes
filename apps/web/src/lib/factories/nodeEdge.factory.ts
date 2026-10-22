import type { INodeEdge } from "@/types/entities/INodeEdge";

export function createNewNodeEdge(
  sourceId: string,
  targetId: string,
): INodeEdge {
  const id = crypto.randomUUID();
  return {
    id,
    sourceId,
    targetId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    isDeleted: false,
  };
}
