import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./css/Layout.module.scss";
import { OsPreferredTheme, useTheme } from "./ThemeProvider";


import Preferences from "./Preferences";

export default function Layout(props: { children: React.ReactNode }) {
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  

  return (
    <>
      {/* <ThemeProvider key={currentAppTheme} theme={currentAppTheme} /> */}
      <div className={styles.container}>
        <div className={styles.navbar}>
          <Link href="/" className={styles["logo-link"]}><h1 className={styles.logo}>Safka.<br />Online</h1></Link>
          <button onClick={() => setPreferencesOpen(!isPreferencesOpen)} className={styles["settings-btn"] + " material-symbols-outlined"}>settings</button>
        </div>
        <div className={styles.content}>
          {props.children}
        </div>
        <Footer />
      </div>
      <Preferences isOpen={isPreferencesOpen} onClose={() => setPreferencesOpen(false)}/>
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
