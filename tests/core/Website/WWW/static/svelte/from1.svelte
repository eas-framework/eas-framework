<script lang="ts">
    import BigNumber from './from2.svelte';
    import type {counter} from './types';

    export let count = 0;
    let settings: counter = {max: 100, current: count}
    
    $: {
        settings.current = count
    }
    let makeNumber = Number(Math.random().toFixed(3));
</script>
<main>
    <div class="counter">
        <p>Counte: {count}</p>
        <button on:click={() =>  settings.max > count ? count++: null}>+</button>
    </div>
    <BigNumber number={makeNumber}/>
    {JSON.stringify(settings, null, 2)}
</main>

<style lang="sass">
    @import './style'

    .counter
        border: solid 1px #000
</style>