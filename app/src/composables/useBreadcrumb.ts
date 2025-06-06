import ROUTE_NAMES from '@/router/routes'
import { routeLocationKey, useRoute } from 'vue-router'
import { inject, ref, watch } from 'vue'
import { type WorkspaceResult } from '@locokit/sdk'

/**
 * Composable to help compute the breadcrumb to display
 *
 * Accordingly current route, we adapt the context.
 */
export function useBreadcrumb() {
  const breadcrumbItems = ref([])
  const route = useRoute()

  function computeBreadcrumbItems() {
    const items = [
      {
        label: 'Home',
        icon: 'bi bi-house',
        to: {
          name: ROUTE_NAMES.HOME,
          params: {},
        },
      },
    ]
    const routeNamesMatched = route.matched.map((r) => r.name)

    if (routeNamesMatched.includes(ROUTE_NAMES.WORKSPACE.ADMIN.ROOT)) {
      items.push({
        label: 'my current workspace',
        icon: '',
        to: {
          name: ROUTE_NAMES.WORKSPACE.ADMIN.ROOT,
          params: {
            wsslug: route.params.wsslug,
          },
        },
      })
    }
    if (routeNamesMatched.includes(ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.ROOT)) {
      items.push({
        label: 'my current workspace',
        icon: '',
        to: {
          name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.ROOT,
          params: {
            wsslug: route.params.wsslug,
          },
        },
      })
    }
    if (routeNamesMatched.includes(ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.SLUG)) {
      items.push({
        label: 'my current datasource',
        icon: 'bi bi-database',
        to: {
          name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.SLUG,
          params: {
            wsslug: route.params.wsslug,
            dsslug: route.params.dsslug,
          },
        },
      })
    }
    if (routeNamesMatched.includes(ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.SLUG)) {
      items.push({
        label: 'my current table',
        icon: 'bi bi-table',
      })
    }
    breadcrumbItems.value = items
  }

  watch(
    route,
    (newRoute) => {
      computeBreadcrumbItems()
    },
    {
      immediate: true,
      deep: true,
    },
  )

  return {
    breadcrumbItems,
  }
}
