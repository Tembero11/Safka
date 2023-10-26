<script lang="ts">
	import { browser } from "$app/environment";
	import { onDestroy, onMount } from "svelte";

    export let isOpen: boolean | null;

    $: console.log("prefs", isOpen);

    let containerEl;

    function onBgClick(e: any) {
        if (e.target.id == "preferences-container") {
            close();
        }
    }

    function close() {
        isOpen = false;
    }

    function onKeyUp(e: KeyboardEvent) {
        if (e.key == "Escape") close();
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
    <div id="preferences">
        <h1>This is preferences text</h1>
    </div>
</div>


<style lang="scss">
    $animation-duration: 150ms;

    #preferences-container {
        display: flex;
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
        width: 70%;
        height: 70%;
        transform: scale(0.8);
        transition: transform 300ms;
        background-color: var(--background);
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