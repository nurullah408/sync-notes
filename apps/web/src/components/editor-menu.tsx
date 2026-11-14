import { cn } from "@/lib/utils";
import type { ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

export type MenuState = {
    x: number;
    y: number;
    blockEl: HTMLElement;
} | null;

export type MenuProps = {
    ref: RefObject<HTMLDivElement | null>;
    menu: MenuState;
    children: ReactNode;
};

export function Menu({ ref, menu, children }: MenuProps) {
    return createPortal(
        <div
            ref={ref}
            role="menu"
            style={{ top: menu?.y, left: menu?.x }}
            className={cn(
                "fixed z-(--z-dropdown) min-w-40 rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 duration-(--duration-fast)",
            )}
        >
            {children}
        </div>,
        document.body,
    );
}

export function MenuItem({
    icon,
    children,
    onSelect,
    destructive,
}: {
    icon: ReactNode;
    children: ReactNode;
    onSelect: () => void;
    destructive?: boolean;
}) {
    return (
        <button
            type="button"
            role="menuitem"
            onClick={onSelect}
            className={cn(
                "flex gap-2 items-center w-full rounded-md px-2 py-1 outline-none",
                "transition-colors duration-(--duration-fast)",
                destructive
                    ? "text-destructive hover:bg-destructive/10"
                    : "hover:bg-accent hover:text-accent-foreground",
            )}
        >
            {icon}
            {children}
        </button>
    );
}
