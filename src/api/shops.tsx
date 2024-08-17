import axios from "axios";
import { QueryClient, QueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { Shop } from "../types/types";
import { ShopCreate } from "@/types/schemas";

function createShop({ data }: { data: ShopCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops`
  return axios.post(url, data)
}

export function useCreateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getShopsQueryOptions().queryKey })
    },
  })
}

function updateShop({ shopId, data }: { shopId: number, data: ShopCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}`
  return axios.patch(url, data)
}

export function useUpdateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getShopsQueryOptions().queryKey })
    },
  })
}

async function getShops() {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops`
  const response = await axios.get<Shop[]>(url)
  return response.data;
}

export function getShopsQueryOptions() {
  return { queryKey: ['shops'], queryFn: getShops } satisfies QueryOptions
}

export async function ensureShops(queryClient: QueryClient) {
  return await queryClient.ensureQueryData(getShopsQueryOptions())
}

export function invalidateGetShops(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['shops'] })
}

async function getShopForId(shopId: number) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}`
  const response = await axios.get<Shop>(url)
  return response.data;
}

export function getShopForIdQueryOptions(shopId: number) {
  return { queryKey: ['shops', shopId], queryFn: () => getShopForId(shopId) } satisfies QueryOptions
}

export async function ensureShopForId(queryClient: QueryClient, shopId: number) {
  return await queryClient.ensureQueryData(getShopForIdQueryOptions(shopId))
}

export function invalidateGetShopForId(queryClient: QueryClient, shopId: number) {
  queryClient.invalidateQueries({ queryKey: ['shops', shopId] })
}
