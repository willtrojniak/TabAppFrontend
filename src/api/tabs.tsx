import axios from "axios";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { QueryClient, QueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tab, TabOverview } from "src/types/types";
import { OrderCreate, TabCreate } from "@/types/schemas";

async function createTab({ shopId, data }: {
  shopId: number,
  data: TabCreate
}) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/tabs`
  return axios.post(url, data)
}

export function useCreateTab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTab,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopTabsQueryOptions(variables.shopId).queryKey })
    },
  })
}

async function updateTab({ shopId, tabId, data }: {
  shopId: number,
  tabId: number,
  data: TabCreate
}) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/tabs/${tabId}`
  return axios.patch(url, data)
}

export function useUpdateTab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTab,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopTabsQueryOptions(variables.shopId).queryKey })
    },
  })
}


async function addOrderToTab({ shopId, tabId, data }: {
  shopId: number,
  tabId: number,
  data: OrderCreate
}) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/tabs/${tabId}/add-order`
  return axios.post(url, data)
}

export function useAddOrderToTab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrderToTab,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopTabForIdQueryOptions(variables.shopId, variables.tabId).queryKey })
    },
  })
}

async function removeOrderFromTab({ shopId, tabId, data }: {
  shopId: number,
  tabId: number,
  data: OrderCreate
}) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/tabs/${tabId}/remove-order`
  return axios.post(url, data)
}

export function useRemoveOrderFromTab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeOrderFromTab,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopTabForIdQueryOptions(variables.shopId, variables.tabId).queryKey })
    },
  })
}

async function closeBill({ shopId, tabId, billId }: {
  shopId: number,
  tabId: number,
  billId: number
}) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/tabs/${tabId}/bills/${billId}/close`
  return axios.post(url)
}

export function useCloseBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closeBill,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getShopTabForIdQueryOptions(variables.shopId, variables.tabId).queryKey })
    },
  })
}

async function getShopTabs(shopId: number) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/tabs`
  const response = await axios.get<TabOverview[]>(url)
  return response.data;
}

export function getShopTabsQueryOptions(shopId: number) {
  return { queryKey: ['shops', shopId, 'tabs'], queryFn: () => getShopTabs(shopId) } satisfies QueryOptions
}

export async function ensureShopTabs(queryClient: QueryClient, shopId: number) {
  return await queryClient.ensureQueryData(getShopTabsQueryOptions(shopId))
}

export function invalidateShopTabs(queryClient: QueryClient, shopId: number) {
  queryClient.invalidateQueries({ queryKey: getShopTabsQueryOptions(shopId).queryKey })
}

async function getShopTabForId(shopId: number, tabId: number) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/tabs/${tabId}`
  const response = await axios.get<Tab>(url)
  return response.data;
}

export function getShopTabForIdQueryOptions(shopId: number, tabId: number) {
  return { queryKey: ['shops', shopId, 'tabs', tabId], queryFn: () => getShopTabForId(shopId, tabId) } satisfies QueryOptions
}

export async function ensureShopTabForId(queryClient: QueryClient, shopId: number, tabId: number) {
  return await queryClient.ensureQueryData(getShopTabForIdQueryOptions(shopId, tabId))
}

export function invalidateShopTabForId(queryClient: QueryClient, shopId: number, tabId: number) {
  queryClient.invalidateQueries({ queryKey: getShopTabForIdQueryOptions(shopId, tabId).queryKey })
}
