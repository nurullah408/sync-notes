import { cn } from "@/lib/utils";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { GripVertical } from "lucide-react";
import { useRef } from "react";
import { createPortal } from "react-dom";

type DraggableBlockPluginProps = {
    anchorElement: HTMLElement;
};
export function DraggableBlocksPlugin({
    anchorElement,
}: DraggableBlockPluginProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const targetLineRef = useRef<HTMLDivElement>(null);

    return createPortal(
        <DraggableBlockPlugin_EXPERIMENTAL
            anchorElem={anchorElement}
            menuRef={menuRef}
            targetLineRef={targetLineRef}
            menuComponent={
                <div
                    ref={menuRef}
                    className={cn(
                        "absolute top-0 left-0 flex size-5 cursor-grab items-center justify-center rounded-md",
                        "text-muted-foreground opacity-0",
                        // Animate
                        "transition-[opacity,transform,background-color,color] duration-(--duration-fast) ease-(--ease-standard) hover:bg-accent hover:text-accent-foreground",
                        "active:scale-95 active:cursor-grabbing",
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
            isOnMenu={(element) => menuRef.current?.contains(element) ?? false}
        />,
        anchorElement,
    );
}
