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
        :first="usersWithPagination.skip"
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
        @sort="onSort($event)"
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
              <lck-state-button
                :disabled="slotProps.data.isVerified"
                :error="resendVerifySignupUsers[slotProps.data.id] && resendVerifySignupUsers[slotProps.data.id].error"
                icon="pi pi-envelope"
                :loading="resendVerifySignupUsers[slotProps.data.id] && resendVerifySignupUsers[slotProps.data.id].loading"
                :title="$t('pages.userManagement.resendVerifySignup')"
                @click="resendVerifySignup(slotProps.data)"
              />
              <lck-state-button
                :error="disableUsers[slotProps.data.id] && disableUsers[slotProps.data.id].error"
                :icon="slotProps.data.blocked ? 'pi pi-ban' : 'pi pi-eye'"
                :loading="disableUsers[slotProps.data.id] && disableUsers[slotProps.data.id].loading"
                :title="slotProps.data.blocked
                  ? $t('pages.userManagement.enableUser.enable')
                  : $t('pages.userManagement.disableUser.disable')
                "
                @click="updateUserBlockingStatus(slotProps.data, slotProps.index)"
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
        <validation-provider
          vid="name"
          tag="div"
          :name="$t('pages.userManagement.name')"
          class="p-field"
          rules="required"
          v-slot="{
            errors,
            classes
          }"
        >
          <label for="name" class="label-field-required">{{ $t("pages.userManagement.name") }}</label>
          <p-input-text
            id="name"
            v-model.trim="user.name"
            autofocus
            :class="{ 'p-invalid': submitting && !user.name }"
          />
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
        <validation-provider
          vid="email"
          tag="div"
          :name="$t('pages.userManagement.email')"
          class="p-field"
          rules="required|email"
          v-slot="{
            errors,
            classes
          }"
        >
          <label for="email" class="label-field-required">
            {{ $t("pages.userManagement.email") }}
          </label>
          <p-input-text
            id="email"
            type="email"
            required
            v-model="user.email"
            :title="selfEditing && $t('pages.userManagement.editOwnEmailAddress')"
            :disabled="selfEditing"
          />
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>

        <validation-provider
          vid="profile"
          tag="div"
          class="p-field"
        >
          <label for="profile">{{ $t("pages.userManagement.profile") }}</label>
          <p-dropdown
            id="profile"
            v-model="user.profile"
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
        </validation-provider>
      </template>
    </lck-dialog-form>
  </div>
</template>

<script>
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'
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
import StateButton from '@/components/ui/StateButton/StateButton.vue'
import FilterButton from '@/components/store/FilterButton/FilterButton.vue'
import { authState } from '@/store/auth'

export default {
  name: 'UserManagement',
  components: {
    'lck-dialog-form': DialogForm,
    'lck-filter-button': FilterButton,
    'lck-state-button': StateButton,
    'p-toolbar': Vue.extend(Toolbar),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-checkbox': Vue.extend(Checkbox),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'validation-provider': Vue.extend(ValidationProvider),
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
        value: key,
      })),
      currentPage: 0,
      sortField: 'id',
      sortOrder: 1,
      resendVerifySignupUsers: {},
      disableUsers: {},
    }
  },
  computed: {
    selfEditing () {
      return this.user.id === authState.data.user?.id
    },
    filterDefinition () {
      return {
        columns: [
          {
            id: 'name',
            // text: '',
            text: this.$t('pages.userManagement.name'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.STRING,
          },
          {
            id: 'email',
            text: this.$t('pages.userManagement.email'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.STRING,
          },
          {
            id: 'isVerified',
            text: this.$t('pages.userManagement.isVerified'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.BOOLEAN,
          },
          {
            id: 'blocked',
            text: this.$t('pages.userManagement.disableUser.disabled'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.BOOLEAN,
          },
          {
            id: 'createdAt',
            text: this.$t('pages.userManagement.createdAt'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.DATE,
          },
          {
            id: 'profile',
            text: this.$t('pages.userManagement.profile'),
            // eslint-disable-next-line @typescript-eslint/camelcase
            column_type_id: COLUMN_TYPE.STRING,
          },
        ],
      }
    },
  },
  methods: {
    getCurrentFilters,
    addUser () {
      this.user = {
        profile: USER_PROFILE.USER,
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
        email: user.email,
      }
      this.editingUser = true
      this.openDialog = true
    },
    async resendVerifySignup (user) {
      this.$set(this.resendVerifySignupUsers, user.id, {
        loading: true,
        error: null,
      })
      try {
        await lckClient.service('authManagement').create({
          action: 'resendVerifySignup',
          value: { email: user.email },
        })
        this.retrieveUsersData()

        this.$toast.add({
          severity: 'success',
          summary: this.$t('pages.userManagement.notification.success.summary'),
          detail: this.$t('pages.userManagement.notification.success.detail'),
          life: 5000,
        })
      } catch (error) {
        this.resendVerifySignupUsers[user.id].error = error
        this.$toast.add({
          severity: 'error',
          summary: this.$t('pages.userManagement.notification.error.summary'),
          detail: this.$t('pages.userManagement.notification.error.detail'),
          life: 5000,
        })
      }
      this.resendVerifySignupUsers[user.id].loading = false
    },
    async saveUser () {
      this.submitting = true
      if (this.editingUser) {
        const userId = this.user.id
        try {
          await lckClient.service('user').patch(userId, {
            name: this.user.name,
            profile: this.user.profile,
            email: this.user.email,
          })
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error.basic'),
            detail: this.$t(`error.http.${error.code}`),
            life: 5000,
          })
          this.submitting = false
          return
        }
      } else {
        await lckClient.service('user').create(this.user)
      }
      this.submitting = false
      this.openDialog = false
      this.retrieveUsersData()
    },
    /**
     * Enable the user if its account is blocked or disable it otherwise.
     * @param user The user to update
     */
    async updateUserBlockingStatus (user) {
      this.$set(this.disableUsers, user.id, {
        loading: true,
        error: null,
      })
      try {
        const updatedUser = await lckClient.service('user').patch(user.id, {
          blocked: !user.blocked,
        })
        this.$toast.add({
          severity: 'success',
          summary: this.$t('success.save'),
          detail: updatedUser.blocked
            ? this.$t('pages.userManagement.disableUser.success')
            : this.$t('pages.userManagement.enableUser.success'),
          life: 5000,
        })
        this.onSubmitFilter()
      } catch (error) {
        this.disableUsers[user.id].error = error
        this.$toast.add({
          severity: 'error',
          summary: this.$t('pages.userManagement.notification.error.summary'),
          detail: this.$t('pages.userManagement.notification.error.detail'),
          life: 5000,
        })
      } finally {
        this.disableUsers[user.id].loading = false
      }
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
            $sort: { [this.sortField]: this.sortOrder },
            ...this.getCurrentFilters(this.currentDatatableFilters),
          },
        })
      } catch (error) {
        console.error(error)
      }
    },
    async onPage (event) {
      this.currentPage = event.page
      this.retrieveUsersData()
    },
    async onSort (event) {
      this.sortField = event.sortField
      this.sortOrder = event.sortOrder
      this.retrieveUsersData()
    },
    onResetFilter () {
      this.currentPage = 0
      this.currentDatatableFilters = []
      this.retrieveUsersData()
    },
    onSubmitFilter () {
      this.currentPage = 0
      this.retrieveUsersData()
    },
  },
  async mounted () {
    this.retrieveUsersData()
  },
}
</script>
