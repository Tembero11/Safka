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
    date: Date;
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

export interface Menus {
    weekMenu: WeekMenu
    dayMenu: DayMenu
}