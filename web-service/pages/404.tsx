import Link from "next/link";
import styles from "../styles/404.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        <span className={styles["err-digit"]} style={{animationDelay: "0ms"}}>4</span>
        <span className={styles["err-digit"]} style={{animationDelay: "200ms"}}>0</span>
        <span className={styles["err-digit"]} style={{animationDelay: "400ms"}}>4</span> Sivua ei löydy
      </h1>
      <p className={styles.explanation}>Emme valitettavasti löytäneet etsimääsi sivua.</p>
      <Link href="/" className={styles["home-button"]}>Etusivulle</Link>
    </div>
  )
}