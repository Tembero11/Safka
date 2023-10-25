import { fetchFoods } from "../lib/fetchFoods";

export async function load() {
	return {
		foods: await fetchFoods()
	};
}