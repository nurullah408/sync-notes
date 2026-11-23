import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function NoteLoader() {
    const { open } = useSidebar();

    return (
        <div className="px-4 pt-2 border rounded h-full w-full">
            {/* Header */}
            <div className="flex gap-1 items-center justify-between">
                {/* Note header left side */}
                <div
                    className={cn(
                        "flex gap-1 items-center",
                        open ? "invisible pointer-events-none" : "visible",
                    )}
                >
                    <SidebarTrigger />
                </div>
                <div className="justify-between w-[40%] rounded-[10px] bg-accent-foreground">
                    <div className="animate-pulse w-full" />
                </div>
                {/* Note header right side */}
                <div className="flex gap-1 items-center bg-gray-200 rounded-full">
                    <div className="size-8 rounded-xl animate-pulse" />
                </div>
            </div>
            <div className="relative flex flex-col mt-2 gap-2 px-8 h-full overflow-hidden">
                <div className="w-full animate-pulse">
                    <div className="h-8 rounded-md bg-gray-200" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    Last updated on{" "}
                    <div className="animate-pulse">
                        <div className="rounded-sm w-16 h-4 bg-gray-200" />
                    </div>
                </h3>
                <div className="h-[80%] rounded-lg overflow-y-auto">
                    <div className="w-full h-full animate-pulse flex flex-col gap-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-md w-full h-7 bg-gray-200"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
