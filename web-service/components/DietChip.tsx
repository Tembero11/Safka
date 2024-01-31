import styles from "./css/DietChip.module.scss";

export default function DietChip(props: { children: string; longName?: string }) {
  return (
    <span
      className={styles.diet}
      style={{ cursor: props.longName ? "pointer" : "default" }}
    >
      {props.children}
      {props.longName ? (
        <div className={styles["diet-tooltip"]}>{props.longName}</div>
      ) : (
        <></>
      )}
    </span>
  );
}
