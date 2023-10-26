<script lang="ts">
	import { fetchFoods } from "$lib/apiService";
	import { ApiUrl, type restaurantId } from "../types";
	import DayBox from "./DayBox.svelte";
	import DietChip from "./DietChip.svelte";
	import Preferences from "./Preferences.svelte";

    export let data;
    $: foods = data.foods

    const dayNames = [
        "Maanantai",
        "Tiistai",
        "Keskiviikko",
        "Torstai",
        "Perjantai",
        // "Lauantai",
        // "Sunnuntai",
    ];

    async function handleRestaurantSwitch(newRestaurantId: restaurantId) {
        data.foods = await fetchFoods(ApiUrl.v3_Menu, newRestaurantId, data.todayIndex)
    }
</script>

<svelte:head>
    <title>Safka Online</title> 
</svelte:head>

<article id="page">
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

    {#if data.availableRestaurants}
        {#each data.availableRestaurants as restaurant}
            <button style="cursor: pointer;" on:click={() => handleRestaurantSwitch(restaurant.id)}>{restaurant.name}</button>
        {/each}
    {/if}
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

        gap: 32px;

        @media only screen and (max-width: 999px) {
            flex-wrap: nowrap;
            flex-direction: column;
        }
    }
</style>
