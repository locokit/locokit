<!-- Currently, there is no dropdown button component in Prime.  -->
<!-- So, we have create one which is based on SplitButton and uses Button, Menu component in Prime -->
<template>
  <div class="p-splitbutton p-component">
    <p-button
      type="button"
      :label="label"
      class="p-splitbutton-menubutton"
      icon="pi pi-chevron-down"
      iconPos="right"
      @click="onDropdownButtonClick"
      :disabled="disabled"
      aria-haspopup="true"
      :aria-controls="ariaId + '_overlay'"
    />
    <p-menu
      :id="ariaId + '_overlay'"
      ref="menu"
      :model="model"
      :popup="true"
      :autoZIndex="autoZIndex"
      :baseZIndex="baseZIndex"
      :appendTo="appendTo"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

let lastId = 0
const prefix = 'pv_id_'

export default {
  name: 'DropdownButton',
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    model: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: String,
      default: null
    },
    autoZIndex: {
      type: Boolean,
      default: true
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    appendTo: {
      type: String,
      default: null
    }
  },
  components: {
    'p-button': Vue.extend(Button),
    'p-menu': Vue.extend(Menu)
  },
  methods: {
    onDropdownButtonClick () {
      this.$refs.menu.toggle({
        currentTarget: this.$el,
        relativeAlign: this.appendTo == null
      })
    }
  },
  computed: {
    ariaId () {
      lastId++
      return `${prefix}${lastId}`
    }
  }
}
</script>

<style scoped>
.p-splitbutton {
  display: inline-flex;
  position: relative;
}

.p-splitbutton .p-splitbutton-defaultbutton {
  flex: 1 1 auto;
}

.p-splitbutton-menubutton {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-splitbutton .p-menu {
  min-width: 100%;
}

.p-fluid .p-splitbutton {
  display: flex;
}
</style>
