import { getTodaysIndex } from "$lib/utils";
import { fetchFoods } from "../lib/fetchFoods";
import { ApiUrl } from "../types";

export async function load() {
	const todayIndex = getTodaysIndex();
	return {
		foods: await fetchFoods(ApiUrl.v3, todayIndex),
		todayIndex
	}
}