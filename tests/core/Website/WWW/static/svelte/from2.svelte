<script>
    export let number = 0;
    let fountSize = 16;
</script>

<div class="number-color">
    <p on:click={() => fountSize += 2} style="font-size:{fountSize}px">This number: {number}</p>
</div>

<style lang="sass">
@import './styl2'

.number-color
    @include button(16, #c1d5ec)
</style>