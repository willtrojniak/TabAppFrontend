import axios from "axios";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { Item, ItemOverview } from "../types/types";
import { QueryClient, QueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemCreate } from "@/types/schemas";
import { getShopCategoriesQueryOptions } from "./categories";

export type ItemUpdateIds = {
  shopId: number
  itemId: number
}

function createItem({ shopId, data }: { shopId: number, data: ItemCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items`
  return axios.post(url, data)
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(variables.shopId).queryKey })
      variables.data.category_ids.forEach(() => {
        queryClient.invalidateQueries({ queryKey: getShopCategoriesQueryOptions(variables.shopId).queryKey })
      })
    },
  })
}

function updateItem({ shopId, itemId, data }: { shopId: number, itemId: number, data: ItemCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items/${itemId}`
  return axios.patch(url, data)
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(variables.shopId).queryKey })
      variables.data.category_ids.forEach(() => {
        queryClient.invalidateQueries({ queryKey: getShopCategoriesQueryOptions(variables.shopId).queryKey })
      })
    },
  })
}

function deleteItem({ shopId, itemId }: { shopId: number, itemId: number }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items/${itemId}`
  return axios.delete(url)
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(variables.shopId).queryKey })
      queryClient.invalidateQueries({ queryKey: getShopCategoriesQueryOptions(variables.shopId).queryKey })
    },
  })
}

async function getShopItems(shopId: number) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items`
  const response = await axios.get<ItemOverview[]>(url)
  return response.data;
}

export function getShopItemsQueryOptions(shopId: number) {
  return { queryKey: ['shops', shopId, 'items'], queryFn: () => getShopItems(shopId) } satisfies QueryOptions
}

export async function ensureShopItems(queryClient: QueryClient, shopId: number) {
  return await queryClient.ensureQueryData(getShopItemsQueryOptions(shopId))
}

export function invalidateShopItems(queryClient: QueryClient, shopId: number) {
  queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(shopId).queryKey })
}

async function getShopItemForId(shopId: number, itemId: number) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items/${itemId}`
  const response = await axios.get<Item>(url)
  return response.data;
}

export function getShopItemForIdQueryOptions(shopId: number, itemId: number) {
  return { queryKey: ['shops', shopId, 'items', itemId], queryFn: () => getShopItemForId(shopId, itemId) } satisfies QueryOptions
}

export async function ensureShopItemForId(queryClient: QueryClient, shopId: number, itemId: number) {
  return await queryClient.ensureQueryData(getShopItemForIdQueryOptions(shopId, itemId))
}

export function invalidateShopItemForId(queryClient: QueryClient, shopId: number, itemId: number) {
  queryClient.invalidateQueries({ queryKey: getShopItemForIdQueryOptions(shopId, itemId).queryKey })
}
