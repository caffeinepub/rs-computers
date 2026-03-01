import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, Service, ShopInfo } from "../backend.d";
import type { Category } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetShopInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<ShopInfo>({
    queryKey: ["shopInfo"],
    queryFn: async () => {
      if (!actor) {
        return {
          name: "RS Computers",
          address: "Loading...",
          phone: "Loading...",
          email: "Loading...",
          hours: "Loading...",
        };
      }
      return actor.getShopInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.seedData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["shopInfo"] });
    },
  });
}
