import axios from "axios";
import { QueryClient, QueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { Shop, ShopOverview } from "../types/types";
import { ShopCreate, ShopUserCreate } from "@/types/schemas";

function createShop({ data }: { data: ShopCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops`
  return axios.post(url, data)
}

export function useCreateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
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
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    },
  })
}

function acceptShopInvite({ shopId }: { shopId: number }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/accept`
  return axios.post(url)
}

export function useAcceptShopInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptShopInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    }
  })
}

function removeShopInvite({ shopId, data }: { shopId: number, data: ShopUserCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/users/remove`
  return axios.post(url, data)
}

export function useRemoveShopInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeShopInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    }
  })
}

function createShopInvite({ shopId, data }: { shopId: number, data: ShopUserCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/users/invite`
  return axios.post(url, data)
}

export function useCreateShopInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShopInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    }
  })
}


export type ShopsQueryParams = {
  isMember?: boolean
  isPending?: boolean
}

async function getShops({ isMember, isPending }: ShopsQueryParams) {
  const url = encodeURI(`${API_BASE_URL}/api/${API_VERSION}/shops?member=${isMember}&pending=${isPending}`)
  const response = await axios.get<ShopOverview[]>(url)
  return response.data;
}

export function getShopsQueryOptions(params: ShopsQueryParams) {
  return { queryKey: ['shops', params], queryFn: () => getShops(params) } satisfies QueryOptions
}

export async function ensureShops(queryClient: QueryClient, params: ShopsQueryParams) {
  return await queryClient.ensureQueryData(getShopsQueryOptions(params))
}

export function invalidateGetShops(queryClient: QueryClient, params: ShopsQueryParams) {
  queryClient.invalidateQueries({ queryKey: getShopsQueryOptions(params).queryKey })
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
