import React, { useCallback } from "react";
import { Auth } from "../types/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { invalidateGetUser, useGetUser } from "../api/users";
import { API_BASE_URL } from "@/util/constants";

const AuthContext = React.createContext<Auth | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetUser();
  const queryClient = useQueryClient();
  const isAuthenticated = !!user;

  const logout = useCallback(async () => {
    await axios.post(`${API_BASE_URL}/logout`)
    invalidateGetUser(queryClient)
  }, [queryClient])

  return <AuthContext.Provider value={{ isAuthenticated, user: user ?? undefined, logout }}>
    {!isLoading && children}
  </AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context;
}
