import { createLocalVue, mount } from '@vue/test-utils'
import { flushAll } from '@/../tests/unit/local-test-utils'
import { TooManyRequests } from '@feathersjs/errors'

import { lckClient } from '@/services/lck-api'
import { appState } from '@/store/app'
import VueRouter from 'vue-router'

import LckSignUp from '@/components/auth/SignUp/SignUp'
import LckForm from '@/components/ui/Form/Form.vue'

import SignUp from './SignUp'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter(
  {
    routes: [
      {
        name: 'Home',
        path: '/',
      },
    ],
  },
)

const globalComponentParams = {
  localVue,
  router,
  mocks: {
    $confirm: {
      require: ({ accept }) => accept(), // We simulate that the user confirm
    },
    t: key => key,
    $t: key => key,
    $toast: {
      add: jest.fn(),
    },
  },
  propsData: {},
}

describe('Signup', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  const credentials = {
    name: 'John Doe',
    email: 'john.doe@locokit.io',
  }

  it('Sign up when the registration is allowed', async () => {
    const spyOnSignUpCreation = jest.spyOn(lckClient.service('signup'), 'create').mockResolvedValue(1)
    spyOnSignUpCreation.mockClear()

    const wrapper = mount(SignUp, globalComponentParams)
    appState.allowSignUp = true

    // Complete the form
    const nameInput = wrapper.find('#name')
    await nameInput.setValue(credentials.name)
    await nameInput.trigger('blur')
    const emailInput = wrapper.find('#email')
    await emailInput.setValue(credentials.email)
    await emailInput.trigger('blur')

    // Submit the form
    const formWrapper = wrapper.findComponent(LckForm)
    await formWrapper.vm.$emit('submit')
    await flushAll()

    // Call the right API service
    expect(spyOnSignUpCreation).toHaveBeenCalledTimes(1)
    expect(spyOnSignUpCreation).toHaveBeenCalledWith(credentials)

    // Update the page content
    expect(wrapper.findComponent(LckSignUp).exists()).toBe(false)
    expect(wrapper.find('.signup-message').exists()).toBe(true)
  })

  it('Sign up when the registration is allowed with error', async () => {
    const spyOnSignUpCreation = jest.spyOn(lckClient.service('signup'), 'create').mockRejectedValue(new TooManyRequests())
    spyOnSignUpCreation.mockClear()

    const wrapper = mount(SignUp, globalComponentParams)
    appState.allowSignUp = true

    // Complete the form
    const nameInput = wrapper.find('#name')
    await nameInput.setValue(credentials.name)
    await nameInput.trigger('blur')
    const emailInput = wrapper.find('#email')
    await emailInput.setValue(credentials.email)
    await emailInput.trigger('blur')

    // Submit the form
    const formWrapper = wrapper.findComponent(LckForm)
    await formWrapper.vm.$emit('submit')
    await flushAll()

    // Call the right API service
    expect(spyOnSignUpCreation).toHaveBeenCalledTimes(1)
    expect(spyOnSignUpCreation).toHaveBeenCalledWith(credentials)

    // Update the page content
    expect(wrapper.findComponent(LckSignUp).exists()).toBe(true)
    const invalidMessage = wrapper.find('.invalid')
    expect(invalidMessage.exists()).toBe(true)
    expect(invalidMessage.element.textContent).toBe('error.http.429')
  })

  it('Sign up when the registration is not allowed', async () => {
    const wrapper = mount(SignUp, globalComponentParams)

    appState.allowSignUp = false

    const spyOnSignUpCreation = jest.spyOn(lckClient.service('signup'), 'create').mockResolvedValue(1)
    const spyOnToast = jest.spyOn(wrapper.vm.$toast, 'add')

    // Complete the form
    const nameInput = wrapper.find('#name')
    await nameInput.setValue(credentials.name)
    await nameInput.trigger('blur')
    const emailInput = wrapper.find('#email')
    await emailInput.setValue(credentials.email)
    await emailInput.trigger('blur')

    // Submit the form
    const formWrapper = wrapper.findComponent(LckForm)
    await formWrapper.vm.$emit('submit')
    await flushAll()

    // Don't call the right API service
    expect(spyOnSignUpCreation).toHaveBeenCalledTimes(1)
    expect(spyOnSignUpCreation).toHaveBeenCalledWith(credentials)

    // Display a toast
    expect(spyOnToast).toHaveBeenCalledTimes(1)
    expect(spyOnToast).toHaveBeenCalledWith(expect.objectContaining({
      severity: 'error',
      summary: 'error.impossibleOperation',
      detail: 'pages.signup.forbid',
    }))
  })
})
