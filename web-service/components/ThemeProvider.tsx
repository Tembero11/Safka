import React, { useContext, useEffect, useState } from "react";

export const ThemeContext = React.createContext({});

export const useTheme = () => useContext(ThemeContext) as {theme: string, setTheme: (themeName: string) => void};

interface IProps {
    children?: React.ReactNode
}

export default function ThemeProvider({ children }: IProps) {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
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