import { fetchFoods, fetchRestaurants } from "../lib/apiService";
import { ApiUrl, restaurantIdSchema, type DayMenu, type IRestaurant } from "../types";
import { error } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";

interface ServerLoadResult {
	foods: DayMenu[] | null;
	restaurant: IRestaurant;
	availableRestaurants: IRestaurant[];
}

export async function load({ cookies }: PageServerLoadEvent): Promise<ServerLoadResult> {
	const restaurantCookie = Number(cookies.get("restaurant"))
	
	const idParseResult = restaurantIdSchema.safeParse(restaurantCookie);

	const availableRestaurants = await fetchRestaurants(ApiUrl.v3_Restaurants);
	// If we can't even get restaurants something is wrong.
	// Just make foods null and effectively give up on showing data on the UI.
	if (!availableRestaurants || !availableRestaurants.length) {
		throw error(500, { message: "Ravintoloiden lataamisessa ilmeni ongelmia. Yritä pian uudelleen." });
	}

	const restaurant = idParseResult.success 
		? availableRestaurants[idParseResult.data] // Indexable since it's guaranteed to have same index
		: availableRestaurants[0]; // Default to first

	const foods = await fetchFoods(ApiUrl.v3_Menu, restaurant.id);
	if (!foods) {
		throw error(404, { message: "Ruokalistojen lataamisessa ilmeni ongelmia. Yritä pian uudelleen." });
	}

	return {
		foods,
		restaurant,
		availableRestaurants,
	}
}