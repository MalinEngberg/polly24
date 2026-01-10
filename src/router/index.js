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
      path: '/draw/:gamePin?',
      name: 'DrawView',
      component: () => import('../views/DrawView.vue')
    },
    
    {
      path: '/lobby/:gamePin?',
      name: 'LobbyView',
      component: () => import('../views/LobbyView.vue')
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
    }
  ]
})
export default router
