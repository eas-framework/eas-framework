<script lang="ts">
    import Copy from './copy.svelte'
    export let me: string = 'is';

    function more() {
        me += ' be more';
    }

</script>

<main>
    <div class="cool">
        <p>{me}</p>
        <Copy word={me}/>
    </div>
    <button on:click={more}>more</button>
</main>

<style>
    .cool {
        font-size: 30px;
    }
</style>