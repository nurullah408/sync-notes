import {
    $getSelection,
    $isRangeSelection,
    type EditorState,
    type RootNode,
    type TextNode,
} from "lexical";
import { DEFAULT_FORMATS, EMPTY_CONTENT } from "../constants";

export function getTextPreview(jsonSting: string, maxLength = 120): string {
    try {
        const parsed = JSON.parse(jsonSting);
        let text = "";
        const extractText = (node: RootNode | TextNode) => {
            if ("text" in node) {
                text += node.text;
            }
            if ("children" in node) {
                (node?.children as (RootNode | TextNode)[]).forEach(
                    extractText,
                );
            }
        };
        extractText(parsed.root);
        const result = text.trim();
        return result.length > maxLength
            ? result.slice(0, maxLength) + "..."
            : result.length === 0
              ? EMPTY_CONTENT
              : result;
    } catch {
        return EMPTY_CONTENT;
    }
}

export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function sameFormats(
    a: typeof DEFAULT_FORMATS,
    b: typeof DEFAULT_FORMATS,
) {
    return (Object.keys(a) as (keyof typeof DEFAULT_FORMATS)[]).every(
        (k) => a[k] === b[k],
    );
}

export function readFormats(editorState: EditorState) {
    return editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return DEFAULT_FORMATS;
        return {
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
            code: selection.hasFormat("code"),
            strikethrough: selection.hasFormat("strikethrough"),
            capitalize: selection.hasFormat("capitalize"),
            lowercase: selection.hasFormat("lowercase"),
            uppercase: selection.hasFormat("uppercase"),
            highlight: selection.hasFormat("highlight"),
            subscript: selection.hasFormat("subscript"),
            superscript: selection.hasFormat("superscript"),
        };
    });
}
