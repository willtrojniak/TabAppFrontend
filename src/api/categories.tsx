import axios from "axios";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { Category, CategoryOverview, ItemOverview } from "../types/types";
import { QueryClient, QueryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getShopItemForIdQueryOptions, getShopItemsQueryOptions } from "./items";
import React from "react";
import { CategoryCreate } from "@/types/schemas";

function createCategory({ shopId, data }: { shopId: number, data: CategoryCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/categories`
  return axios.post(url, data);
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (_, { shopId, data }) => {
      queryClient.invalidateQueries({ queryKey: getShopCategoriesQueryOptions(shopId).queryKey })
      data.item_ids.forEach((itemId) => {
        queryClient.invalidateQueries({ queryKey: getShopItemForIdQueryOptions(shopId, itemId).queryKey })
      })
    },
  })
}

function updateCategory({ shopId, categoryId, data }: { shopId: number, categoryId: number, data: CategoryCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/categories/${categoryId}`
  return axios.patch(url, data);
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (_, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: getShopCategoriesQueryOptions(shopId).queryKey })
      queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(shopId).queryKey })
    },
  })
}

function deleteCategory({ shopId, categoryId }: { shopId: number, categoryId: number }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/categories/${categoryId}`
  return axios.delete(url);
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: getShopCategoriesQueryOptions(shopId).queryKey })
      queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(shopId).queryKey })
    },
  })
}

async function getShopCategories(shopId: number) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/categories`
  const response = await axios.get<CategoryOverview[]>(url)
  return response.data;
}

export function getShopCategoriesQueryOptions(shopId: number) {
  return { queryKey: ['shops', shopId, 'categories'], queryFn: () => getShopCategories(shopId) } satisfies QueryOptions
}

export function useGetShopCategories(shopId: number) {
  const { data: categories } = useSuspenseQuery(getShopCategoriesQueryOptions(shopId))
  const { data: items } = useSuspenseQuery(getShopItemsQueryOptions(shopId))
  return React.useMemo<Category[]>(() => {
    const map = new Map<number, ItemOverview>();
    items.forEach(item => {
      map.set(item.id, item)
    })
    const data = categories.map((category, index) => ({
      shop_id: shopId,
      id: category.id,
      name: category.name,
      index: index,
      items: category.item_ids.filter(itemId => map.has(itemId)).map(itemId => map.get(itemId)!)
    } satisfies Category))
    return data
  }, [shopId, categories, items])
}

export async function ensureShopCategories(queryClient: QueryClient, shopId: number) {
  return await queryClient.ensureQueryData(getShopCategoriesQueryOptions(shopId))
}

export function invalidateShopCategories(queryClient: QueryClient, shopId: number) {
  queryClient.invalidateQueries({ queryKey: getShopCategoriesQueryOptions(shopId).queryKey })
}
