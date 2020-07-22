import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Workspace from '../views/Workspace.vue'
import WorkspaceList from '../views/WorkspaceList.vue'
import Profile from '../views/Profile.vue'
import Page from '@/views/Page.vue'
import { ROUTES_PATH } from './paths'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: ROUTES_PATH.HOME,
    name: 'Home',
    component: Home,
    meta: {
      needHeader: false
    }
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
    name: 'WorkspaceList',
    component: WorkspaceList,
    meta: {
      needAuthentication: true
    }
  },
  {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId',
    name: 'Workspace',
    component: Workspace,
    props: true,
    children: [
      {
        path: 'page/:pageId',
        props: true,
        component: Page
      }
    ],
    meta: {
      needAuthentication: true
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
