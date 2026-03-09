import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MenuItem } from "../backend.d";
import { Category } from "../backend.d";
import { useActor } from "./useActor";

export type { MenuItem };
export { Category };

// ─── Menu Queries ────────────────────────────────────────────────────────────

export function useGetAllMenuItemsByCategory() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[Category, Array<MenuItem>]>>({
    queryKey: ["menuItemsByCategory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPersistentMenuItemsByCategory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<MenuItem>>({
    queryKey: ["allMenuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPersistentMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Menu Mutations ──────────────────────────────────────────────────────────

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (menuItem: MenuItem) => {
      if (!actor) throw new Error("Not connected");
      return actor.addPersistentMenuItem(menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      menuItem,
    }: { id: bigint; menuItem: MenuItem }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePersistentMenuItem(id, menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePersistentMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}

export function useSeedSampleItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.seedSampleItems();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemsByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["allMenuItems"] });
    },
  });
}
