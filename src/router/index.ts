import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '@/views/routes/Home.vue'
import Profile from '@/views/routes/user/Profile.vue'

import Workspace from '@/views/routes/workspace/visualization/Workspace.vue'
import WorkspaceList from '@/views/routes/workspace/visualization/WorkspaceList.vue'
import Page from '@/views/routes/workspace/visualization/Page.vue'
import Database from '@/views/routes/workspace/admin/database/Database.vue'
import DatabaseSchema from '@/views/routes/workspace/admin/database/DatabaseSchema.vue'
import ProcessListing from '@/views/routes/workspace/admin/process/ProcessListing.vue'

import Admin from '@/views/routes/admin/Admin.vue'
import UserManagement from '@/views/routes/admin/UserManagement.vue'
import GroupManagement from '@/views/routes/admin/GroupManagement.vue'

import LostPassword from '../views/routes/user/LostPassword.vue'
import ResetPassword from '../views/routes/user/ResetPassword.vue'
import VerifySignup from '../views/routes/user/VerifySignup.vue'

import Page404 from '@/views/routes/404.vue'

import { ROUTES_PATH } from './paths'
import { authState } from '@/store/auth'
import { appState } from '@/store/app'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: ROUTES_PATH.HOME,
    name: 'Home',
    component: Home,
    meta: {
      needHeader: false,
      needGuest: true
    }
  }, {
    path: ROUTES_PATH.LOSTPASSWORD,
    name: 'LostPassword',
    component: LostPassword,
    meta: {
      needHeader: false,
      needGuest: true
    }
  }, {
    path: ROUTES_PATH.RESETPASSWORD,
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      needHeader: false,
      needGuest: true
    }
  }, {
    path: ROUTES_PATH.VERIFYSIGNUP,
    name: 'VerifySignup',
    component: VerifySignup,
    meta: {
      needHeader: false,
      needGuest: true
    }
  }, {
    path: ROUTES_PATH.PROFILE,
    name: 'Profile',
    component: Profile,
    meta: {
      needAuthentication: true
    }
  }, {
    path: ROUTES_PATH.WORKSPACE,
    name: 'WorkspaceList',
    component: WorkspaceList,
    meta: {
      needAuthentication: true
    }
  }, {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId',
    redirect: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION
  }, {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    name: 'WorkspaceVisualization',
    component: Workspace,
    props: true,
    children: [{
      name: 'Page',
      path: 'page/:pageId',
      props: true,
      component: Page
    }],
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true
    }
  }, {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.DATABASE + '/:databaseId',
    name: 'WorkspaceDatabase',
    component: Database,
    props: true,
    meta: {
      needAuthentication: true
    }
  }, {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.DATABASE + '/:databaseId' + ROUTES_PATH.DATABASESCHEMA,
    name: 'DatabaseSchema',
    component: DatabaseSchema,
    props: true,
    meta: {
      needAuthentication: true
    }
  }, {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.PROCESS,
    name: 'ProcessListing',
    component: ProcessListing,
    props: true,
    meta: {
      needAuthentication: true
    }
  }, {
    path: ROUTES_PATH.ADMIN,
    name: 'Administration',
    component: Admin,
    redirect: ROUTES_PATH.ADMIN + ROUTES_PATH.USERMANAGEMENT,
    children: [{
      name: 'UserManagement',
      path: ROUTES_PATH.ADMIN + ROUTES_PATH.USERMANAGEMENT,
      component: UserManagement,
      meta: {
        needAuthentication: true
      }
    }, {
      name: 'GroupManagement',
      path: ROUTES_PATH.ADMIN + ROUTES_PATH.GROUPMANAGEMENT,
      component: GroupManagement,
      meta: {
        needAuthentication: true
      }
    }],
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true
    }
  },
  {
    path: '*',
    name: '404',
    component: Page404
  }
]

const router = new VueRouter({
  routes
})

/**
 * Check if the route need authentication and the user is authenticated.
 */
export function checkPathAvailable (needAuthentication: boolean, needGuest: boolean, isAuthenticated: boolean) {
  if (needAuthentication && needGuest) throw new Error('Could not check path if you want the user to be authenticated and guest at the same time.')
  if (needAuthentication && !isAuthenticated) return false
  if (needGuest && isAuthenticated) return false
  return true
}

router.beforeEach(function (to, from, next) {
  // To handle children routes (to get meta from parents), Vuejs recommend to use to.matched
  // @see: https://github.com/vuejs/vue-router/issues/704
  const needAuthentication = to.matched.some(m => m.meta.needAuthentication)
  appState.hasBurgerMenu = to.matched.some(m => m.meta.hasBurgerMenu)
  const needGuest = to.matched.some(m => m.meta.needGuest)
  const isAuthenticated = authState.data.isAuthenticated

  if (!checkPathAvailable(needAuthentication, needGuest, isAuthenticated)) {
    next({ path: isAuthenticated ? ROUTES_PATH.WORKSPACE : ROUTES_PATH.HOME })
  } else {
    next()
  }
})

export default router
