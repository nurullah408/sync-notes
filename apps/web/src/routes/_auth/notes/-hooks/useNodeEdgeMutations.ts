import { createNodeEdge } from "@/api/nodeEdge.api";
import { useMutation } from "@tanstack/react-query";

export function useNodeEdgeMutations() {
  const createEdgeNodeMutation = useMutation({
    mutationKey: ["nodeEdge"],
    mutationFn: createNodeEdge,
  });

  return { createEdgeNodeMutation };
}
