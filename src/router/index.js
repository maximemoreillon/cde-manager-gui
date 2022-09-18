import Vue from 'vue'
import VueRouter from 'vue-router'
import Environments from '../views/Environments.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/environments',
    alias: '/',
    name: 'environments',
    component: Environments
  },
  {
    path: '/environments/:_id',
    name: 'environment',
    component: () => import('../views/Environment.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
