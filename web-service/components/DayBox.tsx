import { Fragment, useEffect, useState } from "react";
import { toLocaleDateString } from "../utils/common";
import { DayMenu, Weekday } from "../utils/getWeekMenu";
import styles from "./css/DayBox.module.css";

interface IProps {
  dayName: string;
  menu?: DayMenu;
  date?: Date;
  isToday?: boolean;
}

export default function DayBox(props: IProps) {
  const [date, setDate] = useState("...");

  useEffect(() => {
    if (props.date) {
      setDate(toLocaleDateString(props.date))
    } else if (props.menu?.date) {
      setDate(toLocaleDateString(new Date(props.menu.date)))
    }
  }, [props.menu?.date, props.date])

  return (
    <div className={styles.container + " " + (props.isToday ? styles.today : "")}>
      <h2 className={styles.dayName}>{props.dayName}</h2>
      <div className={styles.break}></div>
      <div className={styles.box}>
        <p className={styles.date}>{date}</p>
        <ul className={styles.menuList}>
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
                            {name}
                            {diets.isLactoseFree ? <Diet longName="Laktoositon">L</Diet> : <></>}
                            {diets.isDairyFree ? <Diet longName="Maidoton">M</Diet> : <></>}
                            {diets.isGlutenFree ? <Diet longName="Gluteeniton">G</Diet> : <></>}
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
      </div>
    </div>
  )
}

export function Diet(props: { children: string, longName?: string }) {
  return (
    <span className={styles.diet} style={{cursor: props.longName ? "pointer" : "default"}}>
      {props.children}
      {props.longName ? <div className={styles.dietTooltip}>{props.longName}</div> : <></>}
    </span>
  )
}