<script lang="ts">
    import { page } from '$app/stores';
</script>

<div id="page">
    <h2>{$page.error?.message}</h2>
</div>

<style lang="scss">
    #page {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content:  center;
    }
</style>