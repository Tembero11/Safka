<script lang="ts">
	import type { WeekMenu } from "../types";
	import type { PageData } from "./$types";

    /** @type {import('./$types').PageData} */
    export let data: PageData;
</script>

<ul>
{#each data.foods.days as day }
    <li>{day.menu.map(meal => meal.names.join(",")).join(",")}</li>     
{/each}
</ul>

<style>
</style>