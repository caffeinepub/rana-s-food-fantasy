import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MenuItem } from "../backend.d";
import { Category } from "../backend.d";
import { useActor } from "./useActor";

export type { MenuItem };
export { Category };

// MenuItemWithId includes the real backend ID
export type MenuItemWithId = { id: bigint } & MenuItem;

// ─── Menu Queries ────────────────────────────────────────────────────────────

export function useGetAllMenuItemsByCategory() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[Category, Array<MenuItemWithId>]>>({
    queryKey: ["menuItemsByCategory"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAllPersistentMenuItemsByCategory();
      return raw.map(([category, items]): [Category, Array<MenuItemWithId>] => [
        category,
        items.map(([id, item]) => ({ id, ...item })),
      ]);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<MenuItemWithId>>({
    queryKey: ["allMenuItems"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getAllPersistentMenuItems();
      return raw.map(([id, item]) => ({ id, ...item }));
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
