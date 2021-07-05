import { shallowMount as originalShallowMount, createLocalVue } from '@vue/test-utils'

import VueI18n from 'vue-i18n'

const localVue = createLocalVue()
localVue.use(VueI18n)

export function shallowMount (component, options = {}) {
  return originalShallowMount(component, {
    ...options,
    localVue,
    mocks: {
      t: key => key,
      $t: key => key,
      ...options.mocks,
    },
  })
}
