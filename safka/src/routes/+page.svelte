<script>
	import DayBox from "./DayBox.svelte";
	import DietChip from "./DietChip.svelte";

    const dayNames = [
        "Maanantai",
        "Tiistai",
        "Keskiviikko",
        "Torstai",
        "Perjantai",
        // "Lauantai",
        // "Sunnuntai",
    ];
</script>

<svelte:head>
    <title>Safka Online</title> 
</svelte:head>

<article id="page">
    <div id="week">
        {#each dayNames as dayName}
            <DayBox dayName={dayName} isToday={dayName == "Maanantai"}/>
        {/each}
    </div>
    <div id="diets">
        <DietChip letter="L" name="Laktoositon"/>
        <DietChip letter="M" name="Maidoton"/>
        <DietChip letter="G" name="Gluteeniton"/>
    </div>
</article>


<style lang="scss">

    #page {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        gap: 48px;

        width: 100%;
        height: 100%;
    }

    #diets {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 16px;
    }

    #week {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        gap: 32px;

        @media only screen and (max-width: 999px) {
            flex-wrap: nowrap;
            flex-direction: column;
        }
    }

