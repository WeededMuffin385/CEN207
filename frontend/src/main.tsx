import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './app/app.tsx'
import {BrowserRouter} from "react-router";
import {AuthProvider} from "./auth_provider/auth_provider.tsx";
import {CartsProvider} from "./carts_provider/carts_provider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartsProvider>
                    <App/>
                </CartsProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
