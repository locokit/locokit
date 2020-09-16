<template>
  <div
      class="p-mx-auto p-px-2"
  >
    <div class="lck-color-page-title p-my-4">
      <h1>{{ $t('pages.userManagement.title') }}</h1>
    </div>
    <div v-if="users" class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
      <ul id="list-users" class="list-none">
        <li
          v-for="user in users"
          :key="user.id"
        >
          {{ user.first_name }} {{ user.last_name}} - {{ user.email}} - <strong>{{ user.profile }}</strong>
        </li>
      </ul>
    </div>

    <div v-else class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
      <p>{{ $t('pages.userManagement.noUser') }}</p>
    </div>
  </div>
</template>

<script>
import lckClient from '@/services/lck-api'

export default {
  name: 'UserManagement',
  data () {
    return {
      users: null
    }
  },
  async mounted () {
    // eslint-disable-next-line no-undef
    const usersList = await lckClient.service('user').find()
    if (usersList && usersList.data) {
      this.users = usersList.data
    }
  }
}

</script>

<style scoped>

</style>
