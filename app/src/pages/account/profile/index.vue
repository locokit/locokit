<script setup lang="ts">
import ROUTE_NAMES from '@/router/routes';

definePage({
  name: ROUTE_NAMES.ACCOUNT.PROFILE.ROOT,
  redirect: {
    name: ROUTE_NAMES.ACCOUNT.PROFILE.UPDATE_GENERAL,
  },
})
</script>
