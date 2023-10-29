import { writable, type Writable } from "svelte/store";
import type { Theme } from "../types";
import { browser } from "$app/environment";

export let theme: Writable<Theme>;
export let systemPreferenceTheme: Writable<Theme>;

export function getSystemPreferenceTheme(): Theme {
    return window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ? "dark" : "light";
}

if (browser) {
    const persistentTheme = localStorage.getItem("theme") 
    theme = writable<Theme>(persistentTheme as Theme ?? "os");
    theme.subscribe(value => {
        if (!browser) return
        localStorage.setItem("theme", value);
        document.documentElement.setAttribute("data-theme", value);
    })
}

if (browser) {
    systemPreferenceTheme = writable<Theme>(getSystemPreferenceTheme())

    // Listen for changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        systemPreferenceTheme.set(getSystemPreferenceTheme())
    });
}