import { getTodaysIndex } from "$lib/utils";
import { fetchFoods, fetchRestaurants } from "../lib/apiService";
import { ApiUrl, restaurantIdSchema } from "../types";
import type { PageServerLoadEvent } from "./$types";

export async function load({ cookies }: PageServerLoadEvent) {
	const restaurantCookie = Number(cookies.get("restaurant"))
	
	const idParseResult = restaurantIdSchema.safeParse(restaurantCookie);

	const availableRestaurants = await fetchRestaurants(ApiUrl.v3_Restaurants);
	// If we can't even get restaurants something is wrong.
	// Just make foods null and effectively give up on showing data on the UI.
	if (!availableRestaurants) {
		return { foods: null }
	}

	const restaurant = idParseResult.success 
		? availableRestaurants[idParseResult.data] // Indexable since it's guaranteed to have same index
		: availableRestaurants[0]; // Default to first

	const todayIndex = getTodaysIndex();
	return {
		foods: await fetchFoods(ApiUrl.v3_Menu, restaurant.id),
		restaurant,
		availableRestaurants,
		todayIndex
	}
}