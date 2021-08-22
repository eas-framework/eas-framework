<script lang="ts">
    export let me: string = 'is';

    function more() {
        me += ' be more';
    }

</script>

<main>
    <div class="cool">
        <p>{me}</p>
    </div>
    <button on:click={more}>more</button>
</main>

<style>
    .cool {
        font-size: 30px;
    }
</style>