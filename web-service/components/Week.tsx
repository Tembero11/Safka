import { Fragment, useEffect, useState } from "react";
import { countForwardFromDay, dayNamesFinnish, getCurrentDayIndex, getDayFromMonday, isSameDate } from "../utils/common";
import getWeekMenu, { DayMenu, Weekday, WeekMenu } from "../utils/getWeekMenu";
import styles from "./css/Week.module.scss";
import DayBox from "./DayBox";

export default function Week(props: { menu: WeekMenu | null }) {
  console.log(props)
  if (!props.menu) {
    return (
      <p className="text-center on-background-slight-color">Ruokalistan lataamisessa ilmeni ongelma. Yritä pian uudelleen.</p>
    )
  }

  const timeframe = [];

  const today = new Date();
  today.setHours(0, 0, 0);
  const todayId = getCurrentDayIndex();


  const apiWeekdayDate = new Date(props.menu.days[todayId].date);
  apiWeekdayDate.setHours(0, 0, 0);

  if (isSameDate(apiWeekdayDate, today)) {
    timeframe.push(...props.menu.days.slice(todayId));
  }else {
    timeframe.push(...countForwardFromDay(today, 7 - todayId));
    timeframe.push(...props.menu.days);
  }

  return (
    <div className={styles["week-container"]}>
      {
        timeframe.slice(0, 6).map((dayMenu, index) => {
          if (dayMenu instanceof Date) {
            if (getDayFromMonday(dayMenu) == Weekday.Saturday || getDayFromMonday(dayMenu) == Weekday.Sunday) {
              return <Fragment key={index}></Fragment>
            }
            return <DayBox key={index} dayName={dayNamesFinnish[getDayFromMonday(dayMenu)]} date={dayMenu} menu={undefined} isToday={
              isSameDate(new Date(dayMenu), today)
            }/>
          }

          if (!dayMenu.hash) return null;
          return <DayBox key={dayMenu.hash} dayName={dayNamesFinnish[dayMenu.dayId]} menu={dayMenu} isToday={
            isSameDate(new Date(dayMenu.date), today)
          } />
        })
      }
    </div>
  )
}