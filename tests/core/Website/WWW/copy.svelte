<script>
    export let word = 'cool';

</script>

<div class="copy-color">
    <p>text {word}</p>
</div>

<style lang="sass">
    @import '/style.sass'

    b 
        color: #13b8c4
    
    .copy-color 
        color: rgb(19, 184, 196)
    
</style>