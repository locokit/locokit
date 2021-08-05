/* eslint-disable @typescript-eslint/camelcase */

import { mount } from '@vue/test-utils'

import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'

import LckForm from '@/components/ui/Form/Form.vue'
import UpdateBlockForm from './UpdateBlockForm.vue'
import MapSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MapSettingsFields.vue'

jest.mock('vue-i18n')

// Method to make an object deep copy
function mockDeepCloneObject (object) {
  return object ? JSON.parse(JSON.stringify(object)) : {}
}

// Mock variables
const mockDefinitions = {
  table_view_1: {
    id: 'table_view_1',
    text: 'table_view_1_name',
    columns: [
      {
        text: 'Name',
        id: 'string_1_column',
        settings: {},
        table_id: 'table_1',
        column_type_id: COLUMN_TYPE.STRING,
        editable: false,
        position: 1,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_1',
        style: {},
      },
      {
        text: 'Point',
        id: 'geo_column',
        settings: {},
        table_id: 'table_1',
        column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
        editable: false,
        position: 2,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_1',
        style: {},
      },
    ],
  },
  table_view_2: {
    id: 'table_view_2',
    text: 'table_view_2_name',
    columns: [
      {
        text: 'Description',
        id: 'string_2_column',
        settings: {},
        table_id: 'table_2',
        column_type_id: COLUMN_TYPE.STRING,
        editable: false,
        position: 1,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_2',
        style: {},
      },
      {
        text: 'Relation between tables',
        id: 'rbt_column',
        settings: {
          table_id: 'table_2',
        },
        table_id: 'table_2',
        column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
        editable: false,
        position: 3,
        transmitted: false,
        default: '',
        displayed: true,
        required: false,
        sort: 'DESC',
        table_column_id: '',
        table_view_id: 'table_view_2',
        style: {},
      },
    ],
  },
}

const mockMapSetBlockWithSources = {
  id: '0001',
  settings: {
    addAllowed: true,
    addButtonTitle: 'Create a new element',
    addSourceId: 'table_view_1',
    sources: [
      {
        id: 'table_view_1',
        field: 'geo_column',
        popup: true,
        popupSettings: {
          title: 'string_1_column',
          pageDetailId: '2',
          contentFields: [
            {
              field: 'string_1_column',
              class: 'primary',
            },
          ],
        },
      },
      {
        id: 'table_view_2',
      },
      {
        id: 'table_view_1',
      },
    ],
  },
  title: 'My map block',
  type: BLOCK_TYPE.MAP_SET,
  position: 1,
  container_id: '11',
  definition: mockDefinitions,
}

const mockMapSetBlockWithoutAnySource = {
  id: '0002',
  settings: {
    sources: [],
  },
  title: 'My map block',
  type: BLOCK_TYPE.MAP_SET,
  position: 1,
  container_id: '11',
}

const mockPages = {
  1: {
    id: '1',
    text: 'Page 1',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C1',
    position: 1,
    hidden: false,
    containers: [
      {
        id: '11',
        text: 'My first container',
        createdAt: '2020-11-02T16:11:03.109Z',
        updatedAt: '2020-11-02T16:11:03.109Z',
        page_id: '1',
        position: 1,
        display_title: false,
        displayed_in_navbar: false,
        blocks: [mockMapSetBlockWithoutAnySource],
      },
    ],
  },
  2: {
    id: '2',
    text: 'Page 2',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C2',
    position: 2,
    hidden: true,
    containers: [],
  },
  3: {
    id: '3',
    text: 'Page 3',
    createdAt: '2020-11-02T16:11:03.109Z',
    updatedAt: '2020-11-02T16:11:03.109Z',
    chapter_id: 'C1',
    position: 2,
    hidden: true,
    containers: [],
  },
}

const defaultWrapperParams = {
  mocks: {
    t: key => key,
    $t: key => key,
    $toast: {
      add: jest.fn(),
    },
  },
}

