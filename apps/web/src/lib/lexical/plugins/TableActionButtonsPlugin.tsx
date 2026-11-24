import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $insertTableColumnAtSelection,
    $insertTableRowAtSelection,
    $isTableCellNode,
    $isTableNode,
    $isTableRowNode,
} from "@lexical/table";
import { $getNearestNodeFromDOMNode, $getNodeByKey } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sameRect } from "../utils";

const GAP = 4; // space between the table and button
const THICKNESS = 20;
const MARGIN = GAP + THICKNESS + 4; // how far outside the table the pointer can go and keep the buttons visible

const buttonBaseClasses = `fixed z-[1000] flex items-center justify-center radius-md cursor-pointer border hover:border-foreground-accent border-accent`;

type Hovered = { key: string; rect: DOMRect };

export default function TableActionButtonsPlugin() {
    const [editor] = useLexicalComposerContext();

    const [hovered, setHovered] = useState<Hovered | null>(null);

    const tableElRef = useRef<HTMLTableElement | null>(null);
    const keyRef = useRef<string | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const frameRef = useRef<number | null>(null);

    const clear = useCallback(() => {
        tableElRef.current = null;
        keyRef.current = null;
        rectRef.current = null;
        setHovered(null);
    }, []);

    const measure = useCallback(() => {
        const el = tableElRef.current;
        const key = keyRef.current;
        if (!el || !key || !el.isConnected) {
            clear();
            return;
        }
        const rect = el.getBoundingClientRect();
        rectRef.current = rect;
        setHovered((prev) =>
            prev && prev.key === key && sameRect(prev.rect, rect)
                ? prev
                : { key, rect },
        );
    }, []);

    const scheduleMeasure = useCallback(() => {
        if (frameRef.current !== null) return;
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            measure();
        });
    }, [measure]);

    const addRow = (key: string) => {
        editor.update(() => {
            const table = $getNodeByKey(key);
            if (!$isTableNode(table)) return;
            // Put the selection in the last row, then insert a row after it
            const lastRow = table.getLastChild();
            if (!$isTableRowNode(lastRow)) return;

            const lastCell = lastRow.getLastChild();

            if (!$isTableCellNode(lastCell)) return;
            lastCell.selectEnd();
            $insertTableRowAtSelection(true);
        });
    };

    const addColumn = (key: string) => {
        editor.update(() => {
            const table = $getNodeByKey(key);
            if (!$isTableNode(table)) return;
            // Put the selection in the last row, then insert a row after it
            const firstRow = table.getFirstChild();
            if (!$isTableRowNode(firstRow)) return;

            const lastCell = firstRow?.getLastChild();
            if (!$isTableCellNode(lastCell)) return;

            lastCell?.selectEnd();
            $insertTableColumnAtSelection(true);
        });
    };

    // Track which table the pointer is over
    useEffect(() => {
        const root = editor.getRootElement();
        if (!root) return;

        const onMove = (e: MouseEvent) => {
            if (!editor.isEditable()) {
                if (keyRef.current) clear();
                return;
            }

            const target = e.target instanceof Element ? e.target : null;
            const tableEl = target?.closest("table") ?? null;

            if (tableEl && root.contains(tableEl)) {
                // Same table as before: nothing to look up or measure
                if (tableEl === tableElRef.current) return;

                const key = editor.read(() => {
                    const node = $getNearestNodeFromDOMNode(tableEl);
                    return $isTableNode(node) ? node.getKey() : null;
                });
                if (!key) {
                    clear();
                    return;
                }

                tableElRef.current = tableEl;
                keyRef.current = key;
                measure();
                return;
            }

            // Off the table: keep the strips while the pointer is in the margin
            const r = rectRef.current;
            if (!r) return;
            const inside =
                e.clientX >= r.left &&
                e.clientX <= r.right + MARGIN &&
                e.clientY >= r.top &&
                e.clientY <= r.bottom + MARGIN;
            if (!inside) clear();
        };

        document.addEventListener("mousemove", onMove, { passive: true });
        return () => document.removeEventListener("mousemove", onMove);
    }, [editor, clear, measure]);

    // Re-measure after editor updates, such as row or column inserts
    useEffect(() => {
        return editor.registerUpdateListener(() => {
            if (keyRef.current) scheduleMeasure();
        });
    }, [editor, scheduleMeasure]);

    // Follow the table on scroll and resize instead of hiding the strips
    useEffect(() => {
        const onChange = () => {
            if (keyRef.current) scheduleMeasure();
        };
        window.addEventListener("scroll", onChange, {
            capture: true,
            passive: true,
        });
        window.addEventListener("resize", onChange);
        return () => {
            window.removeEventListener("scroll", onChange, { capture: true });
            window.removeEventListener("resize", onChange);
        };
    }, [scheduleMeasure]);

    // Cancel any pending frame on unmount
    useEffect(() => {
        return () => {
            if (frameRef.current !== null)
                cancelAnimationFrame(frameRef.current);
        };
    }, []);

    if (!hovered) return null;

    const { key, rect } = hovered;

    return createPortal(
        <>
            <button
                type="button"
                aria-label="Add Row"
                title="Add Row"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addRow(key)}
                className={buttonBaseClasses}
                style={{
                    top: rect.bottom + GAP,
                    left: rect.left,
                    width: rect.width,
                    height: THICKNESS,
                }}
            >
                +
            </button>
            <button
                type="button"
                aria-label="Add column"
                title="Add column"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addColumn(key)}
                className={buttonBaseClasses}
                style={{
                    top: rect.top,
                    left: rect.right + GAP,
                    width: THICKNESS,
                    height: rect.height,
                }}
            >
                +
            </button>
        </>,
        document.body,
    );
}
