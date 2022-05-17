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
import WorkspaceFiles from '@/views/routes/workspace/admin/files/WorkspaceFiles.vue'
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
import { USER_PROFILE } from '@locokit/lck-glossary'
import { GROUP_ROLE } from '@locokit/lck-glossary/src'
import { LckGroup } from '@/services/lck-api/definitions'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    name: ROUTES_NAMES.HOME,
    path: ROUTES_PATH.HOME,
    component: Home,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  },
  {
    name: ROUTES_NAMES.LOSTPASSWORD,
    path: ROUTES_PATH.LOSTPASSWORD,
    component: LostPassword,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  },
  {
    name: ROUTES_NAMES.RESETPASSWORD,
    path: ROUTES_PATH.RESETPASSWORD,
    component: ResetPassword,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  },
  {
    name: ROUTES_NAMES.VERIFYSIGNUP,
    path: ROUTES_PATH.VERIFYSIGNUP,
    component: VerifySignup,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  },
  {
    name: ROUTES_NAMES.SIGNUP,
    path: ROUTES_PATH.SIGNUP,
    component: SignUp,
    meta: {
      needHeader: false,
      needGuest: true,
    },
  },
  {
    name: ROUTES_NAMES.UPDATEEMAIL,
    path: ROUTES_PATH.UPDATEEMAIL,
    component: UpdateEmail,
    meta: {
      needHeader: false,
    },
  },
  {
    name: ROUTES_NAMES.PROFILE,
    path: ROUTES_PATH.PROFILE,
    component: Profile,
    meta: {
      needAuthentication: true,
    },
  },
  {
    name: ROUTES_NAMES.WORKSPACELIST,
    path: ROUTES_PATH.WORKSPACE,
    component: WorkspaceList,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: false,
    },
  },
  {
    name: ROUTES_NAMES.WORKSPACE,
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId',
    props: true,
    redirect: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
  },
  {
    name: ROUTES_NAMES.WORKSPACE_ADMIN.SELF,
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN,
    redirect: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.DATABASE,
    component: WorkspaceAdmin,
    props: true,
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
      authorizedRoles: [GROUP_ROLE.ADMIN, GROUP_ROLE.OWNER],
    },
    children: [
      {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.DATABASE,
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
      },
      {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.PROCESS,
        component: ProcessListing,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
        children: [
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS_DETAIL,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.PROCESS + '/:processId',
            component: ProcessListing,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.PROCESS_ADD,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.PROCESS + '/add',
            component: ProcessListing,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
        ],
      },
      {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.ACLSET,
        component: AclSetListing,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
        children: [
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL_DETAIL,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.ACLSET + '/:aclSetId',
            component: AclSetListing,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.ACL_ADD,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.ACLSET + '/add',
            component: AclSetListing,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
        ],
      },
      {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.GROUP,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP,
        component: WorkspaceGroupListing,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
        children: [
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.GROUP_DETAIL,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP + '/:groupId',
            component: WorkspaceGroupListing,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.GROUP_ADD,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP + '/add',
            component: WorkspaceGroupListing,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
        ],
      },
      {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.SETTINGS,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.SETTINGS,
        component: WorkspaceSettings,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
      },
      {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.FILES,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.FILES,
        component: WorkspaceFiles,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
      },
      {
        name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS,
        component: WorkspaceAdminCMSConfig,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
          authorizedRoles: [GROUP_ROLE.ADMIN, GROUP_ROLE.OWNER],
        },
        children: [
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE_DETAIL,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS + ROUTES_PATH.CMS_PAGE + '/:pageId' + ROUTES_PATH.CMS_PAGE_DETAIL + '/:pageDetailId',
            props: true,
            component: WorkspaceAdminCMSPage,
          },
          {
            name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE,
            path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.ADMIN + ROUTES_PATH.CMS + ROUTES_PATH.CMS_PAGE + '/:pageId',
            props: true,
            component: WorkspaceAdminCMSPage,
          },
        ],
      },
    ],
  },
  {
    name: ROUTES_NAMES.VISUALIZATION,
    path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION,
    component: WorkspaceVisualization,
    props: true,
    children: [
      {
        name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE_DETAIL,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION + '/:groupId' + ROUTES_PATH.VISUALIZATION_PAGE + '/:pageId' + ROUTES_PATH.VISUALIZATION_PAGE_DETAIL + '/:pageDetailId',
        props: true,
        component: WorkspaceVisualizationPage,
      },
      {
        name: ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE,
        path: ROUTES_PATH.WORKSPACE + '/:workspaceId' + ROUTES_PATH.VISUALIZATION + '/:groupId' + ROUTES_PATH.VISUALIZATION_PAGE + '/:pageId',
        props: true,
        component: WorkspaceVisualizationPage,
      },
    ],
    meta: {
      needAuthentication: true,
      hasBurgerMenu: true,
    },
  },
  {
    name: ROUTES_NAMES.ADMIN.SELF,
    path: ROUTES_PATH.ADMIN,
    component: Admin,
    redirect: ROUTES_PATH.ADMIN + ROUTES_PATH.USER,
    props: true,
    children: [
      {
        name: ROUTES_NAMES.ADMIN.USER,
        path: ROUTES_PATH.ADMIN + ROUTES_PATH.USER,
        component: UserManagement,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
          authorizedRoles: [GROUP_ROLE.ADMIN, GROUP_ROLE.OWNER],

        },
      },
      {
        name: ROUTES_NAMES.ADMIN.GROUP,
        path: ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP,
        component: GroupManagement,
        props: true,
        meta: {
          needAuthentication: true,
          hasBurgerMenu: true,
        },
        children: [
          {
            name: ROUTES_NAMES.ADMIN.GROUP_DETAIL,
            path: ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP + '/:groupId',
            component: GroupManagement,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
          {
            name: ROUTES_NAMES.ADMIN.GROUP_ADD,
            path: ROUTES_PATH.ADMIN + ROUTES_PATH.GROUP + '/add',
            component: GroupManagement,
            props: true,
            meta: {
              needAuthentication: true,
              hasBurgerMenu: true,
            },
          },
        ],
      },
    ],
    meta: {
      needAuthentication: true,
    },
  },
  {
    name: ROUTES_NAMES.ERROR_404,
    path: '*',
    component: Page404,
  },
]

