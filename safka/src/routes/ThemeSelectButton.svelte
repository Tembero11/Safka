<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { Theme } from "../types";

    export let previewUrl: string;
    export let isSelected: boolean;
    export let name: string;

    const dispatch = createEventDispatcher();
</script>

<div class="container" 
    on:click={() => dispatch("select")} 
    on:keypress={() => dispatch("select")} 
    tabindex=0 
    role="button">
        <div style={`background-image: url(${previewUrl}); border-width: ${isSelected ? "5px" : "0"}`} class="preview" />
        <span>{name}</span>
</div>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        text-align: center;
        gap: 10px;
        min-width: 180px;
        max-width: 180px;
        background-color: var(--surface);
        color: var(--on-surface);
        user-select: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 120ms;
        padding: 10px;
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