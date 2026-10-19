import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INITIALIZE_EDITOR_TAG } from "@/lib/constants";

export function InitializePlugin({ json }: { json: string | null }) {
  const [editor] = useLexicalComposerContext();
  const lastJsonRef = useRef<string | null>(null);

  useEffect(() => {
    if (!json || json === lastJsonRef.current) return;

    // Check if the editor already has this content (e.g. after a
    // debounced db.notes.update() → useLiveQuery re-render loop).
    // If so, skip setEditorState to avoid resetting the cursor.
    const editorJSON = JSON.stringify(editor.getEditorState().toJSON());
    if (editorJSON === json) {
      lastJsonRef.current = json;
      return;
    }

    // Genuinely new content (navigation, sync) — push it into the editor
    queueMicrotask(() => {
      // This is done in a microtask to avoid getting flushSync warnings from react
      const editorState = editor.parseEditorState(json);

      editor.setEditorState(editorState, {
        tag: INITIALIZE_EDITOR_TAG,
      });

      editor.focus(undefined, {
        defaultSelection: "rootEnd",
      });
    });
    lastJsonRef.current = json;
  }, [json, editor]);

  return null;
}
