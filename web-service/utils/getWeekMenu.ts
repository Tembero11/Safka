export interface DietaryRestrictions {
  isLactoseFree: boolean;
  isDairyFree: boolean;
  isGlutenFree: boolean;
}
export interface Meal {
  names: string[];
  diets: DietaryRestrictions[];
}

export interface DayMenu {
  // If the day has no menu the hash will be null
  hash: string | null;
  dayId: Weekday;
  date: Date;
  menu: Meal[];
}

export enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

export interface WeekMenu {
  modifiedTime: Date;
  weekNumber: number;
  days: DayMenu[];
}

type DefaultApiResponse = {
  httpCode: number
  msg: string
  ok: boolean
}

type WeekMenuResponse = WeekMenu & DefaultApiResponse;


export default async function getWeekMenu() {
  const url = process.env.API_URL || "https://api.safka.online/v1/menu/";
  console.log(url)
  const resp = await fetch(url, {
    method: "get"
  });

  const body = await resp.json() as DefaultApiResponse;

  if (resp.ok && body.ok) {
    return body as WeekMenuResponse;
  }
  throw new Error("Could not load WeekMenu")
}