import { createRouter, createWebHistory } from 'vue-router'
import PokemonView from '../views/PokemonView.vue';
import DetailsView from '../views/DetailsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PokemonView
    },
    {
      path: '/moreInfo/:id',
      name: 'moreInfo',
      component: DetailsView
    },
  ]
})

export default router
