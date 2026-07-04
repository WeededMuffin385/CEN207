import {createContext} from "react";

export type User = {
    id: string;
    name: string;
}

export type AuthContextValue = {
    user: User | null,
    isLoading: boolean,
    isAuthenticated: boolean,
}

export const AuthContext = createContext<AuthContextValue | null>(null)
