import {
  shallowMount as originalShallowMount,
  createLocalVue,
  mount as originalMount,
} from '@vue/test-utils'

import VueI18n from 'vue-i18n'
import '../../src/plugins/vee-validate'
import flushPromises from 'flush-promises'

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

export function mount (component, options = {}) {
  return originalMount(component, {
    ...options,
    localVue,
    mocks: {
      t: key => key,
      $t: key => key,
      ...options.mocks,
    },
  })
}

export async function flushAll () {
  // get rid of any pending validations on the leading edge
  await flushPromises()
  // any delayed or debounced state computations
  jest.runAllTimers()
  // get rid of the pending rendering tick
  await flushPromises()
}
