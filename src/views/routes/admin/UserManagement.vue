<template>
  <div class="p-mx-auto p-px-2">
    <div class="lck-color-primary p-my-4">
      <h1>{{ $t("pages.userManagement.title") }}</h1>
    </div>

    <div class="p-d-flex p-flex-row p-flex-wrap p-jc-start">
      <p-toolbar class="w-full p-my-4">
        <template slot="left">
          <lck-filter-button
            class="p-ml-2"
            :definition="filterDefinition"
            v-model="currentDatatableFilters"
            @submit="onSubmitFilter"
            @reset="onResetFilter"
          />
        </template>
        <template slot="right">
          <p-button
            :label="$t('pages.userManagement.addNewUser')"
            icon="pi pi-plus"
            class="p-mr-2"
            @click="addUser"
          />
        </template>
      </p-toolbar>

      <p-datatable
        v-if="usersWithPagination && usersWithPagination.data.length > 0"
        :value="usersWithPagination.data"
        :paginator="true"
        :lazy="true"
        :rows="usersWithPagination.limit"
        :totalRecords="usersWithPagination.total"
        class="p-datatable-sm p-datatable-striped p-datatable-responsive editable-cell-table"
        :resizableColumns="true"
        columnResizeMode="fit"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        :currentPageReportTemplate="
          $t('components.paginator.currentPageReportTemplate')
        "
        @page="onPage($event)"
      >
        <p-column
          field="id"
          headerClass="p-text-center p-col-1"
          bodyClass="p-text-center"
          :header="$t('pages.userManagement.id')"
          sortable
        >
        </p-column>
        <p-column
          field="name"
          :header="$t('pages.userManagement.name')"
          sortable
        >
        </p-column>
        <p-column
          field="email"
          :header="$t('pages.userManagement.email')"
          sortable
        >
        </p-column>

        <p-column
          field="isVerified"
          :header="$t('pages.userManagement.isVerified')"
          sortField="isVerified"
          sortable
        >
          <template #body="slotProps">
            <p-checkbox
              :binary="true"
              :modelValue="slotProps.data.isVerified"
              :disabled="true"
            />
          </template>
        </p-column>

        <p-column
          field="createdAt"
          :header="$t('pages.userManagement.createdAt')"
          sortable
        />
        <p-column
          field="profile"
          headerClass="p-col-1"
          :header="$t('pages.userManagement.profile')"
          sortable
        >
          <template #body="slotProps">
            {{ slotProps.data["profile"] }}
          </template>
        </p-column>
        <p-column
          headerClass="p-col-1"
          bodyClass="p-text-center"
          headerStyle="width: 10rem;"
        >
          <template #body="slotProps">
            <span class="p-buttonset">
              <p-button
                icon="pi pi-pencil"
                @click="editUser(slotProps.data)"
                :title="$t('pages.userManagement.editUser')"
              />
              <p-button
                :icon="
                  resendVerifySignupUsers[slotProps.data.id] &&
                  resendVerifySignupUsers[slotProps.data.id].loading
                    ? 'pi pi-spin pi-spinner'
                    : resendVerifySignupUsers[slotProps.data.id] &&
                      resendVerifySignupUsers[slotProps.data.id].error
                    ? 'pi pi-exclamation-circle'
                    : 'pi pi-envelope'
                "
                :class="
                  resendVerifySignupUsers[slotProps.data.id] &&
                  resendVerifySignupUsers[slotProps.data.id].error
                    ? 'p-button-danger'
                    : slotProps.data.isVerified
                    ? 'p-button-outlined p-disabled'
                    : ''
                "
                @click="resendVerifySignup(slotProps.data)"
                :disabled="
                  slotProps.data.isVerified ||
                    (resendVerifySignupUsers[slotProps.data.id] &&
                      resendVerifySignupUsers[slotProps.data.id].loading)
                "
                :title="
                  resendVerifySignupUsers[slotProps.data.id] &&
                  resendVerifySignupUsers[slotProps.data.id].error
                    ? resendVerifySignupUsers[slotProps.data.id].error
                    : $t('pages.userManagement.resendVerifySignup')
                "
              />
              <p-button
                icon="pi pi-eye"
                class="p-button-outlined p-disabled"
                :title="$t('pages.userManagement.disableUser')"
              />
            </span>
          </template>
        </p-column>
      </p-datatable>
      <div
        v-else-if="
          usersWithPagination &&
            usersWithPagination.data.length === 0 &&
            currentDatatableFilters.length > 0
        "
        class="p-d-flex p-flex-row p-flex-wrap p-jc-start"
      >
        <p>{{ $t("pages.userManagement.noUserFound") }}</p>
      </div>
      <div
        v-else
        class="p-d-flex p-flex-row p-flex-wrap p-jc-start"
      >
        <p>{{ $t("pages.userManagement.noUser") }}</p>
      </div>
    </div>

    <lck-dialog-form
      :visible.sync="openDialog"
      :header="
        $t(
          `pages.userManagement.${
            editingUser ? 'editUserDetails' : 'createUserDetails'
          }`
        )
      "
      @close="openDialog = false"
      :submitting="submitting"
      :contentStyle="{ 'overflow-y': 'visible' }"
      @input="saveUser"
    >
      <template>
        <div class="p-field">
          <label for="name">{{ $t("pages.userManagement.name") }}</label>
          <p-input-text
            id="name"
            v-model.trim="user.name"
            requiredolumn
            autofocus
            :class="{ 'p-invalid': submitting && !user.name }"
          />
        </div>
        <div class="p-field">
          <label for="email">
            {{ $t("pages.userManagement.email") }}
          </label>
          <p-input-text
            id="email"
            type="email"
            required
            v-model="user.email"
            :disabled="editingUser"
          />
        </div>

        <div
          class="p-field"
          v-if="editingUser"
        >
          <label for="isVerified">
            {{ $t("pages.userManagement.isVerified") }}
          </label>
          <p-checkbox
            class="p-field-checkbox"
            :id="isVerified"
            :binary="true"
            v-model="user.isVerified"
            :disabled="true"
          />
        </div>

        <p class="p-field">
          <label for="profile">{{ $t("pages.userManagement.profile") }}</label>
          <p-dropdown
            id="profile"
            v-model.trim="user.profile"
            :options="profiles"
            optionLabel="label"
            optionValue="value"
            :class="{ 'p-invalid': submitting && !user.profile }"
            :placeholder="$t('pages.userManagement.selectProfile')"
          >
            <template #option="slotProps">
              <span>{{ slotProps.option.label }}</span>
            </template>
          </p-dropdown>
        </p>
      </template>
    </lck-dialog-form>
  </div>
