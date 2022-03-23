<script lang="ts">
    import BigNumber from './from2.svelte';
    export let count = 0;
    debugger
    let makeNumber = Number(Math.random().toFixed(3));
</script>
<main>
    <div class="counter">
        <p>Counte: {count}</p>
        <button on:click={() => count++}>+</button>
    </div>
    <BigNumber number={makeNumber}/>
</main>

<style lang="sass">
    @import './style'

    .counter
        border: solid 1px #000
</style>