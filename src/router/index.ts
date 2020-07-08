import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Workspace from '../views/Workspace.vue'
import Profile from '../views/Profile.vue'
import Page from '@/views/Page.vue'

Vue.use(VueRouter)

export const ROUTES_PATH = {
  HOME: '/',
  PROFILE: '/profile',
  WORKSPACE: '/workspace'
}

const routes: Array<RouteConfig> = [
  {
    path: ROUTES_PATH.HOME,
    name: 'Home',
    component: Home
  },
  {
    path: ROUTES_PATH.PROFILE,
    name: 'Profile',
    component: Profile,
    meta: {
      needAuthentication: true
    }
  },
  {
    path: ROUTES_PATH.WORKSPACE,
    name: 'Workspace',
    component: Workspace,
    children: [
      {
        path: 'page/:id',
        props: true,
        component: Page
      }
    ],
    meta: {
      needAuthentication: true
    }
  },
  {
    path: '/workspace/:workspaceId',
    name: 'Workspace',
    component: Workspace,
    props: true,
    meta: {
      needAuthentication: true
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
