<template>
    <header>
        <h1>
            Resultat
        </h1>
    </header>
    <section id="winnerSection">
        <h2>Winners!</h2>
        <div class="winners">
            <winner v-for="winner in
    <footer>
        <router-link to="/" id="start-over-link">
            Start over...
        </router-link>
        <br></br>
        <router-link to="/" id="exit-link">
            Exit game...
        </router-link>
    </footer>
</template>

<script>
export default {
    name: 'ScoreBoard',
    components: {
    },
    data: function () {
        return {
        }
        Players: [

        ]

    }
}



</script>


<style>
h1 {
    text-transform: uppercase;
    color: rgb(66, 22, 107);
    font-size: 3rem;
}

footer {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    font-size: 2rem
}
#start-over-link {
    color: rgb(66, 22, 107);
    text-decoration: none;
    padding: 0.01rem 0.8rem;
    background-color: rgb(143, 255, 143);
    border-radius: 7px;
    font-weight: bold;
}

#exit-link {
    color: rgb(66, 22, 107);
    text-decoration: none;
    padding: 0.01rem 1rem;
    background-color: #e2adff;
    border-radius: 7px;
    font-weight: bold;
}

</style>
