<script lang="ts">
	import type { IRestaurant, restaurantId } from "../types";
    import { createEventDispatcher } from 'svelte'

    export let restaurants: IRestaurant[];
    export let currentRestaurant: restaurantId;

    const dispatch = createEventDispatcher<{switch: IRestaurant}>();

    const restaurantWidth = 118;
    const padding = 8;
    const selectionLeft = restaurantWidth + padding;
</script>

<div class="container">
    <div class="selection" style={`left: ${selectionLeft * currentRestaurant}px`}></div>
    {#each restaurants as restaurant}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => dispatch("switch", restaurant)} data-selected={restaurant.id == currentRestaurant}>
            <span>{restaurant.name}</span>
        </div>
    {/each}
</div>

<style lang="scss">    


    .container {
        $selection-width: 118px;
        $padding: 8px;

        position: relative;
        display: flex;
        background-color: var(--surface);
        padding: $padding;
        border-radius: 100px;
        overflow: hidden;


        div {
            width: $selection-width;
            z-index: 2;
            cursor: pointer;
            user-select: none;
            text-align: center;

            span {
                color: var(--on-surface);
                transition: 100ms color;
            }

            &[data-selected="true"] {
                span {
                    color: var(--on-primary);
                }
            }
        }

        .selection {
            position: absolute;
            background-color: black;
            top: 0;
            left: 0;
            width: $selection-width + $padding;
            border-radius: 8px;
            height: 100%;
            z-index: 1;
            background-color: var(--primary);
            transition: 160ms left ease-in;
        }
    }
</style>
