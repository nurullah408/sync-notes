import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

// Import the necessary core nodes for Markdown rendering
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
// Import the transformers
import {
    HEADING,
    UNORDERED_LIST,
    ORDERED_LIST,
    CHECK_LIST,
    QUOTE,
} from "@lexical/markdown";

import type { EditorState } from "lexical";
import { EDITOR_THEME, INITIALIZE_EDITOR_TAG } from "@/lib/constants";
import { useRef, useState, type MouseEvent } from "react";
import { FloatingToolbarPlugin } from "@/lib/lexical/plugins/FloatingBarPlugin";
import { InitializePlugin } from "@/lib/lexical/plugins/InitializePlugin";
import { SlashMenuPlugin } from "@/lib/lexical/plugins/SlashMenuPlugin";
import { DraggableBlocksPlugin } from "@/lib/lexical/plugins/DraggableBlocksPlugin";

interface EditorProps {
    currentNodeId: string;
    initialContent: string;
    onChange: (editorState: EditorState) => void;
    namespace?: string;
    className?: string;
    placeholderClassName?: string;
    children?: React.ReactNode;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error): void {
    console.error(error);
}

export function Editor({
    currentNodeId,
    initialContent,
    namespace,
    onChange,
    className = "",
    placeholderClassName = "",
    children,
}: EditorProps) {
    const initialConfig = {
        namespace: namespace ?? "SyncNotesEditor",
        theme: EDITOR_THEME,
        onError,
        editorState: null,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            CodeNode,
            CodeHighlightNode,
        ],
    };

    const CUSTOM_MARKDOWN_TRANSFORMERS = [
        HEADING,
        UNORDERED_LIST,
        ORDERED_LIST,
        CHECK_LIST,
        QUOTE,
    ];

    const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
        null,
    );

    const contentEditableRef = useRef<HTMLDivElement>(null);

    const handleOnClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (contentEditableRef.current) {
            contentEditableRef.current.focus();
        }
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div ref={setAnchorElement} className="relative">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            ref={contentEditableRef}
                            className={className}
                        />
                    }
                    placeholder={
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={handleOnClick}
                            className={placeholderClassName}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    contentEditableRef.current?.focus();
                                }
                            }}
                        >
                            Enter some text...
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <FloatingToolbarPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <InitializePlugin json={initialContent} />
                <OnChangePlugin
                    ignoreSelectionChange
                    onChange={(editorState, _, tags) => {
                        if (tags.has(INITIALIZE_EDITOR_TAG)) return;
                        onChange(editorState);
                    }}
                />
                <HistoryPlugin />
                <MarkdownShortcutPlugin
                    transformers={CUSTOM_MARKDOWN_TRANSFORMERS}
                />
                <SlashMenuPlugin />
                {anchorElement && (
                    <DraggableBlocksPlugin anchorElement={anchorElement} />
                )}
                {children}
            </div>
        </LexicalComposer>
    );
}
