import { shallowMount } from '@/../tests/unit/local-test-utils'
import ExternalApp from '@/components/visualize/ExternalApp/ExternalApp.vue'

const blockExternalApp = {
  id: 1,
  title: 'My TableSet\'s block',
  type: 'TableSet',
  settings: {
    parts: [{
      type: 'String',
      string: 'https://',
    }, {
      type: 'Source',
      id: 'first-source',
      fieldId: 'id',
    }, {
      type: 'Source',
      id: 'second-source',
      fieldId: '72205f2e-a9cc-4e30-82ba-6f1f6e357e0c',
    }, {
      type: 'String',
      string: '.io',
    }],
  },
  content: {
    'first-source': {
      id: 'demo.',
    },
    'second-source': {
      data: {
        '72205f2e-a9cc-4e30-82ba-6f1f6e357e0c': 'locokit',
      },
    },
  },
}

describe('ExternalApp', () => {
  it('match snapshot without any settings', async () => {
    const wrapper = await shallowMount(ExternalApp)
    expect.assertions(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('display the iframe to demo locokit', async () => {
    const wrapper = await shallowMount(ExternalApp, {
      propsData: {
        settings: blockExternalApp.settings,
        content: blockExternalApp.content,
      },
    })
    expect.assertions(3)
    const iframe = wrapper.findAll('iframe')
    expect(iframe.length).toBe(1)
    expect(iframe.at(0).attributes().src).toBe('https://demo.locokit.io')
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('display an iframe with broken URL if one of the part is null', async () => {
    const wrapper = await shallowMount(ExternalApp, {
      propsData: {
        settings: blockExternalApp.settings,
        content: {
          ...blockExternalApp.content,
          'second-source': null,
        },
      },
    })
    expect.assertions(3)
    const iframe = wrapper.findAll('iframe')
    expect(iframe.length).toBe(1)
    expect(iframe.at(0).attributes().src).toBe('https://demo..io')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
