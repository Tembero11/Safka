import { IRestaurant } from "../components/RestaurantSwitch";
import { DefaultApiResponse } from "./common";

type RestaurantsApiResponse = DefaultApiResponse & { restaurants: IRestaurant[] }

export default async function getRestaurants() {
    const hostname = process.env.API_URL || "https://api.safka.online/v2";
  
    const url = `${hostname}/restaurants`;
    const resp = await fetch(url, {
      method: "get"
    });
  
    const body = await resp.json() as DefaultApiResponse;
  
    if (resp.ok && body.ok) {
      return body as RestaurantsApiResponse;
    }
    throw new Error("Could not load restaurants");
}