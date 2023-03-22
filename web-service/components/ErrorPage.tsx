import Link from "next/link";
import styles from "./css/ErrorPage.module.scss";

interface IProps {
  code: number;
  header: string;
  explanation: string;
  showHomeButton?: boolean;
}

export default function ErrorPage(props: IProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        {props.code.toString().split("").map((char, index) => {
          return (
            <span className={styles["err-digit"]} style={{ animationDelay: `${index * 100}ms` }}>{char}</span>
          )
        })}
        &nbsp;
        <span>{props.header}</span>
      </h1>
      <p className={styles.explanation}>{props.explanation}</p>
      {
        props.showHomeButton ? <Link href="/" className={styles["home-button"]}>Etusivulle</Link> : null
      }
    </div>
  )
}