export interface Food {
  name: string;
  isLactoseFree: boolean;
  isDairyFree: boolean;
  isGlutenFree: boolean;
}



export interface DayMenu {
  // If the day has no menu the hash will be null
  hash: string | null;
  dayId: Weekday;
  date: string;
  menu: Food[];
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
  const resp = await fetch(`https://api.safka.online/v1/menu/`, {
    method: "get"
  });

  const body = await resp.json() as DefaultApiResponse;

  if (resp.ok && body.ok) {
      return body as WeekMenuResponse;
  }
  throw new Error("Could not load WeekMenu")
}