<script lang="ts">
	import { browser } from "$app/environment";
	import { fetchFoods } from "$lib/apiService";
	import { ApiUrl, type IRestaurant, type restaurantId } from "../types";
	import DayBox from "./DayBox.svelte";
	import DietChip from "./DietChip.svelte";
	import Preferences from "./Preferences.svelte";
	import RestaurantSwitcher from "./RestaurantSwitcher.svelte";

    export let data;
    let currentRestaurant = data.restaurant;

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
        if (browser) {
            data.foods = await fetchFoods(ApiUrl.v3_Menu, newRestaurant.id, data.todayIndex)
            currentRestaurant = newRestaurant;

            document.cookie = `restaurant=${newRestaurant.id};samesite=strict`
        }
    }
</script>

<svelte:head>
    <title>Safka Online</title> 
</svelte:head>

<article id="page">
    <div id="week-with-diets">
        <div id="week">
            {#if !data.foods}
                <h2>No menus!</h2> 
            {:else}
                {#each data.foods.days as day}
                    <DayBox date={day.date} 
                            menu={day.menu} 
                            dayName={dayNames[day.dayId]} 
                            isToday={data.todayIndex === day.dayId}
                        />
                {/each}
            {/if}
        </div>
        <div id="diets">
            <DietChip letter="L" name="Laktoositon"/>
            <DietChip letter="M" name="Maidoton"/>
            <DietChip letter="G" name="Gluteeniton"/>
        </div>
    </div>

    <div id="restaurant-switcher">
        {#if currentRestaurant && data.availableRestaurants}
            {#key currentRestaurant}
                <RestaurantSwitcher on:change={(e) => handleRestaurantSwitch(e.detail)} currentRestaurant={currentRestaurant.id} restaurants={data.availableRestaurants} />
            {/key}
        {/if}
    </div>
</article>


<style lang="scss">
    #page {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        gap: 48px;

        width: 100%;
        height: 100%;

        @media only screen and (max-width: 433px) {
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

        @media only screen and (max-width: 999px) {
            flex-wrap: nowrap;
            flex-direction: column;
        }
    }
</style>
