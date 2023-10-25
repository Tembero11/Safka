<script lang="ts">
    $: isPreferencesOpen = false;
    $: preferencesDisplay = false;
</script>

<div id="preferences-container" data-is-open={isPreferencesOpen}>
    <div id="preferences">

    </div>
</div>


<style lang="scss">
    #preferences-container {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        opacity: 0;
        &[data-is-open=true] {
            opacity: 1;
        }
    }

    #preferences {
        width: 70%;
        height: 70%;

        background-color: var(--background);
    }
</style>