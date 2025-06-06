import ROUTE_NAMES from '@/router/routes'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { ref, watch } from 'vue'

export type BreadcrumbItem = {
  label: string
  icon: string
  to: RouteLocationRaw
}

/**
 * Composable to help compute the breadcrumb to display
 *
 * Accordingly current route, we adapt the context.
 */
export function useBreadcrumb() {
  const breadcrumbItems = ref<BreadcrumbItem[]>([])
  const route = useRoute()

  function computeBreadcrumbItems() {
    const items: BreadcrumbItem[] = [
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
        to: {
          name: ROUTE_NAMES.WORKSPACE.ADMIN.DATASOURCES.TABLES.SLUG,
          params: {
            wsslug: route.params.wsslug,
            dsslug: route.params.dsslug,
            tslug: route.params.tslug,
          },
        },
      })
    }
    breadcrumbItems.value = items
  }

  watch(
    route,
    () => {
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
