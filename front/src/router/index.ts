import Vue from 'vue'
import VueRouter, {
  Route,
  RouteConfig,
} from 'vue-router'

/**
 * Default routes
 */
import Home from '@/views/routes/Home.vue'
import Page404 from '@/views/routes/404.vue'

/**
 * Workspace routes
 */
import WorkspaceList from '@/views/routes/workspace/visualization/WorkspaceList.vue'

/**
 * Workspace admin routes
 */
import WorkspaceAdmin from '@/views/routes/workspace/admin/WorkspaceAdmin.vue'
import WorkspaceAdminCMSConfig from '@/views/routes/workspace/admin/cms/CMSConfig.vue'
import DatabaseList from '@/views/routes/workspace/admin/database/DatabaseList.vue'
import DatabaseTable from '@/views/routes/workspace/admin/database/DatabaseTable.vue'
import AclSetListing from '@/views/routes/workspace/admin/acl/AclSetListing.vue'
import DatabaseSchema from '@/views/routes/workspace/admin/database/DatabaseSchema.vue'
import ProcessListing from '@/views/routes/workspace/admin/process/ProcessListing.vue'
import WorkspaceGroupListing from '@/views/routes/workspace/admin/group/WorkspaceGroupListing.vue'
import WorkspaceSettings from '@/views/routes/workspace/admin/settings/WorkspaceSettings.vue'
import WorkspaceAdminCMSPage from '@/views/routes/workspace/admin/cms/Page.vue'

/**
 * Workspace visualization / app / cms routes
 */
import WorkspaceVisualization from '@/views/routes/workspace/visualization/Workspace.vue'
import WorkspaceVisualizationPage from '@/views/routes/workspace/visualization/Page.vue'

/**
 * Admin routes
 */
import Admin from '@/views/routes/admin/Admin.vue'
import UserManagement from '@/views/routes/admin/UserManagement.vue'
import GroupManagement from '@/views/routes/admin/GroupManagement.vue'

/**
 * User routes
 */
import Profile from '@/views/routes/user/Profile.vue'
import LostPassword from '../views/routes/user/LostPassword.vue'
import ResetPassword from '../views/routes/user/ResetPassword.vue'
import VerifySignup from '../views/routes/user/VerifySignup.vue'
import UpdateEmail from '../views/routes/user/UpdateEmail.vue'
import SignUp from '../views/routes/user/SignUp.vue'

