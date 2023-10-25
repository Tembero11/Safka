<script lang="ts">
	import type { WeekMenu } from "../types";
	import type { PageData } from "./$types";

    /** @type {import('./$types').PageData} */
    export let data: PageData;
    const foods = data.foods;
</script>

{#if !foods}
    <p>No menus!</p> 
{:else}
    <ul>
    {#each foods.days as day }
        <li>{day.menu.map(meal => meal.names.join(",")).join(",")}</li>     
    {/each}
    </ul>
{/if}

<style>
</style>