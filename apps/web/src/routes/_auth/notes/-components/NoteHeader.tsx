import Profile from "@/components/Profile";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Check, CircleAlert, LoaderPinwheel, Search } from "lucide-react";

export type NoteHeaderProps = {
    onOpenSearch?: () => void;
    isPending: boolean;
    isError: boolean;
    onRetry?: () => void;
};

export default function NoteHeader({
    onOpenSearch,
    isPending,
    isError,
    onRetry,
}: NoteHeaderProps) {
    const { open, isMobile } = useSidebar();
    return (
        <div className="flex gap-1 items-center justify-between mt-2">
            {/* Note header left side */}
            <div
                className={cn(
                    "flex gap-1 items-center rounded-xl",
                    !isMobile && open && "invisible pointer-events-none",
                )}
            >
                <SidebarTrigger />
            </div>
            <Button
                variant={"outline"}
                className="justify-between w-[40%] rounded-[10px]"
                onClick={onOpenSearch}
            >
                <Search />
                {"cmd+k"}
            </Button>
            {/* Note header right side */}
            <div className="flex gap-1 items-center">
                <div className="flex items-center gap-1">
                    {isPending ? (
                        <LoaderPinwheel className="text-gray-500 duration-400 animate-spin size-4" />
                    ) : isError ? (
                        <Button size="icon-sm" onClick={onRetry}>
                            <CircleAlert className="size-4" />
                        </Button>
                    ) : (
                        <Check className="text-accent-foreground size-4" />
                    )}
                </div>
                <Profile />
            </div>
        </div>
    );
}
