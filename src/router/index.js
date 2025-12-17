import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },

    {
      path: '/draw/',
      name: 'DrawView',
      component: () => import('../views/DrawView.vue')
    },

    
    {
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/lobby',
      name: 'LobbyView',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/result/',
      // erased :id from the path, before = /result/:id
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/character',
      name: 'CharacterView',
     component: () => import('../views/CharacterView.vue')
    },
    {
      path: '/create-new-game',
      name: 'CreateNewGameView',
      component: () => import('../views/CreateNewGameView.vue')
    },

    {
      path: '/about/',
      name: 'AboutUsView',
      component: () => import('../views/AboutUsView.vue')
    },
    {
      path: '/scoreboard/',
      name: 'ScoreBoardView',
      component: () => import('../views/ScoreBoardView.vue')
    }
    //,
    //{
     // path: '/game/:character',
     // name: 'GamePage',
     // component: GamePage
    //}
  ]
})
export default router
