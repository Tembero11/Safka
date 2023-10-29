import { writable, type Writable } from "svelte/store";
import type { Theme } from "../types";
import { browser } from "$app/environment";

export let theme: Writable<Theme>;

if (browser) {
    const persistentTheme = localStorage.getItem("theme") 
    theme = writable<Theme>(persistentTheme as Theme ?? "os");
}