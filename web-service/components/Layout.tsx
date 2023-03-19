import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Theme, UserPreferences } from "../common/UserPreferences";
import styles from "./css/Layout.module.css";
import ThemeProvider from "./ThemeProvider";

export default function Layout(props: { children: React.ReactNode }) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isSettingsDisplay, setSettingsDisplay] = useState(false);

  // Contains the currently selected theme
  const [selectedTheme, setSelectedTheme] = useState(Theme.Default);

  // Contains the current app theme
  const [currentAppTheme, setCurrentAppTheme] = useState(Theme.Default);
  const [currentOsTheme, setCurrentOsTheme] = useState(Theme.Light);

  useEffect(() => {
    const preferences = new UserPreferences();
    const theme = preferences.getTheme();
    setSelectedTheme(theme);
    setCurrentAppTheme(theme);

    // Check the os color scheme
    const { matches } = window.matchMedia("(prefers-color-scheme: dark)");
    const osTheme = matches ? Theme.Dark : Theme.Light;
    setCurrentOsTheme(osTheme);

    // Listen for changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
      const osTheme = event.matches ? Theme.Dark : Theme.Light;
      setCurrentOsTheme(osTheme);
    });
  }, []);

  const SETTINGS_ANIMATION_LENGTH = 200;

  function changeSettingsState(openState: boolean) {
    if (openState) {
      setTimeout(() => {
        setSettingsOpen(openState);
      }, SETTINGS_ANIMATION_LENGTH);
      setSettingsDisplay(openState);
    } else {
      setTimeout(() => {
        setSettingsDisplay(openState);
      }, SETTINGS_ANIMATION_LENGTH);
      setSettingsOpen(openState);
    }
  }

  function onThemeChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedTheme(e.target.value as Theme);
  }

  function onSettingsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const preferences = new UserPreferences();

    // Save theme theme to localStorage
    preferences.setTheme(selectedTheme);

    // Update the app to the new theme
    setCurrentAppTheme(selectedTheme);

    changeSettingsState(false);
  }
  function onSettingsCancel() {
    // Reset all settings here to the original state
    setSelectedTheme(currentAppTheme);

    changeSettingsState(false);
  }

  return (
    <>
      <ThemeProvider key={currentAppTheme} theme={currentAppTheme} />
      <div className={styles.container}>
        <div className={styles.navbar}>
          <Link href="/" className={styles["logo-link"]}><h1 className={styles.logo}>Safka.<br />Online</h1></Link>
          <button onClick={() => changeSettingsState(!isSettingsOpen)} className={styles["settings-btn"] + " material-symbols-outlined"}>settings</button>
        </div>
        <div className={styles.content}>
          {props.children}
        </div>
        <Footer />
      </div>

      <div className={styles["preferences-container"]} onClick={e => {
        if (e.target === e.currentTarget) {
          onSettingsCancel();
        }
      }} style={{
        display: isSettingsDisplay ? "flex" : "none",
        opacity: isSettingsOpen ? 1 : 0
      }}>
        <form onSubmit={onSettingsSubmit} className={styles.preferences} style={{ transform: `scale(${isSettingsOpen ? 1 : 0})` }}>
          <div className={styles["preferences-content"]}>
            <h1>Käyttäjän Asetukset</h1>
            <h2>Teemat</h2>
            <div className={styles["theme-select"]}>
              <label className={styles["theme-select-block"]}>
                <span>Järjestelmän Oletus <span className={styles["default-theme"]}>({currentOsTheme == Theme.Light ? "Vaalea" : "Tumma"})</span></span>
                <input type="radio" value={Theme.Default} checked={selectedTheme == Theme.Default} onChange={onThemeChanged} />
              </label>
              <label className={styles["theme-select-block"]}>
                Vaalea Teema
                <input type="radio" value={Theme.Light} checked={selectedTheme == Theme.Light} onChange={onThemeChanged} />
              </label>
              <label className={styles["theme-select-block"]}>
                Tumma Teema
                <input type="radio" value={Theme.Dark} checked={selectedTheme == Theme.Dark} onChange={onThemeChanged} />
              </label>
            </div>
            {/* <h2>Erityisruokavaliot</h2>
                <p>Näät vain ruuat joilla nämä erityisruokavaliot</p>
                <div className={styles["diet-chips"]}>
                  <DietChip>Laktoositon</DietChip>
                  <DietChip>Gluteeniton</DietChip>
                  <DietChip>Maidoton</DietChip>
                </div> */}
          </div>
          <div className={styles["preferences-bottom-bar"]}>
            <input className={styles["preferences-bottom-btn"]} onClick={onSettingsCancel} type="button" value="Peruuta" />
            <input className={styles["preferences-bottom-btn"]} type="submit" value="Tallenna" />
          </div>
        </form>
      </div>

    </>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <h3 className={styles["footer-header"]}>Resources</h3>
      <ul className={styles["footer-links"]}>
        <li><FooterLink href={process.env.API_URL || "https://api.safka.online/v1/menu"}>API</FooterLink></li>
        <li><FooterLink href="https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli">Data Source</FooterLink></li>

      </ul>
      <h3 className={styles["footer-header"]}>Open Source</h3>
      <ul className={styles["footer-links"]}>
        <li><FooterLink href="https://github.com/Tembero11/Safka/tree/main/api-service">API</FooterLink></li>
        <li><FooterLink href="https://github.com/Tembero11/Safka/tree/main/web-service">Web</FooterLink></li>
      </ul>
    </footer>
  );
}

function FooterLink(props: { href: string, children: string }) {
  return <a className={styles.link} href={props.href} target="_blank" rel="noreferrer">{props.children} <span className="material-symbols-outlined">open_in_new</span></a>
}


function DietChip(props: { children: React.ReactNode, isActive?: boolean }) {
  return (
    <div className={styles["diet-chip"]}>{props.children}</div>
  )
}
