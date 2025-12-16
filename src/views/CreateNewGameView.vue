<template>
    <body>
        <div>
            <h1>
                Create New Game
            </h1>

        </div>
    </body>
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
body {
    background-color: #AA87BF;
}
</style>