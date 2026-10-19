import { queryClient } from "@/lib/query-client";
import { DbClient } from "@tanstack/react-db";

export const dbClient = new DbClient({
  queryClient,
});
