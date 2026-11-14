import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { $createParagraphNode, $getNearestNodeFromDOMNode } from "lexical";
import {
    Code,
    GripVertical,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Plus,
    Quote,
    Trash2,
    Type,
} from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { findBlockAt, transformBlock, type BlockType } from "../utils";
import { Menu, MenuItem, type MenuState } from "@/components/editor-menu";

type DraggableBlockPluginProps = {
    anchorElement: HTMLElement;
};

export function DraggableBlocksPlugin({
    anchorElement,
}: DraggableBlockPluginProps) {
    const [editor] = useLexicalComposerContext();

    const menuRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const targetLineRef = useRef<HTMLDivElement>(null);

    // Menu config
    const [menu, setMenu] = useState<MenuState>(null);

    const handleGripClick = (e: MouseEvent<HTMLDivElement>) => {
        if (menu) {
            setMenu(null);
            return;
        }
        const grip = e.currentTarget.getBoundingClientRect();
        const blockEl = findBlockAt(editor, grip.top + grip.height / 2);
        if (!blockEl) return;
        setMenu({ x: grip.left, y: grip.bottom + 4, blockEl });
    };

    const runOnBlock = (action: (blockEl: HTMLElement) => void) => {
        if (!menu) return;
        const { blockEl } = menu;
        setMenu(null);
        editor.update(() => {
            action(blockEl);
        });
    };

    const deleteBlock = (blockEl: HTMLElement) => {
        const node = $getNearestNodeFromDOMNode(blockEl);
        node?.remove();
    };

    const insertBlockBelow = (blockEl: HTMLElement) => {
        const node = $getNearestNodeFromDOMNode(blockEl);
        node?.insertAfter($createParagraphNode());
    };

    const transform = (type: BlockType) => {
        if (!menu) return;
        const { blockEl } = menu;
        setMenu(null);
        transformBlock(editor, blockEl, type);
    };

    useEffect(() => {
        if (!menu) return;

        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Element;
            if (panelRef.current?.contains(target)) return;
            if (target.closest("[data-block-grip]")) return;
            setMenu(null);
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenu(null);
        };
        const close = () => setMenu(null);

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        window.addEventListener("scroll", close, true);

        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("scroll", close, true);
        };
    }, [menu]);

    return createPortal(
        <>
            <DraggableBlockPlugin_EXPERIMENTAL
                anchorElem={anchorElement}
                menuRef={menuRef}
                targetLineRef={targetLineRef}
                menuComponent={
                    <div
                        ref={menuRef}
                        onClick={handleGripClick}
                        className={cn(
                            "absolute top-0 left-0 flex size-5 cursor-grab items-center justify-center rounded-md",
                            "text-muted-foreground opacity-0",
                            // Animate
                            "transition-[opacity,transform,background-color,color] duration-(--duration-fast) ease-(--ease-standard) hover:bg-accent hover:text-accent-foreground",
                            "active:cursor-grabbing",
                        )}
                    >
                        <GripVertical className="size-4 transition-transform duration-(--duration-fast) ease-(--ease-out-soft) group-hover:-translate-y-px" />
                    </div>
                }
                targetLineComponent={
                    <div
                        ref={targetLineRef}
                        className={cn(
                            "pointer-events-none absolute top-0 left-0 h-0.5 rounded-full bg-primary opacity-0",
                            // Fade only. Position changes must snap
                            "transition-opacity duration-(--duration-fast) ease-(--ease-standard)",
                        )}
                    />
                }
                isOnMenu={(element) =>
                    menuRef.current?.contains(element) ?? false
                }
            />
            {menu && (
                <Menu ref={panelRef} menu={menu}>
                    <p className="px-2 pb-1 pt-1.5 text-xs font-medium text-muted-foreground">
                        Turn Into
                    </p>
                    <div className="my-1 h-px bg-border" />
                    <MenuItem
                        icon={<Type className="size-4" />}
                        onSelect={() => transform("paragraph")}
                    >
                        Text
                    </MenuItem>
                    <MenuItem
                        icon={<Heading1 className="size-4" />}
                        onSelect={() => transform("h1")}
                    >
                        Heading 1
                    </MenuItem>
                    <MenuItem
                        icon={<Heading2 className="size-4" />}
                        onSelect={() => transform("h2")}
                    >
                        Heading 2
                    </MenuItem>
                    <MenuItem
                        icon={<Heading3 className="size-4" />}
                        onSelect={() => transform("h3")}
                    >
                        Heading 3
                    </MenuItem>
                    <MenuItem
                        icon={<List className="size-4" />}
                        onSelect={() => transform("bullet")}
                    >
                        Bulleted list
                    </MenuItem>
                    <MenuItem
                        icon={<ListOrdered className="size-4" />}
                        onSelect={() => transform("number")}
                    >
                        Numbered list
                    </MenuItem>
                    <MenuItem
                        icon={<Quote className="size-4" />}
                        onSelect={() => transform("quote")}
                    >
                        Quote
                    </MenuItem>
                    <MenuItem
                        icon={<Code className="size-4" />}
                        onSelect={() => transform("code")}
                    >
                        Code
                    </MenuItem>
                    <div className="my-1 h-px bg-border" />
                    <MenuItem
                        icon={<Plus className="size-4" />}
                        onSelect={() => runOnBlock(insertBlockBelow)}
                    >
                        Insert Below
                    </MenuItem>
                    <MenuItem
                        icon={<Trash2 className="size-4" />}
                        onSelect={() => runOnBlock(deleteBlock)}
                        destructive
                    >
                        Delete
                    </MenuItem>
                </Menu>
            )}
        </>,
        anchorElement,
    );
}
