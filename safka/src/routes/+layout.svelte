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
	import { ApiUrl } from "../types";
    import externalLink from "../lib/assets/external-link.svg";

    let showPreferences: boolean | null; 
    $: showPreferences = null;
    function openPreferences() {
        showPreferences = true
    } 

    const parseDesc = (unparsedDesc: string) => {
        return unparsedDesc.replaceAll("\n", "<br>");
    }

</script>

<nav>
    <a id="logo" href="/">
        <h1>Safka. <br/> Online</h1>
    </a>
    <button class="material-symbols-rounded" data-type="icon" on:click={openPreferences}>settings</button>
</nav>
<main>
    <p id="restaurant-desc">{@html $page.data.restaurant?.desc ? parseDesc($page.data.restaurant?.desc) : ""}</p>
    <slot/>
</main>
<footer>
    <h3>Links</h3>
    <ul>
        <li>
            <a target="_blank" href="https://github.com/Tembero11/Safka">
                Source Code <img src={externalLink} alt="external-link-icon" />
            </a>
        </li>
        <li>
            <a target="_blank" href={`${ApiUrl.v3_Menu}/${$page.data.restaurant?.id}`}>
                API <img src={externalLink} alt="external-link-icon" />
            </a>
        </li>
        <li>
            <a target="_blank" href={$page.data.restaurant?.url ?? ""}>
                Food Source <img src={externalLink} alt="external-link-icon"/>
            </a>
        </li>
    </ul>
</footer>

<Preferences bind:isOpen={showPreferences}/>


<style lang="scss">
    @use "sass:color";
    @import "../lib/theme-utils.scss";
    @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800;900&family=Montserrat:wght@700&display=swap');

    @include light {
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
        --footer-background: var(--primary);
    }

    @include dark {
        --primary: #fa3a3a;
        --primary-variant: #ca2e2e;
        --on-primary: white;
        --background: #0e0f14;
        --on-background-slight: #cfcfcf;
        --on-background: white;
        --on-background-header: white;
        --surface: #251d22;
        --surface-variant: #282426;
        --on-surface: white;
        --on-surface-header: white;
        --text-selection-foreground: white;
        --text-selection-background: #ff6767;
        --tooltip-background: #4a4a4a;
        --footer-background: linear-gradient(var(--background), rgba(202,46,46, 0.4))
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

        color: var(--on-primary);
        background: var(--footer-background);

        .link-icon {
            display: inline-block;
            background-image: url("../lib/assets/external-link.svg");
            width: 32px;
            height: 32px;
        }

        ul {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: 0;
            margin: 0;

            @media screen and (max-width: 404px) {
                flex-direction: column;
                align-items: center;
            }
        }

        li {
            display: inline-block;
            white-space: nowrap;
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