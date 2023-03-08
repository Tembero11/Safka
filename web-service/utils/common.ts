import { Weekday } from "./getWeekMenu";

export function isProduction() {
    if (process.env.NODE_ENV !== "development") return true
    return false
}

export function getDayFromMonday(date: Date) {
  return [6, 0, 1, 2, 3, 4, 5][date.getDay()];
}

export function getCurrentDayIndex() {
  return getDayFromMonday(new Date());
}

export function isSameDate(aDate: Date, bDate: Date) {
  return aDate.toLocaleDateString() == bDate.toLocaleDateString();
}


export const dayNamesFinnish = [
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
  "Lauantai",
  "Sunnuntai"
]

export function addDaysToDate(date: Date, days: number) {
  var date = new Date(date);
  date.setDate(date.getDate() + days);
  return date;
}


export function countForwardFromDay(from: Date, amount: number = 7): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < amount; i++) {
    days.push(addDaysToDate(from, i));
  }
  return days;
}


export function toLocaleDateString(date: Date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
