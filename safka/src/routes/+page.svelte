<script lang="ts">
	import type { WeekMenu } from "../types";
	import type { PageData } from "./$types";

    /** @type {import('./$types').PageData} */
    export let data: PageData;
    data.foods!.days.forEach(day => console.log(day)) 
</script>

{#if !data.foods}
    <p>No menus!</p> 
{:else}
    <ul>
    {#each data.foods.days as day }
        <li>{day.menu.map(meal => meal.names.join(",")).join(",")}</li>     
    {/each}
    </ul>
{/if}

<style>
</style>