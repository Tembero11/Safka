import { Fragment, useEffect, useState } from "react";
import { toLocaleDateString } from "../utils/common";
import { DayMenu } from "../utils/getWeekMenu";
import styles from "./css/DayBox.module.scss";
import DietChip from "./DietChip";

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
                            {index > 0 ? <>{" "}</> : null}
                            <span>{name}</span>
                            {diets.isLactoseFree ? <>{" "}<DietChip longName="Laktoositon">L</DietChip></> : <></>}
                            {diets.isDairyFree ? <>{" "}<DietChip longName="Maidoton">M</DietChip></> : <></>}
                            {diets.isGlutenFree ? <>{" "}<DietChip longName="Gluteeniton">G</DietChip></> : <></>}
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

