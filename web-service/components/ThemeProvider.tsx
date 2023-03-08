import { Theme, UIThemeProperties } from "../common/UserPreferences";

const darkTheme: Partial<UIThemeProperties> = {
    "--ui-day-box-color": "#1b1619",
    "--ui-text-not-important": "#f4f4f4",
    "--ui-divider-color": "#484848",
    "--ui-header-color": "#ffffff",
    "--ui-footer-color": "transparent",
    "--ui-footer-second-color": "#481515",
    "--ui-text-regular-color": "white",
    "--ui-page-background": "#1b1619",
    "--ui-page-text-color": "white",
    "--ui-slight-highlight": "#292929",
    "--ui-slight-highlight-hover": "#353535"
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
    "--ui-footer-second-color": "#ff3535",
    "--ui-page-background": "white",
    "--ui-page-text-color": "black",
    "--ui-slight-highlight": "#ededed",
    "--ui-slight-highlight-hover": "#dbdbdb"
}

export default function ThemeProvider(props: { theme: Theme }) {
    if (props.theme === Theme.Light) {
        const css = themeToCSS(lightTheme);
        return <style jsx global key={Theme.Light}>{css}</style>;
    }else if (props.theme === Theme.Dark) {
        const css = themeToCSS(darkTheme);
        return <style jsx global key={Theme.Dark}>{css}</style>;
    }else {
        return <style jsx global key={Theme.Default}>{""}</style>
    }
}

function themeToCSS(theme: Partial<UIThemeProperties>) {
    const rules = Object.entries(theme).map(([key, value]) => key + ": " + value).join(";\n");
    return `:root {\n${rules};\n}`;
}