import { ROUTES_NAMES, ROUTES_PATH } from './paths'
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
      needGuest: true,
    },
  }, {
    path: ROUTES_PATH.LOSTPASSWORD,
    name: 'LostPassword',
    component: LostPassword,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  }, {
    path: ROUTES_PATH.RESETPASSWORD,
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  },
  {
    path: ROUTES_PATH.VERIFYSIGNUP,
    name: 'VerifySignup',
    component: VerifySignup,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  },
  {
    path: ROUTES_PATH.SIGNUP,
    name: ROUTES_NAMES.SIGNUP,
    component: SignUp,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  }, {
    path: ROUTES_PATH.UPDATEEMAIL,
    name: ROUTES_NAMES.UPDATEEMAIL,
    component: UpdateEmail,
    meta: {
      needHeader: false,
    },
  }, {
    path: ROUTES_PATH.PROFILE,
    name: 'Profile',
    component: Profile,
    meta: {
      needAuthentication: true,
    },
  }, {
    path: ROUTES_PATH.WORKSPACE,
    name: 'WorkspaceList',
    component: WorkspaceList,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: false,
    },
  },
  {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId',
    name: 'Workspace',
    props: true,
    redirect: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
  }, {
    name: 'WorkspaceAdmin',
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN,
    redirect: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.DATABASE,
    component: WorkspaceAdmin,
    props: true,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
    children: [{
      name: 'WorkspaceDatabase',
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.DATABASE,
      props: true,
      component: DatabaseList,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
      children: [
        {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.DATABASETABLE,
          path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.DATABASE + '/:databaseId' + ROUTES_PATH.DATABASETABLE + '/:tableId?',
          component: DatabaseTable,
          props: true,
          meta: {
            needAuthentication: true,
            hasBurgerMenu: true,
          },
        },
        {
          name: ROUTES_NAMES.WORKSPACE_ADMIN.DATABASESCHEMA,
          path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.DATABASE + '/:databaseId' + ROUTES_PATH.DATABASESCHEMA,
          component: DatabaseSchema,
          props: true,
          meta: {
            needAuthentication: true,
            hasBurgerMenu: true,
          },
        },
      ],
    }, {
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.PROCESS,
      name: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS,
      component: ProcessListing,
      props: true,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
      children: [{
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.PROCESS + '/:processId',
        name: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS_DETAIL,
        component: ProcessListing,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
      }],
    }, {
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.ACLSET,
      name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL,
      component: AclSetListing,
      props: true,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
      children: [{
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.ACLSET + '/:aclSetId',
        name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL_DETAIL,
        component: AclSetListing,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
      }],
    }, {
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP,
      name: ROUTES_NAMES.WORKSPACE_ADMIN.GROUP,
      component: WorkspaceGroupListing,
      props: true,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
      children: [{
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP + '/:groupId',
        name: ROUTES_NAMES.WORKSPACE_ADMIN.GROUP_DETAIL,
        component: WorkspaceGroupListing,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
      }],
    }, {
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.SETTINGS,
      name: ROUTES_NAMES.WORKSPACE_ADMIN.SETTINGS,
      component: WorkspaceSettings,
      props: true,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
    }, {
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS,
      name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS,
      component: WorkspaceAdminCMSConfig,
      props: true,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
      children: [{
        name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE_DETAIL,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS + ROUTES_PATH.CMS_PAGE + '/:pageId' + ROUTES_PATH.CMS_PAGE_DETAIL + '/:pageDetailId',
        props: true,
        component: WorkspaceAdminCMSPage,
      }, {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS + ROUTES_PATH.CMS_PAGE + '/:pageId',
        props: true,
        component: WorkspaceAdminCMSPage,
      }],
    }],
  }, {
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    name: 'WorkspaceVisualization',
    component: WorkspaceVisualization,
    props: true,
    children: [{
      name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE_DETAIL,
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION + '/:groupId' + ROUTES_PATH.VISUALIZATION_PAGE + '/:pageId' + ROUTES_PATH.VISUALIZATION_PAGE_DETAIL + '/:pageDetailId',
      props: true,
      component: WorkspaceVisualizationPage,
    }, {
      name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE,
      path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION + '/:groupId' + ROUTES_PATH.VISUALIZATION_PAGE + '/:pageId',
      props: true,
      component: WorkspaceVisualizationPage,
    }],
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
  },
  {
    path: ROUTES_PATH.ADMIN,
    name: 'Administration',
    component: Admin,
    redirect: ROUTES_PATH.ADMIN + ROUTES_PATH.USER,
    props: true,
    children: [{
      name: ROUTES_NAMES.ADMIN.USER,
      path: ROUTES_PATH.ADMIN + ROUTES_PATH.USER,
      component: UserManagement,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
    }, {
      name: ROUTES_NAMES.ADMIN.GROUP,
      path: ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP,
      component: GroupManagement,
      props: true,
      meta: {
        needAuthentication: true,
        hasBurgerMenu: true,
      },
      children: [{
        name: ROUTES_NAMES.ADMIN.GROUP_DETAIL,
        path: ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP + '/:groupId',
        component: GroupManagement,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
      }],
    }],
    meta: {
      needAuthentication: true,
    },
  },
  {
    path: '*',
    name: '404',
    component: Page404,
  },
]

// Issue with compatibility with ts https://github.com/vuejs/vue-router/issues/2252
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrollBehavior = (to: Route, from: Route, savedPosition: any) => {
  // savedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    const position: { selector?: string; offset?: { x: number; y: number } } = {}
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash
      // specify offset of the element
      // position.offset = { y: 100 }
      return position
    }
    // if the returned position is falsy or an empty object,F
    // will retain current scroll position.
    return false
  }
}

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior,
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