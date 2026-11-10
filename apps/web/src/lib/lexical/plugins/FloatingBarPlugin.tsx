import { Button } from "@/components/ui/button";
import { DEFAULT_FORMATS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLayoutEffect } from "@tanstack/react-router";
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    type UpdateListener,
} from "lexical";
import {
    ALargeSmall,
    Bold,
    CaseLower,
    CaseUpper,
    Code,
    Highlighter,
    Italic,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { readFormats, sameFormats } from "../utils";

function useGetTextFormats() {
    const [editor] = useLexicalComposerContext();

    const [formats, setFormats] = useState(DEFAULT_FORMATS);

    useEffect(() => {
        const initial = readFormats(editor.getEditorState());
        setFormats((prev) => (sameFormats(prev, initial) ? prev : initial));
        return editor.registerUpdateListener(({ editorState }) => {
            const nextFormats = readFormats(editorState);
            setFormats((prev) =>
                sameFormats(prev, nextFormats) ? prev : nextFormats,
            );
        });
    }, [editor]);

    return formats;
}

function useHasTextSelection(): boolean {
    const [editor] = useLexicalComposerContext();
    const subscribe = useCallback(
        (onChange: UpdateListener) => editor.registerUpdateListener(onChange),
        [editor],
    );

    const getSnapshot = () =>
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            return (
                $isRangeSelection(selection) &&
                !selection.isCollapsed() &&
                selection.getTextContent().trim() !== ""
            );
        });

    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function FloatingToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    const visible = useHasTextSelection();

    const formats = useGetTextFormats();

    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!visible) return;

        const reposition = () => {
            const el = ref.current;
            const selection = window.getSelection();

            if (!el || !selection || selection.rangeCount === 0) return;

            const rect = selection.getRangeAt(0).getBoundingClientRect();

            el.style.top = `${rect.top - el.offsetHeight - 8}px`;
            el.style.left = `${rect.left + rect.width / 2}px`;
        };

        reposition();

        window.addEventListener("scroll", reposition, true);
        window.addEventListener("resize", reposition, true);

        const unregister = editor.registerUpdateListener(reposition);

        return () => {
            window.removeEventListener("scroll", reposition);
            window.removeEventListener("resize", reposition);
            unregister();
        };
    }, [visible, editor]);

    if (!visible) return null;

    const buttonClass = (active: boolean) =>
        cn(
            "rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            active && "bg-accent text-accent-foreground",
        );

    return createPortal(
        <div
            aria-label="Toolbar"
            ref={ref}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-0.5 p-0.5 rounded-md fixed z-1000 bg-primary-foreground border"
            style={{
                transform: `translateX(-50%)`,
            }}
        >
            <Button
                className={buttonClass(formats.bold)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
            >
                <Bold />
            </Button>
            <Button
                className={buttonClass(formats.italic)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
            >
                <Italic />
            </Button>
            <Button
                className={buttonClass(formats.underline)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
            >
                <Underline />
            </Button>
            <Button
                className={buttonClass(formats.code)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                }}
            >
                <Code />
            </Button>
            <Button
                className={buttonClass(formats.strikethrough)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(
                        FORMAT_TEXT_COMMAND,
                        "strikethrough",
                    );
                }}
            >
                <Strikethrough />
            </Button>
            <Button
                className={buttonClass(formats.capitalize)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize");
                }}
            >
                <ALargeSmall />
            </Button>
            <Button
                className={buttonClass(formats.lowercase)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase");
                }}
            >
                <CaseLower />
            </Button>
            <Button
                className={buttonClass(formats.uppercase)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase");
                }}
            >
                <CaseUpper />
            </Button>
            <Button
                className={buttonClass(formats.highlight)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
                }}
            >
                <Highlighter />
            </Button>
            <Button
                className={buttonClass(formats.superscript)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
                }}
            >
                <Superscript />
            </Button>
            <Button
                className={buttonClass(formats.subscript)}
                size="icon-sm"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
                }}
            >
                <Subscript />
            </Button>
        </div>,
        document.body,
    );
}
