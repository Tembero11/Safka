export enum Theme {
    Default = "default",
    Light = "light",
    Dark = "dark"
}

export class UserPreferences {
    constructor() {

    }

    updateTheme() {

    }

    setTheme(theme: Theme) {

    }
    getTheme() {
        return (localStorage.getItem("theme") || Theme.Default) as Theme;
    }
}

export interface UIThemeProperties {
    "--ui-text-not-important": string
    "--ui-text-selection-color": string
    "--ui-text-selection-bg": string
    "--ui-text-regular-color": string
    "--ui-day-box-color": string
    "--ui-tooltip-bg": string
    "--ui-divider-color": string
    "--ui-today-box-glow": string
    "--ui-header-color": string
    "--ui-footer-color": string
    "--ui-page-background": string
    "--ui-page-text-color": string
}