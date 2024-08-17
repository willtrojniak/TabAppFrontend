import { API_BASE_URL, API_VERSION } from "@/util/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getShopItemForIdQueryOptions, ItemUpdateIds } from "./items";
import { ItemVariantCreate } from "@/types/schemas";


export type ItemVariantUpdateIds = ItemUpdateIds & {
  variantId: number
}

function createItemVariant({ shopId, itemId, data }: ItemUpdateIds & { data: ItemVariantCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items/${itemId}/variants`
  return axios.post(url, data)
}

function updateItemVariant({ shopId, itemId, variantId, data }: ItemVariantUpdateIds & { data: ItemVariantCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items/${itemId}/variants/${variantId}`
  return axios.patch(url, data)
}

function deleteItemVariant({ shopId, itemId, variantId }: ItemVariantUpdateIds) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/items/${itemId}/variants/${variantId}`
  return axios.delete(url, {})
}

export function useCreateItemVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItemVariant,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopItemForIdQueryOptions(variables.shopId, variables.itemId).queryKey })
    },
  })
}

export function useUpdateItemVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItemVariant,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopItemForIdQueryOptions(variables.shopId, variables.itemId).queryKey })
    },
  })
}

export function useDeleteItemVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItemVariant,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopItemForIdQueryOptions(variables.shopId, variables.itemId).queryKey })
    },
  })
}

