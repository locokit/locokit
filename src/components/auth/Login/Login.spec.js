import Login from './Login.vue'
import { shallowMount } from '@/../tests/unit/local-test-utils.js'

describe('Login.vue', () => {
  it('renders without error', () => {
    shallowMount(Login)
  })
})