</template>

<script>
import Vue from 'vue'

import { USER_PROFILE, COLUMN_TYPE } from '@locokit/lck-glossary'

import { lckClient, lckServices } from '@/services/lck-api'
import { getCurrentFilters } from '@/services/lck-utils/filter'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'

export default {
  name: 'UserManagement',
  components: {
    'lck-dialog-form': DialogForm,
    'lck-filter-button': FilterButton,
    'p-toolbar': Vue.extend(Toolbar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-checkbox': Vue.extend(Checkbox),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText)
  },
  data: function () {
    return {
      usersWithPagination: null,
      currentDatatableFilters: [],
      user: {},
      openDialog: false,
      editingUser: null,
      submitting: false,
      profiles: Object.keys(USER_PROFILE).map(key => ({
        label: key,
        value: key
      })),
      currentPage: 0,
      resendVerifySignupUsers: {}
    }
  },
  computed: {
    filterDefinition () {
      return {
        columns: [
          {
            id: 'name',
            // text: '',
            text: this.$t('pages.userManagement.name'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.STRING
          },
          {
            id: 'email',
            text: this.$t('pages.userManagement.email'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.STRING
          },
          {
            id: 'isVerified',
            text: this.$t('pages.userManagement.isVerified'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.BOOLEAN
          },
          {
            id: 'createdAt',
            text: this.$t('pages.userManagement.createdAt'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.DATE
          },
          {
            id: 'profile',
            text: this.$t('pages.userManagement.profile'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.STRING
          }
        ]
      }
    }
  },
  methods: {
    getCurrentFilters,
    addUser () {
      this.user = {
        profile: USER_PROFILE.USER
      }
      this.editingUser = false
      this.openDialog = true
    },
    hideDialog () {
      this.openDialog = false
    },
    editUser (user) {
      this.user = {
        id: user.id,
        name: user.name,
        profile: user.profile,
        email: user.email
      }
      this.editingUser = true
      this.openDialog = true
    },
    async resendVerifySignup (user) {
      this.$set(this.resendVerifySignupUsers, user.id, {
        loading: true,
        error: null
      })
      try {
        await lckClient.service('authManagement').create({
          action: 'resendVerifySignup',
          value: { email: user.email }
        })
        this.retrieveUsersData()

        this.$toast.add({
          severity: 'success',
          summary: this.$t('pages.userManagement.notification.success.summary'),
          detail: this.$t('pages.userManagement.notification.success.detail'),
          life: 3000
        })
      } catch (error) {
        this.resendVerifySignupUsers[user.id].error = error
        this.$toast.add({
          severity: 'error',
          summary: this.$t('pages.userManagement.notification.error.summary'),
          detail: this.$t('pages.userManagement.notification.error.detail'),
          life: 3000
        })
      }
      this.resendVerifySignupUsers[user.id].loading = false
    },
    async saveUser () {
      this.submitting = true
      if (this.editingUser) {
        const userId = this.user.id
        await lckClient.service('user').patch(userId, {
          name: this.user.name,
          profile: this.user.profile
        })
      } else {
        await lckClient.service('user').create(this.user)
      }
      this.submitting = false
      this.openDialog = false
      this.retrieveUsersData()
    },
    inactiveUser (user) {
      this.user = { ...user }
      alert(this.user.id)
    },
    async retrieveUsersData () {
      const ITEMS_PER_PAGE = 20

      try {
        this.usersWithPagination = await lckServices.user.find({
          query: {
            $limit: ITEMS_PER_PAGE,
            $skip: this.currentPage * ITEMS_PER_PAGE,
            $sort: { id: 1 },
            ...this.getCurrentFilters(this.currentDatatableFilters)
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    async onPage (event) {
      this.currentPage = event.page
      this.retrieveUsersData()
    },
    onResetFilter () {
      this.currentDatatableFilters = []
      this.retrieveUsersData()
    },
    onSubmitFilter () {
      this.retrieveUsersData()
    }
  },
  async mounted () {
    this.retrieveUsersData()
  }
}
</script>
