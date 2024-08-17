import axios from "axios";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { SubstitutionGroup } from "../types/types";
import { QueryClient, QueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubstitutionGroupCreate } from "@/types/schemas";
import { getShopItemForIdQueryOptions, getShopItemsQueryOptions } from "./items";

function createSubstitutionGroup({ shopId, data }: { shopId: number, data: SubstitutionGroupCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/substitutions`
  return axios.post(url, data);
}

export function useCreateSubstitutionGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubstitutionGroup,
    onSuccess: (_, { shopId, data }) => {
      queryClient.invalidateQueries({ queryKey: getShopSubstitutionsQueryOptions(shopId).queryKey })
      data.substitution_item_ids.forEach((itemId) => {
        queryClient.invalidateQueries({ queryKey: getShopItemForIdQueryOptions(shopId, itemId).queryKey })
      })
    },
  })
}

function updateSubstitutionGroup({ shopId, groupId, data }: { shopId: number, groupId: number, data: SubstitutionGroupCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/substitutions/${groupId}`
  return axios.patch(url, data);
}

export function useUpdateSubstitutionGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubstitutionGroup,
    onSuccess: (_, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: getShopSubstitutionsQueryOptions(shopId).queryKey })
      queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(shopId).queryKey })
    },
  })
}

function deleteSubstitutionGroup({ shopId, groupId }: { shopId: number, groupId: number }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/substitutions/${groupId}`
  return axios.delete(url);
}

export function useDeleteSubstitutionGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubstitutionGroup,
    onSuccess: (_, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: getShopSubstitutionsQueryOptions(shopId).queryKey })
      queryClient.invalidateQueries({ queryKey: getShopItemsQueryOptions(shopId).queryKey })
    },
  })
}

async function getShopSubstitutions(shopId: number) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/substitutions`
  const response = await axios.get<SubstitutionGroup[]>(url)
  return response.data;
}

export function getShopSubstitutionsQueryOptions(shopId: number) {
  return { queryKey: ['shops', shopId, 'substitutions'], queryFn: () => getShopSubstitutions(shopId) } satisfies QueryOptions
}

export async function ensureShopSubstitutions(queryClient: QueryClient, shopId: number) {
  return await queryClient.ensureQueryData(getShopSubstitutionsQueryOptions(shopId))
}

export function invalidateShopSubstitutions(queryClient: QueryClient, shopId: number) {
  queryClient.invalidateQueries({ queryKey: getShopSubstitutionsQueryOptions(shopId).queryKey })
}
