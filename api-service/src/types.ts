
export interface IRestaurant {
    id: Restaurant;
    name: string;
    desc: string;
    schoolName: string;
    url: string;
}

export enum Restaurant {
    Safka,
    Amistoteles,
}


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
    restaurantId: Restaurant;
    modifiedTime: Date;
    weekNumber: number;
    days: DayMenu[];
}

export type NoRestaurantWeekMenu = Omit<WeekMenu, "restaurantId">;