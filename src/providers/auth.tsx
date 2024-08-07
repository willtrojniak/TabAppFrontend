import React, { useCallback } from "react";
import { Auth, User } from "../types/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const AuthContext = React.createContext<Auth | null>(null);

async function getUser() {
  const url = 'http://127.0.0.1:3000/api/v1/users'

  try {
    const response = await axios.get<User>(url, { withCredentials: true })
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 401) {
        return null;
      }
    }
    console.error("Error fetching user data", error)
    return null;
  }
}

function useGetUser() {
  return useQuery({ queryKey: ['getUser'], queryFn: () => getUser() })
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetUser();
  const queryClient = useQueryClient();
  const isAuthenticated = !!user;

  const logout = useCallback(async () => {
    await axios.post('http://127.0.0.1:3000/logout')
    queryClient.invalidateQueries({ queryKey: ['getUser'] })
  }, [])

  return <AuthContext.Provider value={{ isAuthenticated, user: user ?? undefined, login: () => { }, logout }}>
    {!isLoading && children}
  </AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  return context;
}
