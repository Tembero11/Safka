<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Theme } from "../types";
	import { getSystemPreferenceTheme, systemPreferenceTheme } from "$lib/themes";

    export let previewUrl: string;
    export let isSelected: boolean;
    export let representsSystemPreference = false;
    export let name: string;

    const dispatch = createEventDispatcher();
</script>

<div class="container" 
    on:click={() => dispatch("select")} 
    on:keypress={() => dispatch("select")} 
    tabindex=0 
    role="button">
        <div style={`background-image: url(${previewUrl}); border-width: ${isSelected ? "5px" : "0"}`} class="preview" />
        <div class="names">
            <span>{name}</span>
            {#if representsSystemPreference}
                <span id="system-preference-suffix">
                    ({$systemPreferenceTheme === "dark" ? "Tumma" : "Vaalea"})
                </span>
            {/if}
        </div>
       </div>

<style lang="scss">
    .container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        min-width: 180px;
        max-width: 180px;
        background-color: var(--on-secondary);
        color: var(--on-surface);
        border-radius: 10px;
        transition: background-color .12s;

        .names {
            text-align: center;
        }

        #system-preference-suffix {
            font-weight: bold;
            opacity: 0.75;
        }
    }

    .preview {
        position: relative;
        width: 100%;
        height: 128px;
        border-radius: 10px;
        box-sizing: border-box;
        background-size: cover;
        overflow: hidden;
        border-width: 0;
        border-style: solid;
        border-color: var(--primary);
        transition: border 50ms;
    }
</style>