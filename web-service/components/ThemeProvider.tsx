import React, { useContext, useEffect, useState } from "react";

export enum OsPreferredTheme {
  Light = "light",
  Dark = "dark"
}

interface IThemeContext {
  theme: string;
  setTheme: (themeName: string) => void;
  osPreferredTheme: OsPreferredTheme
}

export const ThemeContext = React.createContext({});

export const useTheme = () => useContext(ThemeContext) as IThemeContext;

interface IProps {
    children?: React.ReactNode
}

export default function ThemeProvider({ children }: IProps) {
  const [theme, setTheme] = useState<string | null>(null);
  const [osPreferredTheme, setOsPreferredTheme] = useState(OsPreferredTheme.Light);

  useEffect(() => {
    const { matches } = window.matchMedia("(prefers-color-scheme: dark)");
    const osTheme = matches ? OsPreferredTheme.Dark : OsPreferredTheme.Light;
    setOsPreferredTheme(osTheme);

    // Listen for changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
      const osTheme = event.matches ? OsPreferredTheme.Dark : OsPreferredTheme.Light;
      setOsPreferredTheme(osTheme);
    });

    let theme = localStorage.getItem("user-theme");
    if (!(theme == "dark" || theme == "light")) {
      theme = null;
    }

    if (theme) setTheme(theme);
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("user-theme", theme);
  }, [theme]);

  const value = {
    theme,
    osPreferredTheme,
    setTheme: (themeName: string) => setTheme(themeName)
  }
    
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// .getInitialProps = async(context: AppContext) => {
//     const initialProps = await NextApp.getInitialProps(context);
//     const { req, res } = context.ctx;
//     const themeCookie = getCookie("user-theme", { req, res });
    
//     let theme;
//     if (themeCookie == "dark" || themeCookie == "light") {
//       theme = themeCookie
//     }else {
//       theme = null;
//     }
  
//     return {
//       ...initialProps,
//       theme
//     }
//   }