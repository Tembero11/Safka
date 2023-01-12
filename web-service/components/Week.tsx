import { Fragment, useEffect, useState } from "react";
import { countForwardFromDay, dayNamesFinnish, getCurrentDayIndex, getDayFromMonday, isSameDate } from "../utils/common";
import getWeekMenu, { DayMenu, Weekday, WeekMenu } from "../utils/getWeekMenu";
import styles from "./css/Week.module.css";
import DayBox from "./DayBox";

export default function Week(props: { menu: WeekMenu | null }) {
  if (!props.menu) {
    return (
      <p>There was an internal server error when trying load the menu. This problem is probably temporary and will be fixed soon!</p>
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
    <div className={styles.weekContainer}>
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