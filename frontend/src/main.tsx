import './index.css'
import App from './app/app.tsx'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router";
import {AuthProvider} from "./providers/auth/auth_provider.tsx";
import {CartsProvider} from "./providers/carts/carts_provider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();
const savedTheme = localStorage.getItem("theme");

document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <CartsProvider>
                        <App/>
                    </CartsProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)
