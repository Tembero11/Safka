<script lang="ts">
	import type { ISODateString, Meal } from "../types";
    import { format, parseISO } from "date-fns";
	import DietChip from "./DietChip.svelte";
	import { formatDate } from "$lib/utils";

    export let date: ISODateString;
    export let menu: Meal[];
    export let dayName: string;
    export let isToday: boolean;

    const formattedDate = formatDate(parseISO(date));
</script>

<div class="container" data-is-today={isToday}>
    <h1 class="day-name">{dayName}</h1>
    <div class="divider"></div>
    <div class="box">
        <p class="date">{formattedDate}</p>
        <ul>
            {#each menu as meal}
                <li>
                    {#each meal.names as name, index}
                        <span>{name}</span>
                        {#if meal.diets[index].isLactoseFree}
                            <DietChip name="Laktoositon" letter="L" />
                        {:else if meal.diets[index].isDairyFree}
                            <DietChip name="Maidoton" letter="M" />
                        {:else if meal.diets[index].isGlutenFree}
                            <DietChip name="Gluteeniton" letter="G" />
                        {/if}
                    {/each}
                </li>
            {/each}
    </div>
</div>


<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;

        width: 300px;
        height: 450px;

        &[data-is-today=true] {
            .box {
                border-color: var(--primary);
            }
        } 
    }

    .day-name {
        color: var(--on-background-header);
    }

    .divider {
        width: calc(100% - 16px * 2);
        height: 1px;

        background-color: var(--surface-variant);
    }

    .box {
        width: 100%;
        flex: 1;
        padding: 8px;
        border-radius: 24px;
        border: 12px solid transparent;
        box-sizing: border-box;
        box-shadow: 17px 17px 32px rgba(0, 0, 0, .145), -17px -17px 32px rgba(0, 0, 0, .035);

        background-color: var(--background);
        color: var(--on-surface);
    }
</style>