type SerializedNode = {
  type: string;
  noteId?: string;
  children?: SerializedNode[];
};

export function getInternalLinkTargetIds(root: SerializedNode): Set<string> {
  const targetIds = new Set<string>();

  function visit(node: SerializedNode): void {
    if (node.type === "internal-link" && node.noteId) {
      targetIds.add(node.noteId);
    }
    for (const child of node.children ?? []) {
      visit(child);
    }
  }

  visit(root);

  return targetIds;
}
