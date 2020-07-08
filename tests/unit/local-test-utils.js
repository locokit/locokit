import { shallowMount as originalShallowMount, createLocalVue } from '@vue/test-utils'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/fr'

import VueI18n from 'vue-i18n'

const localVue = createLocalVue()
localVue.use(Element, { locale })
localVue.use(VueI18n)

export function shallowMount (component, options = {}) {
  return originalShallowMount(component, {
    ...options,
    localVue,
    mocks: {
      t: key => key,
      $t: key => key,
      ...options.mocks
    }
  })
}
