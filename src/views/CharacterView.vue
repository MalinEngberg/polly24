<template>
    <main id ="CharacterPage">
        <section id = "characterSelect">
            <h1>Choose your character!</h1>
            <br />
            <div class = "switchCharacter">
                <button class = "arrow-button" v-on:click="prevCharacter"></button>

                <div class = "character-picture">
                    <img class ="character-img" v-bind:src="getCurrentCharacter().img"
                     v-bind:alt="getCurrentCharacter().name"/>
                </div>

                <button class = "arrow-button" v-on:click="nextCharacter"></button>
            </div>
            <br />
            <button id ="startButton" v-on:click="startGame">
                Lets start!
            </button>
        </section>
    </main>
</template>

<script>
export default {
    name: "CharacterSelectView",

    data: function() {
        return {
            characters: [
                {name: "Barbapappa", img: "/img/Barbapappa.png"}
            ],

            currentIndex: 0
        }
    },


    methods: {
        getCurrentCharacter() {
            return this.characters[this.currentIndex]
        },

        prevCharacter: function() {
            this.currentIndex = (this.currentIndex - 1)

        },

        nextCharacter: function() {
                    this.currentIndex = (this.currentIndex + 1)

        }
    }
}

</script>

<style>
.switchCharacter {
    display: flex;
    align-items: center;
}
</style>