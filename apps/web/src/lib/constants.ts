import type { EditorThemeClasses } from "lexical";

export const INITIAL_EDITOR_STATE = JSON.stringify({
    root: {
        children: [
            {
                children: [],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
});

/**
 * The Editor's Theme
 * This object contains all of the formats that we can apply to text
 * and is aligned with the theme
 */
export const EDITOR_THEME = {
    root: "outline-none",
    ltr: "text-left",
    rtl: "text-right",
    placeholder:
        "text-muted-foreground absolute top-4 left-4 pointer-events-none select-none",
    paragraph: "relative m-0 mb-2 last:mb-0",
    quote: "border-l-4 border-primary pl-4 italic text-muted-foreground my-4",
    heading: {
        h1: "text-4xl font-bold text-foreground tracking-tight mt-6 mb-2",
        h2: "text-2xl font-bold text-foreground tracking-tight mt-5 mb-2",
        h3: "text-xl font-bold text-foreground tracking-tight mt-4 mb-2",
        h4: "text-base font-bold text-foreground",
        h5: "text-sm font-bold text-foreground",
        h6: "text-xs font-bold text-foreground",
    },
    list: {
        nested: {
            listitem: "list-none pl-4 focus:outline-none",
        },
        ol: "list-decimal pl-6 my-2",
        ul: "list-disc pl-6 my-2",
        listitem: "text-foreground focus:outline-none",
        checklist: "!list-none !pl-2 p-0 m-0 my-2 focus:outline-none",
        listitemUnchecked:
            "list-none relative pl-6 text-foreground select-none focus:outline-none before:content-['☐'] before:text-muted-foreground before:absolute before:left-0 before:top-0",
        listitemChecked:
            "list-none relative pl-6 line-through text-muted-foreground select-none focus:outline-none before:content-['✓'] before:text-primary before:absolute before:left-0 before:top-0",
    },
    image: "max-w-full h-auto rounded-lg",
    link: "text-link underline underline-offset-4 cursor-pointer hover:text-brand-hover",
    text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        underlineStrikethrough: "underline line-through",
        code: "bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm text-foreground",
        subscript: "align-sub text-xs",
        superscript: "align-super text-xs",
        highlight: "bg-warning/30 rounded-xs px-0.5",
        capitalize: "capitalize",
        lowercase: "lowercase",
        uppercase: "uppercase",
    },
    code: "bg-muted block font-mono text-sm p-4 rounded-md overflow-x-auto border border-border my-4",
    codeHighlight: {
        atrule: "text-primary",
        attr: "text-primary",
        boolean: "text-destructive",
        builtin: "text-chart-1",
        cdata: "text-muted-foreground",
        char: "text-chart-2",
        class: "text-chart-3",
        "class-name": "text-chart-3",
        comment: "text-muted-foreground italic",
        constant: "text-destructive",
        deleted: "text-destructive",
        doctype: "text-muted-foreground",
        entity: "text-accent-foreground",
        function: "text-primary",
        important: "font-bold text-primary",
        inserted: "text-chart-1",
        keyword: "text-primary",
        namespace: "text-primary",
        number: "text-chart-2",
        operator: "text-foreground",
        prolog: "text-muted-foreground",
        property: "text-primary",
        punctuation: "text-muted-foreground",
        regex: "text-chart-4",
        selector: "text-chart-1",
        string: "text-chart-2",
        symbol: "text-chart-1",
        tag: "text-primary",
        url: "text-primary underline",
        variable: "text-chart-5",
    },
    internalLink: "p-1 bg-muted rounded-md text-foreground hover:bg-accent",

    // Horizontal rule
    hr: "my-6 h-px w-full border-0 bg-border",

    // Hashtags and inline marks (search highlights, comments)
    hashtag: "text-link font-medium",
    mark: "bg-brand-soft rounded-xs",
    markOverlap: "bg-brand-soft/60 rounded-xs",

    // Ghost text from autocomplete plugins
    autocomplete: "text-muted-foreground",

    // Embeds (YouTube, Twitter, etc.)
    embedBlock: {
        base: "my-4 flex justify-center select-none",
        focus: "outline-2 outline-ring outline-offset-2 rounded-md",
    },

    // Character limit overflow highlight
    characterLimit: "bg-destructive/20",

    // Tables
    table: "my-4 w-max max-w-full border-collapse overflow-x-auto",
    tableRow: "",
    tableCell:
        "relative min-w-[75px] border border-border px-3 py-2 align-top outline-none text-foreground",
    tableCellHeader: "bg-muted font-semibold text-left",
    tableCellSelected: "bg-brand-soft",
    tableSelection: "bg-brand-soft/40",
    tableCellResizer:
        "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-brand",
    tableAddColumns:
        "absolute top-0 h-full w-4 -mr-2 rounded-sm bg-muted hover:bg-accent cursor-pointer",
    tableAddRows:
        "absolute left-0 w-full h-4 -mb-2 rounded-sm bg-muted hover:bg-accent cursor-pointer",
} satisfies EditorThemeClasses;

// Text Format default state
export const DEFAULT_FORMATS = {
    bold: false,
    italic: false,
    underline: false,
    code: false,
    strikethrough: false,
    capitalize: false,
    highlight: false,
    lowercase: false,
    subscript: false,
    superscript: false,
    uppercase: false,
};

export const EMPTY_CONTENT = "(An empty Note)";

// Home Animation constants
export const HEIGHT = 800;
export const AMPLITUDE = 100;
export const FREQUENCY = 0.09;
export const STRAND_LENGTH = 80;
export const PHASE_DIFF = Math.PI;

export const LOCAL_STORAGE_SYNC_KEY = "last_synced_at";

export const INITIALIZE_EDITOR_TAG = "initialize-editor";
