import { Fragment, useEffect, useState } from "react";
import { countForwardFromDay, dayNamesFinnish, getCurrentDayIndex, getDayFromMonday, isSameDate, isToday } from "../utils/common";
import getWeekMenu, { DayMenu, Weekday, WeekMenu } from "../utils/getWeekMenu";
import styles from "./css/Week.module.css";
import DayBox from "./DayBox";

export default function Week(props: { menu: WeekMenu | null }) {
  const [scroll, setScroll] = useState(0);

  if (!props.menu) {
    return (
      <p>There was an internal server error when trying load the menu. This problem is probably temporary and will be fixed soon!</p>
    )
  }

  function scrollTo(value: number) {
    // TODO: Scroll limit

    setScroll(value);
  }
  
  const todayId = getCurrentDayIndex();
  const todayMenu = props.menu.days[todayId];
  

  const timeframe = props.menu.days;

  return (
    <div className={styles.weekContainer}>
      {/* {
          todayMenu ? (
            <>
              <DayBox dayName={"Tänään"} menu={todayMenu} isToday/>
            </>
          ) : null
        } */}
      
      <div className={styles.weekScroll}>
        <div style={{transform: `translateX(calc(${scroll}px - 50%))`, transition: "200ms"}} className={styles.weekScrollItems}>
        
          {
            timeframe.map(dayMenu => {
              if (dayMenu.hash) {
                return <DayBox key={dayMenu.date} menu={dayMenu} isToday={isToday(new Date(dayMenu.date))} dayName={dayNamesFinnish[dayMenu.dayId]}/>
              }
            })
          }
        </div>
      </div>
      
      <button className={`${styles.scrollControl} material-symbols-outlined`} onClick={() => scrollTo(scroll + 330)}>chevron_left</button>
      <button className={`${styles.scrollControl} material-symbols-outlined`} onClick={() => scrollTo(scroll - 330)}>chevron_right</button>
    </div>
  )
}