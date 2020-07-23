import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Workspace from '../views/Workspace.vue'
import WorkspaceList from '../views/WorkspaceList.vue'
import Profile from '../views/Profile.vue'
import Page from '@/views/Page.vue'
import { ROUTES_PATH } from './paths'
import { authState } from '@/store/auth'

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

/**
 * Check if the route need authentication and the user is authenticated.
 */ 
export function checkPathAvailable (needAuthentication: boolean, isAuthenticated: boolean) {
  if (needAuthentication && !isAuthenticated) return false
  return true
}

router.beforeEach(function (to, from, next) {
  // To handle children routes (to get meta frrom parents), Vuejs recommende to use to.matched
  // @see: https://github.com/vuejs/vue-router/issues/704
  const needAuthentication = to.matched.some(m => m.meta.needAuthentication)
  const isAuthenticated = authState.data.isAuthenticated
  if (!checkPathAvailable(needAuthentication, isAuthenticated)) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
