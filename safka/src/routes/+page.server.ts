import { fetchFoods, fetchRestaurants } from "../lib/apiService";
import { ApiUrl, restaurantIdSchema, type DayMenu, type IRestaurant } from "../types";
import { error } from "@sveltejs/kit";

interface ServerLoadResult {
	foods: DayMenu[];
	restaurant: IRestaurant;
	availableRestaurants: IRestaurant[];
}

export async function load({ cookies }): Promise<ServerLoadResult> {
	console.log("rerun", new Date())
	const restaurantCookie = Number(cookies.get("restaurant"));
	
	const validCookie = restaurantIdSchema.safeParse(restaurantCookie);

	const availableRestaurants = await fetchRestaurants(ApiUrl.v3_Restaurants);
	if (!availableRestaurants || !availableRestaurants.length) {
		throw error(500, { message: "Ravintoloiden lataamisessa ilmeni ongelmia. Yritä pian uudelleen." });
	}

	const restaurant = validCookie.success 
		? availableRestaurants[validCookie.data] // Indexable since it's guaranteed to have same index
		: availableRestaurants[0]; // Default to first

	const foods = await fetchFoods(ApiUrl.v3_Menu, restaurant.id);
	if (!foods.length) {
		throw error(404, { message: "Ruokalistojen lataamisessa ilmeni ongelmia. Yritä pian uudelleen." });
	}

	return {
		foods,
		restaurant,
		availableRestaurants,
	}
}