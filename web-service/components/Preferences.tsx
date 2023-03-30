import { useEffect, useState } from "react";
import styles from "./css/Preferences.module.scss";
import { OsPreferredTheme, useTheme } from "./ThemeProvider";

import uiLightImage from "../public/assets/ui_light.svg";
import uiDarkImage from "../public/assets/ui_dark.svg";
import uiSystemPreferenceImage from "../public/assets/ui_system_preference.svg";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Preferences(props: IProps) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isSettingsDisplay, setSettingsDisplay] = useState(false);

  const themeContext = useTheme();
  const currentAppTheme = themeContext.theme;
  const setCurrentAppTheme = themeContext.setTheme;
  const osPreferredTheme = themeContext.osPreferredTheme;

  // Contains the currently selected theme
  const [selectedTheme, setSelectedTheme] = useState(currentAppTheme);

  // currentAppTheme is originally null
  // Set the selected theme to currentAppTheme when the value is loaded
  useEffect(() => {
    setSelectedTheme(currentAppTheme);
  }, [currentAppTheme]);

  const SETTINGS_ANIMATION_LENGTH = 200;

  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => {
        setSettingsOpen(props.isOpen);
      }, SETTINGS_ANIMATION_LENGTH);
      setSettingsDisplay(props.isOpen);
    } else {
      setTimeout(() => {
        setSettingsDisplay(props.isOpen);
      }, SETTINGS_ANIMATION_LENGTH);
      setSettingsOpen(props.isOpen);
    }
  }, [props.isOpen]);

  function onThemeChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedTheme(e.target.value);
  }

  function onSettingsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // const preferences = new UserPreferences();

    // Save theme theme to localStorage
    // preferences.setTheme(selectedTheme);

    // Update the app to the new theme
    setCurrentAppTheme(selectedTheme);

    props.onClose();
  }
  function onSettingsCancel() {
    // Reset all settings here to the original state
    // setSelectedTheme(currentAppTheme);

    props.onClose();
  }

  return (
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
          <h2 style={{marginTop: 0}}>Käyttäjän Asetukset</h2>
          <hr style={{width: "10em"}} />
          <h3>Teema</h3>
          <p className="on-background-slight-color">Mukauta käyttöliittymän ulkonäköä</p>
          <div className={styles["theme-select"]}>
            <label className={`${styles["theme-select-block"]} ${selectedTheme == "os" ? styles["theme-select-block-checked"] : ""}`}>
              <div className={styles["theme-select-preview"]} style={{backgroundImage: `url(${uiSystemPreferenceImage.src})`}}>
                <input type="radio" value={"os"} checked={selectedTheme == "os"} onChange={onThemeChanged} className="material-symbols-outlined" />
              </div>
              <span>Järjestelmän Oletus <strong className={styles["default-theme"]}>({osPreferredTheme == OsPreferredTheme.Light ? "Vaalea" : "Tumma"})</strong></span>
              
            </label>
            <label className={`${styles["theme-select-block"]} ${selectedTheme == "light" ? styles["theme-select-block-checked"] : ""}`}>
              <div className={styles["theme-select-preview"]} style={{backgroundImage: `url(${uiLightImage.src})`}}>
                <input type="radio" value={"light"} checked={selectedTheme == "light"} onChange={onThemeChanged} className="material-symbols-outlined" />
              </div>
              <span>Vaalea Teema</span>
            </label>
            <label className={`${styles["theme-select-block"]} ${selectedTheme == "dark" ? styles["theme-select-block-checked"] : ""}`}>
              <div className={styles["theme-select-preview"]} style={{backgroundImage: `url(${uiDarkImage.src})`}}>
                <input type="radio" value={"dark"} checked={selectedTheme == "dark"} onChange={onThemeChanged} className="material-symbols-outlined" />
              </div>
              <span>Tumma Teema</span>
            </label>
          </div>
          {/* <hr style={{width: "10em"}} />
          <h3>Tekniset Tiedot</h3>
          <p className="on-background-slight-color">Ohjelmiston tekniset tiedot</p>
          <p className="on-background-slight-color">{process.env.BUILD_ID}</p>
          <h3>Erityisruokavaliot</h3>
          <p className="on-background-slight-color">Näät vain ruuat joilla nämä erityisruokavaliot</p>
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
  )
}