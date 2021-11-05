<template>
  <p-card >
    <template #title>
      <div style="position: relative">
        {{ aclSet.label }}

        <p-button
          v-if="aclSet.id"
          class="delete-aclset-button p-button-sm p-button-danger"
          icon="pi pi-trash"
          @click="$emit('delete', aclSet)"
        />
      </div>
    </template>

    <template #content style="width: 100%;">

      <!-- ACLSet configuration -->
      <lck-form
        :submitting="submitting.aclSet"
        @submit="$emit('set-aclset', aclSet)"
        @cancel="$emit('cancel')"
      >

        <validation-provider
          class="p-field"
          :name="$t('pages.workspaceAdmin.acl.detail.label')"
          rules="required"
          tag="div"
          vid="label"
          v-slot="{ errors, classes }"
        >
          <label class="label-field-required" for="label">
            {{ $t('pages.workspaceAdmin.acl.detail.label') }}
          </label>
          <p-input-text id="label" v-model="aclSet.label" />
          <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
        </validation-provider>

        <validation-provider
          class="p-field"
          :name="$t('pages.workspaceAdmin.acl.common.manager')"
          rules="required"
          tag="div"
          vid="manager"
          v-slot="{ errors, classes }"
        >
          <label class="label-field-required" for="manager">
            {{ $t('pages.workspaceAdmin.acl.common.manager') }}
          </label>
          <p-input-switch id="manager" v-model="aclSet.manager" />
          <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
        </validation-provider>

        <validation-provider
          class="p-field"
          :name="$t('pages.workspaceAdmin.acl.detail.chapter')"
          tag="div"
          vid="chapter"
          v-slot="{ errors, classes }"
        >
          <label for="chapter">
            {{ $t('pages.workspaceAdmin.acl.detail.chapter') }}
          </label>
          <lck-autocomplete
            field="text"
            id="chapter"
            :placeholder="$t('components.datatable.placeholder')"
            :suggestions="chapterSuggestions"
            v-model="aclSet.chapter"
            @clear="aclSet.chapter_id = null"
            @item-select="aclSet.chapter_id = $event.value.id"
            @search="$emit('search-chapter', $event.query)"
          />
          <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
        </validation-provider>

      </lck-form>

      <!-- ACLTable configurations -->
      <h3>
        {{ $t('pages.workspaceAdmin.acl.detail.aclTablesExplanation') }}
      </h3>

      <p-datatable
        class="p-mx-auto"
        dataKey="id"
        :value="aclSet.acltables"
      >
        <template #empty>{{ $t('pages.workspaceAdmin.acl.detail.noAclTable') }}</template>
        <!-- Table header -->
        <p-column-group type="header">
          <p-row>
            <p-column
              headerStyle="width: 10rem; border-right-width: 1px;"
            />
            <p-column
              :colspan="4"
              :header="$t('pages.workspaceAdmin.acl.detail.aclTableRecord')"
              headerStyle="width: 16rem; border-width: 0 1px 1px 0;"
            />
            <p-column
              :colspan="3"
              :header="$t('pages.workspaceAdmin.acl.detail.aclTableFilters')"
              headerStyle="width: 12rem; border-bottom-width: 1px;"
            />
          </p-row>
          <p-row>
            <p-column
              headerStyle="width: 10rem; border-right-width: 1px;"
              :header="$t('pages.workspaceAdmin.acl.detail.aclTableName')"
            ></p-column>
            <p-column
              v-for="property in allAclTableProperties"
              :field="property.label"
              :headerStyle="property.style"
              :key="property.label"
            >
              <template #header>
                <i :class="property.icon" :title="$t(`pages.acl.detail.${property.label}`)"></i>
              </template>
            </p-column>
          </p-row>
        </p-column-group>
        <!-- Table body -->
        <p-column
          bodyStyle="border-right-width: 1px; background-color: white;"
          field="table.text"
        />
        <p-column
          v-for="property in aclTableProperties"
          :bodyStyle="property.style"
          :field="property.label"
          :key="property.label"
        >
          <template #body="slotProps">
            <lck-state-button
              v-bind="aclStateButtonStyle[slotProps.data[property.label]]"
              @click="
                setAclTable(slotProps.data, slotProps.index, {
                  [property.label]: !slotProps.data[property.label],
                })
              "
            />
          </template>
        </p-column>
        <p-column
          v-for="filter in aclTableFilters"
          :bodyStyle="filter.style"
          :field="filter.label"
          :key="filter.label"
        >
          <template #header>
            <i :class="icon"></i>
          </template>
          <template #body="slotProps">
            <lck-overlaypanel
              :class-button="
                'p-button-outlined p-button-text ' +
                ( slotProps.data[filter.label] && Object.keys(slotProps.data[filter.label]).length > 0 ? 'p-button-warning' : 'p-button-secondary' )
              "
              icon="bi bi-file-code"
              :label="null"
            >
              <template #overlay-content>
                <lck-json-field
                  cols="75"
                  :value="slotProps.data[filter.label]"
                  @blur="setAclTable(slotProps.data, slotProps.index, { [filter.label]: $event })"
                  @error="onError"
                />
              </template>
            </lck-overlaypanel>
          </template>
        </p-column>
      </p-datatable>
    </template>
  </p-card>
