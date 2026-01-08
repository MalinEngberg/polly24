<template>
    <header>
        <div class="title">
            <h1>{{ uiLabels.CreatingNewGame }}</h1>
        </div>
        <button id="language-button" v-on:click="switchLanguage">
            {{ uiLabels.changeLanguage }}
        </button>
    </header>
    <div class="page">
        <main class="gridContainer">
            <label class="label" for="name">{{ uiLabels.nameInsert }}</label>
            <div class="option">
                <input type="text" id="name" v-model="name" required="required"
                    v-bind:placeholder="uiLabels.namePlaceHolder">
            </div>
            <p v-if="nameError" class="error">{{ nameError }}</p>

            <label class="label" for="gamePin">GamePin</label>
            <div class="option">
                <input type="text" id="gamePin" v-model="gamePin" required="required"
                    v-bind:placeholder="uiLabels.GamePinInsert">
            </div>
            <p v-if="gamePinError" class="error">{{ gamePinError }}</p>

            <label class="label" for="language">{{ uiLabels.LanguageOption }}</label>
            <div class="option">
                <label class="choice"><span>Svenska</span>
                    <input type="radio" id="svenska" v-model="language" value="Svenska">
                </label>

                <label class="choice"><span>English</span>
                    <input type="radio" id="english" v-model="language" value="English">
                </label>
            </div>

            <label class="label" for="DrawTime">{{ uiLabels.DrawTimeOption }}</label>
            <div class="option">
                <label class="choice"><span>30s</span>
                    <input type="radio" id="30" v-model="DrawTime" value="30s">
                </label>

                <label class="choice"><span>45s</span>
                    <input type="radio" id="45" v-model="DrawTime" value="45s">
                </label>

                <label class="choice"><span>60s</span>
                    <input type="radio" id="60" v-model="DrawTime" value="60s">
                </label>
            </div>

            <label class="label" for="Rounds">{{ uiLabels.RoundsOption }}</label>
            <div class="option">
                <label class="choice"><span>2</span>
                    <input type="radio" id="2rounds" v-model="Rounds" value="2rounds">
                </label>

                <label class="choice"><span>3</span>
                    <input type="radio" id="3rounds" v-model="Rounds" value="3rounds">
                </label>

                <label class="choice"><span>5</span>
                    <input type="radio" id="5rounds" v-model="Rounds" value="5rounds">
                </label>
            </div>
        </main>

        <button type="button" v-on:click="createGame">
            {{ uiLabels.CreateGameButton }}
        </button>
    </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("serverIP"));

export default {
    name: 'CreateNewGameView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            uiLabels: {},
            language: 'English',
            name: '',
            DrawTime: '60s',
            Rounds: '3rounds',
            gamePin: '',
            //joined: true,
            nameError: '',
            gamePinError: '',
            socketId: socket.id
        }
    },
    created: function () {
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);
    },
    methods: {
        createGame: function () {
            this.nameError = "";
            this.gamePinError = "";

            if (!this.name) {
                this.nameError = this.uiLabels.nameError;
                return;
            }
            if (!this.gamePin) {
                this.gamePinError = this.uiLabels.gamePinError;
                return;
            }
            if (this.nameError || this.gamePinError) return;

            socket.emit("createGame", { gamePin: this.gamePin, lang: this.lang })
            socket.emit("joinGame", { gamePin: this.gamePin });
            socket.emit("participateInGame", { gamePin: this.gamePin, name: this.name, joined: this.joined });
            this.$router.push({
                path: `/lobby/${this.gamePin}`,
                query: { name: this.name }
            });
        },

        switchLanguage: function () {
            if (this.lang === "en") {
                this.lang = "sv"
            }
            else {
                this.lang = "en"
            }
            localStorage.setItem("lang", this.lang);
            socket.emit("getUILabels", this.lang);
        },
        toggleNav: function () {
            this.hideNav = !this.hideNav;
        }
    }
}
</script>

<style scoped>
.page {
    min-height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.gridContainer {
    width: 70%;
    margin: 20px;
    display: grid;
    grid-template-columns: auto auto;
    row-gap: 30px;
    column-gap: 100px;
    align-items: center;
    justify-content: center;
}

.title {
    font-size: 2.2rem;
}

.label {
    display: inline-block;
    background-color: #ff4dbb;
    color: black;
    border: 1px solid black;
    padding: 10px 30px;
    border-radius: 999px;
    font-size: 1.7rem;
    font-weight: bold;
    grid-column: 1;
}

.option {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    grid-column: 2;
}

.choice {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.choice span {
    margin: 20px;
    margin-bottom: 5px;
}

.option input {
    padding: 6px 10px;
    font-size: 1rem;
    border: 1.5px solid black;
}

button {
    border-radius: 999px;
    padding: 30px 60px;
    background-color: #39FF14;
    font-size: 1.8rem;
    font-weight: bold;
    font-family: 'Caveat', cursive;
    border: 2px solid black;
    cursor: pointer;
    margin: 40px;
}

.error {
    color: red;
    font-weight: bold;
    font-family: "Times New Roman";
    font-size: 1rem;
    grid-column: 2 / span 1;
    text-align: left;
    margin-top: -30px;
    margin-bottom: 0px;
}

#language-button {
    position: absolute;
    top: 1rem;
    right: 1rem;  

    color: black;
    text-decoration: none;
    padding: 0.25rem 1rem;
    background-color: rgb(224, 151, 255);
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: bold;
    line-height: 2rem;
}
</style>