describe('Update block form', () => {
  describe('Map settings', () => {
    describe('Manage a block with predefined sources', () => {
      it('Check that the right data are passed to the inputs', () => {
        // Mount the component
        const wrapper = mount(UpdateBlockForm, {
          ...defaultWrapperParams,
          propsData: {
            block: mockDeepCloneObject(mockMapSetBlockWithSources),
            relatedChapterPages: [
              mockPages['2'], mockPages['3'],
            ],
          },
        })
        const mapSettingsWrapper = wrapper.findComponent(MapSettingsFields)
        // Map settings
        expect(wrapper.find('#add-allowed').props('value')).toBe(true)
        expect(wrapper.find('#add-button-title').props('value')).toBe('Create a new element')
        expect(wrapper.find('#add-source-id').props('options')).toHaveLength(2)
        expect(wrapper.find('#add-source-id').props('options')).toEqual([
          { text: 'table_view_1_name', value: 'table_view_1' },
          { text: 'table_view_2_name', value: 'table_view_2' },
        ])
        expect(wrapper.find('#add-source-id').props('options')).toHaveLength(2)
        expect(wrapper.find('#add-source-id').props('value')).toBe('table_view_1')
        // Map source settings
        const sourcesConfigurations = wrapper.findAll('.source-configuration')
        expect(sourcesConfigurations).toHaveLength(3)
        const firstSourceWrapper = sourcesConfigurations.at(0)
        // First source settings
        expect(mapSettingsWrapper.vm.sourcesOptions[0].tableView).toStrictEqual({
          text: 'table_view_1_name',
          value: 'table_view_1',
        })
        expect(mapSettingsWrapper.vm.sourcesOptions[0].field).toStrictEqual({
          text: 'Point',
          value: 'geo_column',
        })
        expect(firstSourceWrapper.find('#source-selectable-0').props('value')).toBeFalsy()
        expect(firstSourceWrapper.find('#source-popup-0').props('value')).toBe(true)
        expect(mapSettingsWrapper.vm.sourcesOptions[0].popupTitle).toStrictEqual({
          text: 'Name',
          value: 'string_1_column',
        })
        expect(firstSourceWrapper.find('#source-popup-detail-page-0').props('value')).toBe('2')
        expect(firstSourceWrapper.find('#source-popup-on-hover-0').props('value')).toBeFalsy()
        expect(firstSourceWrapper.find('#source-popup-on-hover-0').props('value')).toBeFalsy()
        expect(mapSettingsWrapper.vm.sourcesOptions[0].popupFields[0]).toStrictEqual({
          text: 'Name',
          value: 'string_1_column',
        })
        expect(firstSourceWrapper.find('#source-popup-content-style-0-0').props('value')).toBe('primary')
        // Second source
        expect(mapSettingsWrapper.vm.sourcesOptions[1].tableView).toStrictEqual({
          text: 'table_view_2_name',
          value: 'table_view_2',
        })
      })
    })
    describe('Manage a block without predefined sources', () => {
      let wrapper, spyOnFormSubmit, lckForm

      beforeEach(() => {
        // Mount the component
        wrapper = mount(UpdateBlockForm, {
          ...defaultWrapperParams,
          propsData: {
            block: mockDeepCloneObject(mockMapSetBlockWithoutAnySource),
            relatedChapterPages: [
              mockPages['2'], mockPages['3'],
            ],
          },
        })
        // Spy on events emitted by the tested component
        spyOnFormSubmit = jest.spyOn(wrapper.vm, '$emit')
        // Main form
        lckForm = wrapper.findComponent(LckForm)
      })

      it('Manage the button to add an element from a specific table view', async () => {
        // By default, check that the related inputs are not yet displayed
        expect(wrapper.find('#add-button-title').exists()).toBe(false)
        expect(wrapper.find('#add-source-id').exists()).toBe(false)

        // Display the related inputs if we want to allow to add elements from this component
        await wrapper.find('#add-allowed').vm.$emit('input', true)
        const addButtonTitleInput = wrapper.find('#add-button-title')
        const addSourceIdInput = wrapper.find('#add-source-id')
        expect(addButtonTitleInput.exists()).toBe(true)
        expect(addSourceIdInput.exists()).toBe(true)
        // The add source id input has no option and is disabled because no source has been added yet
        expect(addSourceIdInput.props('options')).toHaveLength(0)
        expect(addSourceIdInput.props('disabled')).toBe(true)
        expect(addSourceIdInput.props('placeholder')).toBe('pages.workspace.block.map.noConfiguredSource')
        // Set a label for the add button
        await addButtonTitleInput.vm.$emit('input', 'Add a new element')

        // Add a source
        await wrapper.find('.add-source-button').vm.$emit('click')
        const sourceIdInput = wrapper.find('#source-id-0')
        expect(sourceIdInput.exists()).toBe(true)
        await sourceIdInput.vm.$emit('item-select', { value: { value: 'myFirstSourceId', text: 'myFirstSourceName' } })
        // The add source id input has one option and is not disabled anymore because a source has now been added
        expect(addSourceIdInput.props('disabled')).toBe(false)
        expect(addSourceIdInput.props('options')).toHaveLength(1)
        expect(addSourceIdInput.props('placeholder')).toBe('pages.workspace.block.map.selectOneSource')
        // So we select the added source
        await addSourceIdInput.vm.$emit('input', 'myFirstSourceId')
        // Submit the form
        await lckForm.vm.$emit('submit')
        expect(spyOnFormSubmit).toHaveBeenLastCalledWith('input', {
          blockToEdit: {
            ...mockMapSetBlockWithoutAnySource,
            settings: {
              addAllowed: true,
              addButtonTitle: 'Add a new element',
              addSourceId: 'myFirstSourceId',
              sources: [
                {
                  id: 'myFirstSourceId',
                },
              ],
            },
          },
          blockRefreshRequired: true,
        })

        // Remove the source
        const deleteSourceButton = wrapper.find('.source-configuration > summary .delete-button')
        await deleteSourceButton.vm.$emit('click')
        // Submit the form
        await lckForm.vm.$emit('submit')
        expect(spyOnFormSubmit).toHaveBeenLastCalledWith('input', {
          blockToEdit: {
            ...mockMapSetBlockWithoutAnySource,
            settings: {
              addAllowed: true,
              addButtonTitle: 'Add a new element',
              addSourceId: undefined,
              sources: [],
            },
          },
          blockRefreshRequired: false,
        })

        // Simulate that we don't want anymore to allow to add elements from this component
        await wrapper.find('#add-allowed').vm.$emit('input', false)
        // Check that the related inputs are not displayed anymore
        expect(wrapper.find('#add-button-title').exists()).toBe(false)
        expect(wrapper.find('#add-source-id').exists()).toBe(false)
        // Submit the form
        await lckForm.vm.$emit('submit')
        expect(spyOnFormSubmit).toHaveBeenLastCalledWith('input', {
          blockToEdit: {
            ...mockMapSetBlockWithoutAnySource,
            settings: {
              addAllowed: false,
              addButtonTitle: undefined,
              addSourceId: undefined,
              sources: [],
            },
          },
          blockRefreshRequired: false,
        })
      })

      it('Manage the source settings', async () => {
        // By default, check that the related inputs are not yet displayed
        expect(wrapper.find('.source-configuration').exists()).toBe(false)

        // Display the related inputs if we want to add a new source
        await wrapper.find('.add-source-button').vm.$emit('click')
        const sourceConfigurationFieldSet = wrapper.find('.source-configuration')
        expect(sourceConfigurationFieldSet.exists()).toBe(true)
        const sourceIdInput = sourceConfigurationFieldSet.find('#source-id-0')
        const sourceFieldInput = sourceConfigurationFieldSet.find('#source-field-0')
        const sourceSelectableInput = sourceConfigurationFieldSet.find('#source-selectable-0')
        const sourcePopupInput = sourceConfigurationFieldSet.find('#source-popup-0')
        // We can't select a field as the source as not be chosen
        expect(sourceFieldInput.attributes('disabled')).toBeTruthy()
        expect(sourceFieldInput.attributes('placeholder')).toBe('pages.workspace.block.map.noSelectedView')

        // By default, the pop-up fields are not displayed
        expect(sourceConfigurationFieldSet.find('.popup-configuration').exists()).toBe(false)
        // Set the source configuration
        // > Choose a table view to display
        await sourceIdInput.vm.$emit('item-select', { value: { value: 'myFirstSourceId', text: 'myFirstSourceName' } })
        // > Choose a table field to display
        expect(sourceFieldInput.attributes('disabled')).toBeFalsy()
        expect(sourceFieldInput.attributes('placeholder')).toBe('components.datatable.autoCompletePlaceholder')
        await sourceFieldInput.vm.$emit('item-select', { value: { value: 'myFirstFieldId', text: 'myFirstFieldName' } })
        // > Make the source selectable
        await sourceSelectableInput.vm.$emit('input', true)
        // > Display a pop-up
        await sourcePopupInput.vm.$emit('input', true)
        const sourcePopupConfiguration = sourceConfigurationFieldSet.find('.popup-configuration')
        expect(sourcePopupConfiguration.exists()).toBe(true)
        // Set the pop-up configuration
        // > Set the title
        const sourcePopupTitleInput = wrapper.find('#source-popup-title-0')
        await sourcePopupTitleInput.vm.$emit('item-select', {
          value: { value: 'mySecondFieldId', text: 'mySecondFieldName' },
        })
        // > Choose a page to redirect on pop-up click
        const sourcePopupDetailPageInput = wrapper.find('#source-popup-detail-page-0')
        expect(sourcePopupDetailPageInput.props('options')).toStrictEqual([
          expect.objectContaining({
            text: mockPages['2'].text,
            id: mockPages['2'].id,
          }),
          expect.objectContaining({
            text: mockPages['3'].text,
            id: mockPages['3'].id,
          }),
        ])
        await sourcePopupDetailPageInput.vm.$emit('input', mockPages['2'].id)
        // > Display the pop-up on hover
        const sourcePopupOnHover = wrapper.find('#source-popup-on-hover-0')
        await sourcePopupOnHover.vm.$emit('input', true)
        // > Display two fields in the pop-up
        await wrapper.find('.add-popup-content-button').vm.$emit('click')
        await wrapper.find('.add-popup-content-button').vm.$emit('click')
        const sourcePopupContentField1 = wrapper.find('#source-popup-content-field-0-0')
        const sourcePopupContentStyle1 = wrapper.find('#source-popup-content-style-0-0')
        await sourcePopupContentField1.vm.$emit('item-select', {
          value: { value: 'myThirdFieldId', text: 'myThirdFieldName' },
        })
        const sourcePopupContentField2 = wrapper.find('#source-popup-content-field-0-1')
        await sourcePopupContentField2.vm.$emit('item-select', {
          value: { value: 'myFourthFieldId', text: 'myFourthFieldName' },
        })
        await sourcePopupContentStyle1.vm.$emit('input', 'primary')
        // Submit the form
        await lckForm.vm.$emit('submit')
        const savedBlock = {
          ...mockMapSetBlockWithoutAnySource,
          settings: {
            sources: [
              {
                id: 'myFirstSourceId',
                field: 'myFirstFieldId',
                selectable: true,
                popup: true,
                popupSettings: {
                  title: 'mySecondFieldId',
                  pageDetailId: mockPages['2'].id,
                  onHover: true,
                  contentFields: [
                    {
                      field: 'myThirdFieldId',
                      class: 'primary',
                    },
                    {
                      field: 'myFourthFieldId',
                    },
                  ],
                },
              },
            ],
          },
        }
        expect(spyOnFormSubmit).toHaveBeenLastCalledWith('input', {
          blockToEdit: savedBlock,
          blockRefreshRequired: true,
        })
        // Choose the same source
        await sourceIdInput.vm.$emit('item-select', { value: { value: 'myFirstSourceId', text: 'myFirstSourceName' } })
        await lckForm.vm.$emit('submit')
        expect(spyOnFormSubmit).toHaveBeenLastCalledWith('input', {
          blockToEdit: savedBlock,
          blockRefreshRequired: false,
        })

        // Remove one field from the pop-up content
        const sourcePopupContentRemove1 = wrapper.find('.popup-field .delete-button')
        await sourcePopupContentRemove1.vm.$emit('click')
        await lckForm.vm.$emit('submit')
        expect(spyOnFormSubmit).toHaveBeenLastCalledWith('input', {
          blockToEdit: {
            ...mockMapSetBlockWithoutAnySource,
            settings: {
              sources: [
                {
                  id: 'myFirstSourceId',
                  field: 'myFirstFieldId',
                  selectable: true,
                  popup: true,
                  popupSettings: {
                    title: 'mySecondFieldId',
                    pageDetailId: mockPages['2'].id,
                    onHover: true,
                    contentFields: [
                      {
                        field: 'myFourthFieldId',
                      },
                    ],
                  },
                },
              ],
            },
          },
          blockRefreshRequired: false,
        })

        // Clear the source
        await sourceIdInput.vm.$emit('clear')

        // Submit the form
        await lckForm.vm.$emit('submit')
        expect(spyOnFormSubmit).toHaveBeenLastCalledWith('input', {
          blockToEdit: {
            ...mockMapSetBlockWithoutAnySource,
            settings: {
              sources: [{
                id: '',
              }],
            },
          },
          blockRefreshRequired: false,
        })
      })
    })
  })
})
