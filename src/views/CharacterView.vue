<template>
    <main id ="CharacterPage">
        <section id = "characterSelect">
            <h1>{{ uiLabels.chooseCharacter }}</h1>
            <br />
            <div class = "switchCharacter">
                <button class = "arrow-button" v-on:click="prevCharacter"><</button>

                <div class = "character-picture">
                    <img class ="character-img" v-bind:src="getCurrentCharacter().img"
                     v-bind:alt="getCurrentCharacter().name"/>
                </div>

                <button class = "arrow-button" v-on:click="nextCharacter">></button>
            </div>

            <br />
            <br />
            <br />

            <button id ="startButton" v-on:click="startGame">
                {{ uiLabels.startButton }}
            </button>
        </section>
    </main>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

class Character {
    constructor(name, img, score, drawer) {
       
        this.name = name;
        this.img = img;
        this.score = score; 
        this.drawer = drawer;
    }
}

export default {
    name: "CharacterSelectView",

    data: function() {
        return {
            characters: [
                new Character("Barbappa", "/img/Barbapappa.png" ,0, false),
                new Character("mnm", "/img/m&m-killen.png",0, false),
                new Character("Bowser", "/img/Bowser.png",0, false),
            ],

            currentIndex: 0,

            lang: localStorage.getItem("lang") || "en",
            pollId: "",
            pollData: {},
            uiLabels: {}
        }
    },

    created: function() {
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "getUILabels", this.lang );
    },

    methods: {
        getCurrentCharacter() {
            return this.characters[this.currentIndex];
        },

        prevCharacter: function() {
            this.currentIndex = (this.currentIndex - 1 + this.characters.length)
            % this.characters.length;
        },

        nextCharacter: function() {
             this.currentIndex = (this.currentIndex + 1) %
             this.characters.length;

        }
    }
}

</script>

<style>
    .switchCharacter {
        grid-gap: 40px;
        display: inline-flex;
        align-items: center;

    }

    .character-picture {
        width: 300px;
        height: 300px;

    }

    .character-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .arrow-button {
        width: 70px;
        height: 70px;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 70px;
        color: silver;
        font-weight: bold;
    }


    #characterSelect {
        margin: 10px;
        font-size: 25px;
    }

    #startButton {
        background-color: #39FF14;
        border: 2px solid #FF1493;
        padding: 20px 90px;
        border-radius: 100px;
        cursor: pointer;
        gap: 10px;
        font-size: 18px;
        display: inline-flex;
        align-items: center;
        gap:10px;
    }
</style>