import axios, { AxiosError } from "axios";
import { User } from "../types/types";
import { QueryClient, QueryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, API_VERSION } from "../util/constants";
import { UserUpdate } from "@/types/schemas";

function updateUser({ data }: { data: UserUpdate }) {
  const url = `${API_BASE_URL}/api/${API_VERSION}/users`
  return axios.patch(url, data)
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserQueryOptions().queryKey })
    },
  })
}

async function getUser() {
  const url = `${API_BASE_URL}/api/${API_VERSION}/users`

  try {
    const response = await axios.get<User>(url)
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 401) {
        return null;
      }
    }
    return null;
  }
}

function getUserQueryOptions() {
  return { queryKey: ['user'], queryFn: getUser } satisfies QueryOptions
}

export async function ensureUser(queryClient: QueryClient) {
  return await queryClient.ensureQueryData(getUserQueryOptions())
}

export function useGetUser() {
  return useQuery(getUserQueryOptions())
}

export function invalidateGetUser(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['user'] })
}
