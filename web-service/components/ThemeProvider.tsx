import { useEffect, useState } from "react"
import { Theme, UIThemeProperties, UserPreferences } from "../common/UserPreferences";

const darkTheme: Partial<UIThemeProperties> = {
    "--ui-day-box-color": "#1b1619",
    "--ui-text-not-important": "#f4f4f4",
    "--ui-divider-color": "#484848",
    "--ui-header-color": "#ffffff",
    "--ui-footer-color": "#481515",
    "--ui-text-regular-color": "white",
    "--ui-page-background": "#1b1619",
    "--ui-page-text-color": "white",
}
const lightTheme: Partial<UIThemeProperties> = {
    "--ui-text-not-important": "#8f8f8f",
    "--ui-text-selection-color": "white",
    "--ui-text-selection-bg": "#ff6767",
    "--ui-text-regular-color": "black",
    "--ui-day-box-color": "white",
    "--ui-tooltip-bg": "#4a4a4a",
    "--ui-divider-color": "#d9d9d9",
    "--ui-today-box-glow": "#ff353548",
    "--ui-header-color": "#262c30",
    "--ui-footer-color": "#ff3535",
    "--ui-page-background": "white",
    "--ui-page-text-color": "black",
}

export default function ThemeProvider() {
    const [theme, setTheme] = useState(Theme.Default);

    useEffect(() => {
        if (typeof window != "undefined") {
            console.log(theme)
            setTheme(new UserPreferences().getTheme());
        }
    });


    if (theme === Theme.Light) {
        const css = themeToCSS(lightTheme);
        return <style jsx global>{css}</style>;
    }else if (theme === Theme.Dark) {
        const css = themeToCSS(darkTheme);
        return <style jsx global>{css}</style>;
    }else {
        return <></>
    }
}

function themeToCSS(theme: Partial<UIThemeProperties>) {
    const rules = Object.entries(theme).map(([key, value]) => key + ": " + value).join(";\n");
    return `:root {\n${rules};\n}`;
}