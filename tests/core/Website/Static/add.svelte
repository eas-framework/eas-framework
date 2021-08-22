<script lang="ts">
    let me: string;

    me = "cool";

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