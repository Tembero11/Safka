export enum ApiUrl {
	v2 = "http://localhost:5000/api/v2/menu",
	v3 = "http://localhost:5000/api/v3/menu"
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
	version: number;
	// If the day has no menu the hash will be null
	hash: string | null;
	dayId: Weekday;
	date: Date;
	menu: Meal[];
}

export interface WeekData {
    weekNumber: number;
    year: number;
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
    _id: string;
    version: number;
    hash: string | null;
    week: WeekData;
    date: Date;
    dayId: Weekday;
    days: DayMenu[];
}


type DefaultApiResponse = {
	httpCode: number;
	msg: string;
	ok: boolean;
};

export type WeekMenuResponse = WeekMenu & DefaultApiResponse;