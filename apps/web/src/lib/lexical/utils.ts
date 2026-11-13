import {
    $createParagraphNode,
    $getNearestNodeFromDOMNode,
    $getSelection,
    $isElementNode,
    $isRangeSelection,
    type EditorState,
    type LexicalEditor,
    type RootNode,
    type TextNode,
} from "lexical";
import { DEFAULT_FORMATS, EMPTY_CONTENT } from "../constants";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";

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

export function findBlockAt(
    editor: LexicalEditor,
    y: number,
): HTMLElement | null {
    const root = editor.getRootElement();
    if (!root) return null;
    for (const child of Array.from(root.children) as HTMLElement[]) {
        const r = child.getBoundingClientRect();
        if (y >= r.top && y <= r.bottom) return child;
    }
    return null;
}

export type BlockType =
    | "paragraph"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "quote"
    | "code"
    | "bullet"
    | "number";

export function transformBlock(
    editor: LexicalEditor,
    blockEl: HTMLElement,
    type: BlockType,
) {
    const listCommand =
        type === "bullet"
            ? INSERT_UNORDERED_LIST_COMMAND
            : type === "number"
              ? INSERT_ORDERED_LIST_COMMAND
              : null;

    editor.update(
        () => {
            const node = $getNearestNodeFromDOMNode(blockEl);
            if (!$isElementNode(node)) return;

            node.selectEnd();

            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            switch (type) {
                case "paragraph":
                    $setBlocksType(selection, () => $createParagraphNode());
                    break;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                    $setBlocksType(selection, () => $createHeadingNode(type));
                    break;
                case "quote":
                    $setBlocksType(selection, () => $createQuoteNode());
                    break;
                case "code":
                    $setBlocksType(selection, () => $createCodeNode());
                    break;
            }
        },
        {
            onUpdate: () => {
                if (listCommand) editor.dispatchCommand(listCommand, undefined);
            },
        },
    );
}
