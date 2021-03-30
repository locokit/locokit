<!-- Currently, there is no dropdown button component in Prime.  -->
<!-- So, we have create one which is based on SplitButton and uses Button, Menu component in Prime -->
<template>
  <div class="lck-dropdownbutton">
    <p-button
      type="button"
      :label="label"
      class="lck-dropdownbutton-menubutton"
      :class="[buttonClass, icon ? 'button-with-icon' : '' ]"
      :icon="icon"
      iconPos="left"
      @click="onDropdownButtonClick"
      :disabled="disabled"
      aria-haspopup="true"
      :aria-controls="ariaId + '_overlay'"
    />
    <p-menu
      :id="ariaId + '_overlay'"
      class="lck-dropdownbutton-menu"
      ref="menu"
      :style="`width:${menuWidth}`"
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
  name: 'LckDropdownButton',
  props: {
    label: {
      type: String
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: 'left'
    },
    buttonClass: {
      type: String
    },
    model: {
      type: Array,
      default: function () {
        return [{
          id: 0,
          label: this.$t('components.dropdownButton.noOption')
        }]
      }
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
    },
    menuWidth: {
      type: String,
      default: '100%'
    }
  },
  components: {
    'p-button': Vue.extend(Button),
    'p-menu': Vue.extend(Menu)
  },
  methods: {
    onDropdownButtonClick () {
      this.$emit('click')
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

<style scoped lang="scss">
.lck-dropdownbutton {
  display: inline-flex;
  position: relative;

  .lck-dropdownbutton-menubutton {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-right: 2rem;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      display: inline-flex;
      width: 16px;
      padding: 0 5px;
      background-image: url("data:image/svg+xml,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-chevron-down' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 16px;
    }
  }
}

.lck-dropdownbutton-menu {
  width: 100%;
  max-width: 450px
}
</style>

<style scoped>
::v-deep .specific-icon.lightning:after {
  mask: url("/img/lowcokit/ligthning.svg") no-repeat center center;
  mask-size: cover;
}
</style>
