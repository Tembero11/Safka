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
          <Link href="/" className={styles.logoLink}><h1 className={styles.logo}>Safka.<br />Online</h1></Link>
          <button onClick={() => changeSettingsState(!isSettingsOpen)} className={styles.settingsBtn + " material-symbols-outlined"}>settings</button>
        </div>
        <div className={styles.content}>
          {props.children}
        </div>
        <Footer />
      </div>

      <div className={styles.preferencesContainer} onClick={e => {
        if (e.target === e.currentTarget) {
          onSettingsCancel();
        }
      }} style={{
        display: isSettingsDisplay ? "flex" : "none",
        opacity: isSettingsOpen ? 1 : 0
      }}>
        <form onSubmit={onSettingsSubmit} className={styles.preferences} style={{ transform: `scale(${isSettingsOpen ? 1 : 0})` }}>
          <div className={styles.preferencesContent}>
            <h1>Käyttäjän Asetukset</h1>
            <h2>Teemat</h2>
            <div className={styles.themeSelect}>
              <label className={styles.themeSelectBlock}>
                <span>Järjestelmän Oletus <span className={styles.defaultTheme}>({currentOsTheme == Theme.Light ? "Vaalea" : "Tumma"})</span></span>
                <input type="radio" value={Theme.Default} checked={selectedTheme == Theme.Default} onChange={onThemeChanged} />
              </label>
              <label className={styles.themeSelectBlock}>
                Vaalea Teema
                <input type="radio" value={Theme.Light} checked={selectedTheme == Theme.Light} onChange={onThemeChanged} />
              </label>
              <label className={styles.themeSelectBlock}>
                Tumma Teema
                <input type="radio" value={Theme.Dark} checked={selectedTheme == Theme.Dark} onChange={onThemeChanged} />
              </label>
            </div>
            {/* <h2>Erityisruokavaliot</h2>
                <p>Näät vain ruuat joilla nämä erityisruokavaliot</p>
                <div className={styles.dietChips}>
                  <DietChip>Laktoositon</DietChip>
                  <DietChip>Gluteeniton</DietChip>
                  <DietChip>Maidoton</DietChip>
                </div> */}
          </div>
          <div className={styles.preferencesBottomBar}>
            <input className={styles.preferencesBottomBtn} onClick={onSettingsCancel} type="button" value="Peruuta" />
            <input className={styles.preferencesBottomBtn} type="submit" value="Tallenna" />
          </div>
        </form>
      </div>

    </>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <h3 className={styles.footerHeader}>Resources</h3>
      <ul className={styles.footerLinks}>
        <li><FooterLink href="https://api.safka.online/v1/menu">API</FooterLink></li>
        <li><FooterLink href="https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli">Data Source</FooterLink></li>

      </ul>
      <h3 className={styles.footerHeader}>Open Source</h3>
      <ul className={styles.footerLinks}>
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
    <div className={styles.dietChip}>{props.children}</div>
  )
}