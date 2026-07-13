// useTheme.ts
import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
    return localStorage.getItem("theme") === "light"
        ? "light"
        : "dark";
}

function applyTheme(theme: Theme): void {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = useCallback((theme: Theme) => {
        setThemeState(theme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((currentTheme) =>
            currentTheme === "light" ? "dark" : "light",
        );
    }, []);

    return {
        theme,
        setTheme,
        toggleTheme,
    };
}