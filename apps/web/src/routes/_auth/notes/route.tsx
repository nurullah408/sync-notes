import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { AppSidebar } from "./-components/AppSidebar";
import { ModalManager } from "@/components/modals/ModalManager";

export const Route = createFileRoute("/_auth/notes")({
    component: Index,
});

function Index() {
    return (
        <Fragment>
            <ModalManager />
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="">
                    <div className="w-full h-screen">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </Fragment>
    );
}
