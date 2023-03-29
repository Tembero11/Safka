import { Fragment, useEffect, useState } from "react";
import { toLocaleDateString } from "../utils/common";
import { DayMenu, Weekday } from "../utils/getWeekMenu";
import styles from "./css/DayBox.module.scss";
import Drawer from "./Drawer";

interface IProps {
  dayName: string;
  menu?: DayMenu;
  date?: Date;
  isToday?: boolean;
}

export default function DayBox(props: IProps) {
  const [date, setDate] = useState("...");
  const [rateMenuOpen, setRateMenuOpen] = useState(false);

  useEffect(() => {
    if (props.date) {
      setDate(toLocaleDateString(props.date))
    } else if (props.menu?.date) {
      setDate(toLocaleDateString(new Date(props.menu.date)))
    }
  }, [props.menu?.date, props.date])

  return (
    <>
      {
        props.isToday ? (
          <Drawer onClose={() => setRateMenuOpen(false)} isOpen={rateMenuOpen}>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
            <p>Testi</p>
          </Drawer>
        ) : null
      }
      <div className={styles.container + " " + (props.isToday ? styles.today : "")}>
        <h2 className={styles["day-name"]}>{props.dayName}</h2>
        <div className={styles.break}></div>
        <div className={styles.box}>
          <p className={styles.date}>{date}</p>
          <ul className={styles["menu-list"]}>
            {
              props.menu?.menu.map((meal, index) => {
                return (
                  <Fragment key={index}>
                    <li key={index} className={styles.menuListItem}>
                      {
                        meal.names.map((name, index) => {
                          const diets = meal.diets[index];

                          return (
                            <>
                              <span style={{ marginRight: ".5em" }}>{name}</span>
                              <div className={styles["food-diets"]}>
                                {diets.isLactoseFree ? <Diet longName="Laktoositon">L</Diet> : <></>}
                                {diets.isDairyFree ? <Diet longName="Maidoton">M</Diet> : <></>}
                                {diets.isGlutenFree ? <Diet longName="Gluteeniton">G</Diet> : <></>}
                              </div>
                            </>
                          );
                        })
                      }
                    </li>
                  </Fragment>
                );
              })
            }
          </ul>
          {
            props.menu ? <></> : <p style={{ textAlign: "center" }}>Ei saatavilla</p>
          }
          <div className={styles["bottom-actions"]} style={{ justifyContent: !props.isToday ? "flex-end" : undefined }}>
            {
              props.isToday ? <button className={styles["rate-btn"]} onClick={() => setRateMenuOpen(true)}>Arvostele!</button> : null
            }
            <button className={`material-symbols-outlined ${styles["favorite-btn"]}`}>favorite</button>
          </div>
        </div>
      </div>

    </>
  )
}

export function Diet(props: { children: string, longName?: string }) {
  return (
    <span className={styles.diet} style={{cursor: props.longName ? "pointer" : "default"}}>
      {props.children}
      {props.longName ? <div className={styles["diet-tooltip"]}>{props.longName}</div> : <></>}
    </span>
  )
}
