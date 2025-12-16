<template>
  <header>
    <div v-bind:class="['hamburger', { 'close': !hideNav }]" v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="/img/pencil.png">
      Pictionary
      <img src="/img/pencil.png">
    </div>
  </header>
  <ResponsiveNav v-bind:hideNav="hideNav">
    <button v-on:click="switchLanguage">
      {{ uiLabels.changeLanguage }}
    </button>

    <router-link to="/about/">
      {{ uiLabels.about }}
    </router-link>


    <a href="">FAQ</a>
  </ResponsiveNav>
  <h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>

<!-- Det var här man skrev in sitt PollId -->
<div class ="name">
    <router-link to="'/lobby/' + newPollId" id="new-game-link">
      {{ uiLabels.participatePoll }}
    </router-link>
    <br>
    <router-link to="/create-new-game" id="join-link">
      {{ uiLabels.createPoll }}
    </router-link>
  </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true
    }
  },
  created: function () {
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.emit("getUILabels", this.lang);
  },
  methods: {
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
header {
  width: 100%;
  display: grid;
  grid-template-columns: 2em auto;
}

.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 4rem;
  color: White;
  padding-top: 0.2em;
}

.logo img {
  background-color: #AA87BF;
  height: 15rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
}

.hamburger {
  color: white;
  width: 1em;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0.5rem;
  top: 0;
  left: 0;
  height: 2rem;
  cursor: pointer;
  font-size: 1.5rem;
}

.name {
  margin-top: 2rem;
  font-size: 2rem;
}

h1 {
  font-size: 3rem;
  margin-top: 2rem;
}

h2 {
  font-size: 2rem;
  margin-top: 1rem;
}

#new-game-link {
  color: black;
  text-decoration: none;
  padding: 0.01rem 1rem;
  background-color: #ff4dbb;
  border-radius: 7px;
  font-weight: bold;
  line-height: 4rem;
}

#join-link{
  color: black;
  text-decoration: none;
  padding: 0.01rem 1rem;
  background-color: #5795ff;
  border-radius: 7px;
  font-weight: bold;
  line-height: 4rem;
}

label {

}

@media screen and (max-width:150em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger::before {
    content: "☰";
  }

  .close::before {
    content: "✕";
  }

  .hide {
    left: -12em;
  }

}
</style>
