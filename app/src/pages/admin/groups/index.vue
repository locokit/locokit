<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes';

definePage({
  name: ROUTE_NAMES.ADMIN.GROUPS.ROOT,
  redirect: {
    name: ROUTE_NAMES.ADMIN.GROUPS.CREATE,
  },
})
</script>
