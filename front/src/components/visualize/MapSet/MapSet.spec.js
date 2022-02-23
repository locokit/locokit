import { shallowMount, flushAll } from '@/../tests/unit/local-test-utils'
import { BLOCK_TYPE } from '@locokit/lck-glossary/src'
import MapSet from '@/components/visualize/MapSet/MapSet.vue'

const blockDefinition1 = {
  id: '160',
  createdAt: '2021-06-25T18:40:03.109Z',
  updatedAt: '2021-06-25T18:40:03.109Z',
  containerId: '16',
  settings: {
    addSourceId: '4',
    addAllowed: true,
    addButtonTitle: 'This is my add button, click here !',
    sources: [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ],
  },
  title: 'My map block',
  type: BLOCK_TYPE.MAP_SET,
  position: 3,
}

jest.mock('primevue/button', () => ({
  name: 'p-button',
  render: h => h('p-button'),
}))

describe('MapSet', () => {
  let wrapper
  jest.useFakeTimers()

  beforeEach(async () => {
    wrapper = await shallowMount(MapSet, {
      propsData: {
        settings: blockDefinition1.settings,
        content: {},
        definition: {},
        workspaceId: 'toto',
      },
      listeners: {
        'update-suggestions': jest.fn(),
        'get-secondary-sources': jest.fn(),
      },
    })
  })
  it('match snapshot', async () => {
    expect.assertions(1)
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('display a add button if addAllowed with the good label', async () => {
    expect.assertions(2)
    const blocks = wrapper.findAll('p-button-stub')
    expect(blocks.length).toBe(1)
    expect(blocks.at(0).attributes().label).toBe('This is my add button, click here !')
  })
  it('display a dialog if addAllowed button is clicked', async () => {
    expect.assertions(1)
    wrapper.vm.onClickAddButton()
    await flushAll()
    expect(wrapper.html()).toMatchSnapshot()
  })
  it('hide automatically dialog after success', async () => {
    expect.assertions(1)
    wrapper.vm.onClickAddButton()
    await flushAll()
    wrapper.setProps({
      submitting: {
        inProgress: false,
        errors: null,
      },
    })
    await flushAll()
    expect(wrapper.html()).toMatchSnapshot()
  })
  afterEach(async () => {
    await wrapper.destroy()
  })
})