</template>

<script lang="ts">

import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import {
  LckAclSet,
  LckAclTable,
  LckChapter,
  LckWorkspace,
} from '@/services/lck-api/definitions'

import Button from 'primevue/button'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import DataTable from 'primevue/datatable'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import Row from 'primevue/row'
import Card from 'primevue/card'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import Form from '@/components/ui/Form/Form.vue'
import JSONField from '@/components/ui/JSONField/JSONField.vue'
import OverlayPanel from '@/components/ui/OverlayPanel/OverlayPanel.vue'
import StateButton from '@/components/ui/StateButton/StateButton.vue'

type PropertyStyle = {
  icon: string;
  label: string;
  style?: string;
}

export default {
  name: 'AclSetForm',
  components: {
    'p-button': Vue.extend(Button),
    'p-card': Vue.extend(Card),
    'p-column': Vue.extend(Column),
    'p-column-group': Vue.extend(ColumnGroup),
    'p-datatable': Vue.extend(DataTable),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-input-text': Vue.extend(InputText),
    'p-row': Vue.extend(Row),
    'validation-provider': Vue.extend(ValidationProvider),
    'lck-autocomplete': AutoComplete,
    'lck-form': Form,
    'lck-json-field': JSONField,
    'lck-overlaypanel': OverlayPanel,
    'lck-state-button': StateButton,
  },
  props: {
    aclSet: {
      type: Object,
      required: true,
    } as Vue.PropOptions<LckAclSet>,
    chapterSuggestions: {
      type: Array,
      default: () => [],
    } as Vue.PropOptions<LckChapter[]>,
    submitting: {
      type: Object,
      default: () => ({
        aclSet: false,
      }),
    } as Vue.PropOptions<{
      aclSet: false;
    }>,
    workspace: {
      type: Object,
      default: null,
    } as Vue.PropOptions<LckWorkspace>,
    focusedCell: {
      type: String,
      default: '',
    },
  },
  data (): {
    aclStateButtonStyle: Record<
      'true' | 'false',
      {
        class: string;
        style: string;
        icon: string;
      }
    >;
    aclTableProperties: PropertyStyle[];
    aclTableFilters: PropertyStyle[];
    aclTables: Record<string, LckAclTable>;
    } {
    return {
      aclTables: {},
      aclStateButtonStyle: {
        true: {
          class: 'p-button-text',
          style: 'color: green;',
          icon: 'pi pi-check',
        },
        false: {
          class: 'p-button-text',
          style: 'color: red;',
          icon: 'pi pi-ban',
        },
      },
      aclTableFilters: [
        {
          icon: 'pi pi-eye',
          label: 'read_filter',
        },
        {
          icon: 'pi pi-pencil',
          label: 'update_filter',
        },
        {
          icon: 'pi pi-trash',
          label: 'delete_filter',
        },
      ],
      aclTableProperties: [
        {
          icon: 'pi pi-plus',
          label: 'create_rows',
        },
        {
          icon: 'pi pi-eye',
          label: 'read_rows',
        },
        {
          icon: 'pi pi-pencil',
          label: 'update_rows',
        },
        {
          icon: 'pi pi-trash',
          label: 'delete_rows',
          style: 'border-right-width: 1px;',
        },
      ],
    }
  },
  computed: {
    allAclTableProperties (): PropertyStyle[] {
      return this.aclTableProperties.concat(this.aclTableFilters)
    },
  },
  methods: {
    setAclTable (aclTable: LckAclTable, index: number, data: Partial<LckAclTable>) {
      this.$emit('set-acltable', {
        index,
        aclTable,
        newData: data,
      })
    },
    onError () {
      this.$toast.add({
        severity: 'error',
        summary: this.$t('error.basic'),
        detail: this.$t('pages.workspaceAdmin.acl.detail.filterError'),
        life: 5000,
      })
    },
  },
}
</script>

<style scoped lang="scss">

/** ACLSet configuration form */
.delete-aclset-button {
  position: absolute;
  right: 0;
  top: 0;
}

.p-inputswitch {
  display: block;
}

/** ACLTable configurations */
::v-deep .p-datatable table {
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #ddd;
  margin: auto;

  max-width: 100%;
  overflow: auto;
  width: min-content;

  textarea {
    resize: horizontal;
  }

  .p-datatable-tbody > tr > td {
    border-color: #ddd;
    border-style: solid;

    &:not(:first-child) {
      text-align: center;
    }
  }

  .p-datatable-thead {
    & tr > th {
      border-color: #ddd;
      border-style: solid;
      text-align: center;
    }
  }
}

</style>
