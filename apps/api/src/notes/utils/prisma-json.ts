import { InputJsonValue } from '@prisma/client/runtime/client';
import { SyncNotesEditorState } from '@sync-notes/lexical';

export function toPrismaJson(content: SyncNotesEditorState): InputJsonValue {
  return JSON.parse(JSON.stringify(content)) as InputJsonValue;
}
