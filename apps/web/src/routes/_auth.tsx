import { authQueryOptions } from "@/lib/auth-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    const result = await context.queryClient.ensureQueryData(authQueryOptions);
    if (!result?.data?.id) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
