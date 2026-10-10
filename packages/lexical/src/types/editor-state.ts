import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { SerializedInternalLinkNode } from "./internal-link.js";

export type SyncNotesSerializedNode =
  SerializedLexicalNode | SerializedInternalLinkNode;

export type SyncNotesEditorState =
  SerializedEditorState<SyncNotesSerializedNode>;
