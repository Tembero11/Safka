<script lang="ts">
	import DayBox from "./DayBox.svelte";
	import DietChip from "./DietChip.svelte";
	import Preferences from "./Preferences.svelte";

    export let data;

    const dayNames = [
        "Maanantai",
        "Tiistai",
        "Keskiviikko",
        "Torstai",
        "Perjantai",
        // "Lauantai",
        // "Sunnuntai",
    ];
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
</article>

<Preferences/>


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
