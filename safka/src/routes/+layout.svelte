<svelte:head>
    {#if isProduction()}
        <script data-goatcounter={`${import.meta.env.VITE_ANALYTICS_URL}`}
            async src="//gc.zgo.at/count.js"></script>
    {/if}
</svelte:head>

<script lang="ts">
	import { isProduction } from "$lib/utils";
    import { page } from "$app/stores";
	import Preferences from "./Preferences.svelte";

    let showPreferences: boolean | null; 
    $: showPreferences = null;
    function openPreferences() {
        showPreferences = true
    }

</script>

<nav>
    <a id="logo" href="/">
        <h1>Safka. <br/> Online</h1>
    </a>
    <button class="material-symbols-rounded" data-type="icon" on:click={openPreferences}>settings</button>
</nav>
<main>
    <p id="restaurant-desc">{$page.data.restaurant?.desc ?? ""}</p>
    <slot/>
</main>
<footer>
    <h3>Resources</h3>
    <ul>
        <li><a href="/">Source Code <span class="material-symbols-rounded">open_in_new</span></a></li>
        <li><a href={$page.data.restaurant?.name ?? ""}>API <span class="material-symbols-rounded">open_in_new</span></a></li>
    </ul>
</footer>

<Preferences bind:isOpen={showPreferences}/>


<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800;900&family=Montserrat:wght@700&display=swap');
    :global(:root) {
        --primary: #ff3535;
        --primary-variant: #ca2e2e;
        --on-primary: #fff;
        --secondary: #4a4a4a;
        --on-secondary: #fff;
        --background: #f3f3f3;
        --on-background-slight: #6e6e6e;
        --on-background: #000;
        --on-background-header: #262c30;
        --surface: #e9e9e9;
        --surface-variant: #d4d4d4;
        --on-surface: #000;
        --on-surface-header: #262c30;
        --text-selection-foreground: #fff;
        --text-selection-background: #ff6767;
    }

    :global(body) {
        margin: 0;
        
        width: 100%;
        height: 100vh;
        
        font-family: "Lexend", sans-serif;

        background-color: var(--background);
        color: var(--on-background);

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    // Remove margin from all headings
    @for $i from 1 through 6 {
        :global(h#{$i}) {
            margin: 0;
        }
    }

    :global(button) {
        position: relative;
        display: inline-block;
        border: none;
        outline: none;
        cursor: pointer;

        font-family: "Lexend", sans-serif;

        padding: 8px;
        border-radius: 16px;

        background-color: var(--primary);
        color: var(--on-primary);

        &[data-variant=secondary] {
            background-color: var(--secondary);
            color: var(--on-secondary);
        }

        &[data-type=icon] {
            aspect-ratio: 1;

            color: var(--on-background);
            background-color: transparent;

            font-size: 28px;

            width: 2em;
            height: 2em;

            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 100%;

                background-color: rgba(0, 0, 0, 0.1);
                
                transition: 150ms transform;
                transform: scale(0);                
            }

            &:hover::before {
                transform: scale(1);
            }
        }
    }

    #logo {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        text-decoration: none;
        user-select: none;
        margin: 0;

        color: var(--primary);

        h1 {
            font-size: 2em;
            margin: 0;
        }
    }

    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 16px;
    }

    main {
        margin: 0 16px;
        flex: 1;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;

        flex-direction: column;

        margin-top: 16px;
        padding: 16px;
        gap: 16px;
        box-sizing: border-box;

        background-color: var(--primary);
        color: var(--on-primary);

        ul {
            padding: 0;
            margin: 0;
        }

        li {
            display: inline-block;
            list-style-type: none;
            width: fit-content;
            user-select: none;
            cursor: pointer;

            margin: 0 8px;
            padding: 8px;
            border-radius: 8px;

            a {
                text-decoration: none;
                color: var(--on-primary);
            }

            &:hover {
                background-color: var(--primary-variant);
            }
        }
    }
</style>