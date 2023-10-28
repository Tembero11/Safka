<script lang="ts">
	import { getTodaysIndex } from "$lib/utils";
	import Cookies from "js-cookie";
	import type { PageData } from "./$types";
	import DayBox from "./DayBox.svelte";
	import DietChip from "./DietChip.svelte";
	import RestaurantSwitcher from "./RestaurantSwitcher.svelte";
	import { ApiUrl, restaurantIdSchema, type IRestaurant, type DayMenu } from "../types";
	import { fetchFoods } from "$lib/apiService";
    import { foods, restaurant } from "../lib/store";

    export let data: PageData;

    const dayNames = [
        "Maanantai",
        "Tiistai",
        "Keskiviikko",
        "Torstai",
        "Perjantai",
        // "Lauantai",
        // "Sunnuntai",
    ];

    async function handleRestaurantSwitch(newRestaurant: IRestaurant) {
        Cookies.set("restaurant", newRestaurant.id.toString());
        restaurant.set(newRestaurant);
        
        const newFoods = await fetchFoods(ApiUrl.v3_Menu, $restaurant.id);
        foods.set(newFoods);

        Cookies.set("restaurant", newRestaurant.id.toString());
    }
</script>

<svelte:head>
    <title>Safka Online</title> 
</svelte:head>

<article id="page">
    <div id="week-with-diets">
        <div id="week">
            {#if !$foods.length}
                <h2>No menus!</h2> 
            {:else}
                {#key $foods}
                {#each $foods as day}
                    <DayBox date={day.date} 
                            menu={day.menu} 
                            dayName={dayNames[day.dayId]} 
                            isToday={getTodaysIndex() === day.dayId}
                        />
                {/each}
                {/key}
            {/if}
        </div>
        <div id="diets">
            <DietChip letter="L" name="Laktoositon"/>
            <DietChip letter="M" name="Maidoton"/>
            <DietChip letter="G" name="Gluteeniton"/>
        </div>
    </div>

    <div id="restaurant-switcher">
        {#if $restaurant && data.availableRestaurants}
            <RestaurantSwitcher 
                on:switch={(e) => handleRestaurantSwitch(e.detail)}
                currentRestaurant={$restaurant.id} 
                restaurants={data.availableRestaurants} />
        {/if}
    </div>
</article>


<style lang="scss">
    #page {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;

        gap: 48px;

        width: 100%;
        height: 100%;

        @media only screen and (max-width: 999px) {
            flex-direction: column-reverse;
        }
    }

    #week-with-diets {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    #diets {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 16px;
    }

    #week {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        gap: 48px;

        @media only screen and (max-width: 999px) {
            flex-wrap: nowrap;
            flex-direction: column;
        }
    }
</style>
