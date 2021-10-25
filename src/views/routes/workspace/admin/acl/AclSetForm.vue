<template>
  <div class="aclset-form-container">

    <h3>{{ aclSet.label }}</h3>

    <p-button
      v-if="aclSet.id"
      class="delete-aclset-button p-button-sm p-button-danger"
      icon="pi pi-trash"
      @click="$emit('delete', aclSet)"
    />

    <p-tab-view class="lck-aclset-tab">

      <!-- ACLSet configuration -->
      <p-tab-panel :header="$t('pages.acl.detail.properties')">
        <lck-form
          :submitting="submitting.aclSet"
          @submit="$emit('set-aclset', aclSet)"
          @cancel="$emit('cancel')"
        >

          <validation-provider
            class="p-field"
            :name="$t('pages.acl.detail.label')"
            rules="required"
            tag="div"
            vid="label"
            v-slot="{ errors, classes }"
          >
            <label class="label-field-required" for="label">
              {{ $t("pages.acl.detail.label") }}
            </label>
            <p-input-text id="label" v-model="aclSet.label" />
            <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
          </validation-provider>

          <validation-provider
            class="p-field"
            :name="$t('pages.acl.common.manager')"
            rules="required"
            tag="div"
            vid="manager"
            v-slot="{ errors, classes }"
          >
            <label class="label-field-required" for="manager">
              {{ $t("pages.acl.common.manager") }}
            </label>
            <p-input-switch id="manager" v-model="aclSet.manager" />
            <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
          </validation-provider>

          <validation-provider
            class="p-field"
            :name="$t('pages.acl.detail.chapter')"
            tag="div"
            vid="chapter"
            v-slot="{ errors, classes }"
          >
            <label for="chapter">
              {{ $t("pages.acl.detail.chapter") }}
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
      </p-tab-panel>

      <!-- ACLTable configurations -->
      <p-tab-panel v-if="aclSet.id">

        <template #header>
          <span class="p-tabview-title">
            {{ $t("pages.acl.detail.aclTables") }}
          </span>
        </template>

        <p-datatable
          class="acltables"
          dataKey="id"
          :value="aclSet.acltables"
        >
          <template #empty>{{ $t("pages.acl.detail.noAclTable") }}</template>
          <!-- Table header -->
          <p-column-group type="header">
            <p-row>
              <p-column
                :header="$t('pages.acl.detail.aclTableName')"
                headerClass="sticky-column"
                headerStyle="width: 250px; border-right-width: 1px;"
                :rowspan="2"
              />
              <p-column
                :colspan="4"
                :header="$t('pages.acl.detail.aclTableRecord')"
                headerStyle="width: 250px; border-width: 0 1px 1px 0;"
              />
              <p-column
                :colspan="3"
                :header="$t('pages.acl.detail.aclTableFilters')"
                headerStyle="width: 200px; border-bottom-width: 1px;"
              />
            </p-row>
            <p-row>
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
            bodyClass="sticky-column"
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
                class-button="p-button-outlined p-button-text p-button-secondary"
                icon="pi pi-ellipsis-h"
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
      </p-tab-panel>

    </p-tab-view>
  </div>
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
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

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
    'p-column': Vue.extend(Column),
    'p-column-group': Vue.extend(ColumnGroup),
    'p-datatable': Vue.extend(DataTable),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-input-text': Vue.extend(InputText),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
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
        detail: this.$t('pages.acl.detail.filterError'),
        life: 5000,
      })
    },
  },
}
</script>

<style scoped lang="scss">

/* Common */

.aclset-form-container {
  padding: 0 0.5rem;
  position: relative;
}

::v-deep .lck-aclset-tab.p-tabview .p-tabview-nav {
  border: unset;
}

::v-deep .lck-aclset-tab.p-tabview .p-tabview-nav .p-tabview-title{
  color: var(--primary-color);
}

::v-deep .lck-aclset-tab.p-tabview .p-tabview-panels {
  padding: 1rem 0;
}

::v-deep .lck-aclset-tab.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  font-weight: normal;
  margin-right: 0.5rem;
  padding: 0.25rem;
}

/** ACLSet configuration form */
.delete-aclset-button {
  position: absolute;
  right: 0.5rem;
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

  max-width: 100%;
  overflow: auto;
  width: min-content;

  textarea {
    resize: horizontal;
  }

  .sticky-column {
    left: 0;
    position: sticky;
    z-index: 15;
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
