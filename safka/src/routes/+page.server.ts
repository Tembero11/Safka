import { fetchFoods } from "../lib/fetchFoods";
import { ApiUrl } from "../types";

export async function load() {
	return {
		foods: await fetchFoods(ApiUrl.v3)
	}
}