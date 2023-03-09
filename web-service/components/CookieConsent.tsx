import { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./css/CookieConsent.module.css";

interface IProps {
  onConsent: Function
}

export default function CookieConsent(props: IProps) {
  const { onConsent } = props

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Maistuisiko sinulle keksi?</h1>
          <Image src="/assets/cookie.svg" width={100} height={50} style={{marginTop: "2%"}} alt="keksi"/>
        </div>

        <div className={styles.desc}>
          <p className={styles.desc}>Käytämme keksejä käyttökokemuksesi parantamiseksi ja analytiikan keräämiseen.</p>
          <p className={styles.desc}>Käyttämällä keksejä annat meille mahdollisuuden parantaa sivustoamme.</p>
          <p>Painamalla "Hyväksyn" annat Safka Onlinelle oikeuden säilyttää tietoja sessioistasi.</p>
        </div>
        
        <div className={styles.buttons}>
          <button className={styles.consentBtn} onClick={() => onConsent()}>
          Hyväksyn
          </button>

          <button className={styles.consentBtn} style={{backgroundColor: "var(--ui-tooltip-bg)"}}>
            Ei kiitos!
          </button>
        </div>
      </div>
    </>
  )
}