// Issue with compatibility with ts https://github.com/vuejs/vue-router/issues/2252
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrollBehavior = (to: Route, from: Route, savedPosition: any) => {
  // savedPosition is only available for popstate navigations.
  const position: { selector?: string; offset?: { x: number; y: number } } = {}
  if (savedPosition) {
    // Force scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash
      return position
    }
    return savedPosition
  } else {
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash
      return position
    }
    // if the returned position is falsy or an empty object,
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

/**
 * Check if the route accessible by roles
 */
export function checkProfile (
  workspaceId: string,
  userGroupRole: LckGroup[] | undefined,
  requiredRoles: GROUP_ROLE[],
) {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const userGroupRoleCurrentWorkspace = userGroupRole && userGroupRole.find(({ aclset }) => aclset && aclset.workspace_id === workspaceId)
  return userGroupRoleCurrentWorkspace && requiredRoles && requiredRoles.includes(userGroupRoleCurrentWorkspace.uhg_role)
}

router.beforeEach(function (to, from, next) {
  // To handle children routes (to get meta from parents), Vuejs recommend to use to.matched
  // @see: https://github.com/vuejs/vue-router/issues/704
  const needAuthentication = to.matched.some(m => m.meta.needAuthentication)
  appState.hasBurgerMenu = to.matched.some(m => m.meta.hasBurgerMenu)
  const needGuest = to.matched.some(m => m.meta.needGuest)
  const isAuthenticated = authState.data.isAuthenticated
  const userProfile = authState.data?.user?.profile as USER_PROFILE
  // const userGroupsRole = authState.data?.groups[0].aclset?.ugh_role
  const userGroupsRole = authState.data?.user?.groups
  const profileAlwaysAuthorized = [USER_PROFILE.SUPERADMIN, USER_PROFILE.ADMIN]
  const authorizedRoles = to.matched.length > 0 && to.matched[0].meta.authorizedRoles

  if (!checkPathAvailable(needAuthentication, needGuest, isAuthenticated)) {
    next({ path: isAuthenticated ? ROUTES_PATH.WORKSPACE : ROUTES_PATH.HOME })
  } else if (
    !profileAlwaysAuthorized.includes(userProfile) &&
    // Be careful /admin is accessible only with profil Admin - SuperAdmin
    // Todo: so not accessible by any role for now we need to handle workspaceId
    authorizedRoles && !checkProfile(to.params.workspaceId, userGroupsRole, authorizedRoles)
  ) {
    next({ path: '/not-found' })
  } else {
    next()
  }
})

export default router
