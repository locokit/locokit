/**
 * This file is here to export the library.
 *
 * We export all components / layouts.
 *
 */

/**
 * Components
 */
import HelloWorld from './components/HelloWorld.vue'
import SingleTag from './components/ui/single-tag/single-tag.vue'
import MultiTag from './components/ui/multi-tag/multi-tag.vue'

export const components = {
  HelloWorld,
  SingleTag,
  MultiTag,
}

export { HelloWorld, SingleTag, MultiTag }

/**
 * Layouts
 */
import LayoutBackground from './layouts/background.vue'

export const layouts = {
  LayoutBackground,
}

export { LayoutBackground }
