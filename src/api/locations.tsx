import axios from "axios";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationCreate } from "@/types/schemas";
import { getShopForIdQueryOptions } from "./shops";

function createLocation({ shopId, data }: { shopId: number, data: LocationCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/locations`
  return axios.post(url, data);
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: (_, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: getShopForIdQueryOptions(shopId).queryKey })
    },
  })
}

function updateLocation({ shopId, locationId, data }: { shopId: number, locationId: number, data: LocationCreate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/locations/${locationId}`
  return axios.patch(url, data);
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocation,
    onSuccess: (_, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: getShopForIdQueryOptions(shopId).queryKey })
    },
  })
}

function deleteLocation({ shopId, locationId }: { shopId: number, locationId: number }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/shops/${shopId}/locations/${locationId}`
  return axios.delete(url);
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: (_, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: getShopForIdQueryOptions(shopId).queryKey })
    },
  })
}
