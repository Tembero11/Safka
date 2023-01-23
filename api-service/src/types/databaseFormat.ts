import { ObjectId } from "mongodb";
import { Weekday } from "../types";

export enum Diet {
    LactoseFree,
    LowLactose,
    EggFree,
    HeartSymbol,
    NutritionRecommendationCompliant,
    LowCarbonFootprint,
    DairyFree,
    GlutenFree,
    Vegan
}

export type StringTime = `${number}:${number}`;

export interface LunchTime { from: StringTime, to: StringTime }

export interface Restaurant {
    _id: ObjectId
    name: string,
    url: string,
    srcUrl: string
    desc: string
    defaultLunchTime?: LunchTime[]
}

export interface RestaurantDay {
    _id: ObjectId
    hash: string,
    date: Date,
    lunchTime?: LunchTime[]
    weekDay: Weekday,
    categories: FoodCategory[]
}

export interface FoodCategory {
    categoryName: string
    menu: CategoryMenu[]
}

export interface CategoryMenu {
    name: string
    price: number,
    diets: Diet
}