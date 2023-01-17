import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "./css/Layout.module.css";

export default function Layout(props: { children: React.ReactNode }) {
  const router = useRouter();
  
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Link href="/" className={styles.logoLink}><h1 className={styles.logo}>Safka.<br />Online</h1></Link>
        {/* <button onClick={() => router.push("/settings", undefined, { shallow: true })} className={styles.settingsBtn + " material-symbols-outlined"}>settings</button> */}
      </div>
      <div className={styles.content}>
        { props.children }
      </div>
      <Footer/>
    </div>
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
          <li><FooterLink href="https://github.com/Tembero11/SafkaArchiver">API</FooterLink></li>
          <li><FooterLink href="https://github.com/Tembero11/SafkaNext">Web</FooterLink></li>
        </ul>
    </footer>
  );
}

function FooterLink(props: {href: string, children: string}) {
  return <a className={styles.link} href={props.href} target="_blank" rel="noreferrer">{props.children} <span className="material-symbols-outlined">open_in_new</span></a>
}

