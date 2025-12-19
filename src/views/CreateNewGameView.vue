<template>
    <header>
    
    </header>
    <main>
        <div>
            <h1>{{uiLabels.CreatingNewGame}}</h1>
        </div>
        <div class="Option">
            <p>
                <label for="name">{{uiLabels.nameInsert}}</label><br>

                <input type="text" id="name" v-model="name" required="required" v-bind:placeholder="uiLabels.namePlaceHolder">
            </p>
        </div>
        <div class="Option">
            <p>
                <label for="gamePin">GamePin</label><br>

                <input type="text" id="gamePin" v-model="gamePin" required="required" v-bind:placeholder="uiLabels.gamePinInsert">
            </p>
        </div>
        <div class="Option">
            <p>
                <label for="language">{{uiLabels.LanguageOption}}</label><br>

                <input type="radio" id="svenska" v-model="language" value="Svenska">
                <label for="svenska">Svenska</label><br>

                <input type="radio" id="english" v-model="language" value="English">
                <label for="english">English</label><br>
            </p>
        </div>
        <div class="Option">
            <p>
                <label for="DrawTime">{{uiLabels.DrawTimeOption}}</label><br>

                <input type="radio" id="30" v-model="DrawTime" value="30s">
                <label for="30s">30s</label><br>

                <input type="radio" id="45" v-model="DrawTime" value="45s">
                <label for="45s">45s</label><br>

                <input type="radio" id="60" v-model="DrawTime" value="60s">
                <label for="60s">60s</label><br>
            </p>
        </div>
        <div class="Option">
            <p>
                <label for="Rounds">{{uiLabels.RoundsOption}}</label><br>

                <input type="radio" id="2rounds" v-model="Rounds" value="2rounds">
                <label for="2rounds">2</label><br>

                <input type="radio" id="3rounds" v-model="Rounds" value="3rounds">
                <label for="3rounds">3</label><br>

                <input type="radio" id="5rounds" v-model="Rounds" value="5rounds">
                <label for="5rounds">5</label><br>
            </p>
        </div>
    </main>
    <button type="button" v-on:click="createGame">
        {{this.uiLabels.CreateGameButton}}
        <router-link to="/lobby" id="createGame">
        {{ uiLabels.createGame }}
        </router-link>
    </button>
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
            joined: true
        }
    },
    created: function () {
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);
    },
    methods: {
        createGame: function () {
            localStorage.setItem("userName", this.name);
            socket.emit("createGame",{gamePin: this.gamePin, lang: this.lang })
            socket.emit("participateInGame", {gamePin: this.gamePin, name: this.name, joined: this.joined});
            this.$router.push('/lobby/' + this.gamePin);
        }
    }
}
</script>

<style scoped>
   h1 {
    font-size: 36pt;
   }
</style>