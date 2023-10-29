<script lang="ts">
	import { browser } from "$app/environment";
	import { onDestroy, onMount, setContext } from "svelte";
	import ThemeSelectButton from "./ThemeSelectButton.svelte";
	import { theme } from "$lib/themes";
    import uiLightPreview from "$lib/assets/ui_light.svg";
    import uiDarkPreview from "$lib/assets/ui_dark.svg";
    import uiSystemPreferencePreview from "$lib/assets/ui_system_preference.svg";
	import type { Theme } from "../types";

    export let isOpen: boolean | null;

    $: console.log("prefs", isOpen);

    let containerEl;

    let currentPendingTheme: Theme = $theme;

    function onBgClick(e: any) {
        if (e.target.id == "preferences-container") {
            close();
        }
    }

    function close() {
        isOpen = false;
    }

    function saveAndClose() {
        theme.set(currentPendingTheme);
        close();
    }

    function onKeyUp(e: KeyboardEvent) {
        if (e.key == "Enter") {
            saveAndClose();
        }

        if (e.key == "Escape" || e.key == "Enter") {
            close();
        }
    }

    function handleThemeSelect(newTheme: Theme) {
        currentPendingTheme = newTheme;
    }

    onMount(() => {
        if (!browser) return;

        window.addEventListener("keyup", onKeyUp);
    });

    onDestroy(() => {
        if (!browser) return;

        window.removeEventListener("keyup", onKeyUp);
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="preferences-container" data-is-open={isOpen} bind:this={containerEl} on:click={onBgClick}>
    <form id="preferences">
        <div id="preferences-content">
            <h2>Käyttäjän Asetukset</h2>
            <div class="divider"></div>
            <h3>Teema</h3>
            <p>Mukauta käyttöliittymän ulkonäköä</p>

            <div class="themes">
                <ThemeSelectButton 
                    previewUrl={uiSystemPreferencePreview}
                    name="Järjestelmän oletus"
                    representsSystemPreference={true}
                    isSelected={currentPendingTheme === "os"}
                    on:select={() => handleThemeSelect("os")}
                    />
                <ThemeSelectButton 
                    previewUrl={uiLightPreview}
                    name="Vaalea Teema"
                    isSelected={currentPendingTheme === "light"}
                    on:select={() => handleThemeSelect("light")}
                    />
                <ThemeSelectButton 
                    previewUrl={uiDarkPreview}
                    name="Tumma Teema"
                    isSelected={currentPendingTheme === "dark"}
                    on:select={() => handleThemeSelect("dark")}
                    />
            </div>
        </div>
        <div id="preferences-actions">
            <div id="preferences-shortcuts">
                <span style="display: block; margin-bottom: 8px;">Paina <kbd>Esc</kbd> -näppäintä poistuaksesi tallentamatta.</span>
                <span>Paina <kbd>Enter</kbd> -näppäintä tallentaaksesi.</span>
            </div>
            <div id="preferences-buttons">
                <button data-variant="secondary" on:click={() => close()}>Cancel</button>
                <button data-variant="primary" on:click={() => saveAndClose()} >Save</button>
            </div>
        </div>
    </form>
</div>


<style lang="scss">
    $animation-duration: 150ms;

    h2, h3 {
        margin: 0;
        margin-bottom: 16px;
        color: var(--on-background-header);
    }
    
    p {
        color: var(--on-background-slight);
    }

    #preferences-container {
        display: flex;
        z-index: 999;
        visibility: hidden;
        position: fixed;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        opacity: 0;

        background-color: rgba(0, 0, 0, 0.2);

        &[data-is-open=true] {
            animation: prefs-open $animation-duration ease-in-out 0ms 1 normal forwards;

            #preferences {
                transform: scale(1);
            }
        }

        &[data-is-open=false] {
            animation: prefs-close $animation-duration ease-in-out 0ms 1 normal forwards;

            #preferences {
                transform: scale(0.8);
            }
        }
    }

    #preferences {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        width: 70%;
        height: 70%;

        border-radius: 16px;
        padding: 16px;

        transform: scale(0.8);
        transition: transform 300ms;
        background-color: var(--surface);

        @media only screen and (max-width: 650px) {
            width: 100%;
            height: 100%;
        }
    }

    #preferences-content {
        .themes {
            display: flex;
            gap: 20px;
            flex-direction: row;
        }
        
        overflow: auto;
        flex: 1;
    }

    .divider {
        width: 10em;
        height: 2px;
        margin: 16px 0;
        background-color: var(--surface-variant);
    }

    #preferences-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #preferences-shortcuts span {
        color: var(--on-background-slight);
        visibility: collapse;
        @media (hover: hover) and (pointer: fine) { 
            visibility: visible;
        }

        @media only screen and (min-width: 999px) { 
            visibility: visible;
        }
    }

    kbd {
        font-family: "Lexend", sans-serif;
        background-color: #eee;
        border-radius: 3px;
        border: 1px solid #b4b4b4;
        box-shadow:
            0 1px 1px rgba(0, 0, 0, 0.2),
            0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
        color: #333;
        display: inline-block;
        font-size: 0.85em;
        font-weight: 700;
        line-height: 1;
        padding: 2px 4px;
        white-space: nowrap;
    }

    @keyframes prefs-open {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
            visibility: visible;
        }
    }

    @keyframes prefs-close {
        from {
            opacity: 1;
            visibility: visible;
        }
        to {
            opacity: 0;
        }
    }
    
</style>