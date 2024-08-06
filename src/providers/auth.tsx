import React from "react";
import { Auth, User } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AuthContext = React.createContext<Auth | null>(null);

async function getUser() {
  const url = 'http://127.0.0.1:3000/api/v1/users'

  try {
    const response = await axios.get<User>(url, { withCredentials: true })
    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user data", error)
    return null;
  }
}

function useGetUser() {
  return useQuery({ queryKey: ['getUser'], queryFn: () => getUser() })
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useGetUser();
  const isAuthenticated = !!user;

  return <AuthContext.Provider value={{ isAuthenticated, user: user ?? undefined, login: () => { }, logout: () => { } }}>
    {children}
  </AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  return context;
}
