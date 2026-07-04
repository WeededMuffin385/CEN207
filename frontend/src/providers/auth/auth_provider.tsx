import {useEffect, useState} from "react";
import {AuthContext, type User} from "./auth_context.tsx";


export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch("/api/auth/session", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    setUser(null);
                    return
                }

                const data = await response.json();
                setUser(data.user)
            } catch {
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        checkSession()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: user !== null
        }}>
            {children}
        </AuthContext.Provider>
    )
}

