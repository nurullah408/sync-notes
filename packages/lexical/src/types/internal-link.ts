import type { Spread, SerializedLexicalNode } from "lexical";

export type SerializedInternalLinkNode = Spread<
  {
    type: "internal-link";
    noteId: string;
  },
  SerializedLexicalNode
>;
