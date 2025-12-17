<template>
    <header>
    
    </header>
    <main>
        <div>
<<<<<<< HEAD
            <h1>You are creating a new game!</h1>
        </div>
        <div class="select-Language">
            <p>
                <label for="lang">Language</label><br>

                <input type="radio" id="svenska" v-model="lang" value="Svenska">
                <label for="svenska">Svenska</label><br>

                <input type="radio" id="english" v-model="lang" value="English">
                <label for="english">English</label><br>
            </p>
        </div>
        <div class="select-DrawTime">
            <p>
                <label for="DrawTime">Draw Time</label><br>

                <input type="radio" id="30" v-model="DrawTime" value="Svenska">
                <label for="svenska">Svenska</label><br>

                <input type="radio" id="english" v-model="lang" value="English">
                <label for="english">English</label><br>
            </p>
        </div>
    </main>
=======
            <h1>
                Create New Game
            </h1>

        </div>
    </body>
>>>>>>> main
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
    name: 'CreateNewGameView',
    data: function () {
        return {
            lang: localStorage.getItem("lang") || "en",
            uiLabels: {},
        }
    },
    created: function () {
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);
    },
    methods: {
        createGame: function () {
            socket.emit("createPoll",{pollId: this.pollId, lang: this.lang })
            socket.emit("joinPoll", this.pollId);
        }
    }
}

</script>

<style scoped>
<<<<<<< HEAD
   h1 {
    font-size: 36pt;
   }
=======
body {
    background-color: #AA87BF;
}
>>>>>>> main
</style>