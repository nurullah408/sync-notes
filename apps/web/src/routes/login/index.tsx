import { createFileRoute, redirect } from "@tanstack/react-router";
import { Login } from "./-components/login";
import { authQueryOptions } from "@/lib/auth-query";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/login/")({
  beforeLoad: async ({ context }) => {
    let result = null;
    try {
      const data = await context.queryClient.ensureQueryData(authQueryOptions);
      result = data;
    } catch (error) {
      console.error("User not authenticated", error);
      return result;
    }
    if (result?.data?.id) {
      throw redirect({ to: "/notes" });
    }
  },
  pendingComponent: () => (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="">
        <Loader className="animate-spin" />
      </div>
    </div>
  ),
  component: Login,
});
