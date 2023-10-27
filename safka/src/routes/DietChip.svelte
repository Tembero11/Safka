<script lang="ts">
    type Letter = "L" | "M" | "G"
    type Name = "Maidoton" | "Gluteeniton" | "Laktoositon"

    export let letter: Letter;
    export let name: Name;
</script>

<span class="diet-chip"><div class="diet-letter"><div>{letter}</div></div> <b>{name}</b></span>

<style lang="scss">
    .diet-chip {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        gap: 8px;
        text-align: center;

        color: var(--on-background-slight);
    }

    .diet-letter {
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        font-weight: bold;
        
        width: 1.2em;
        height: 1.2em;
        border-radius: 50%;

        padding: 0.2em;

        background-color: var(--primary);
        color: var(--on-primary);
    }
</style>