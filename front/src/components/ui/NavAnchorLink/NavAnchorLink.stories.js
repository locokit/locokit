/* eslint-disable @typescript-eslint/camelcase */

import NavAnchorLink from './NavAnchorLink'

export default {
  title: 'components/ui/NavAnchorLink',
  component: NavAnchorLink,
}

export const DefaultStory = () => ({
  components: { NavAnchorLink },
  template: '<NavAnchorLink />',
  methods: { },
})
DefaultStory.storyName = 'default'

const Template = (args, { argTypes }) => ({
  components: { NavAnchorLink },
  props: Object.keys(argTypes),
  template: '<NavAnchorLink v-bind="$props" />',
})

export const EditModeWithContainers = Template.bind({})
EditModeWithContainers.args = {
  containers: [
    {
      id: '1',
      text: 'Hello',
      settings: null,
      page_id: '1',
      position: 0,
      displayed_in_navbar: false,
      anchor_label: null,
      anchor_icon: null,
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
  ],
  editMode: true,
}
EditModeWithContainers.storyName = 'edit mode with containers not display in navbar'

export const NavAnchorActive = Template.bind({})
NavAnchorActive.args = {
  containers: [
    {
      id: '1',
      text: 'Hello',
      settings: null,
      page_id: '1',
      position: 0,
      displayed_in_navbar: true,
      anchor_label: 'Hello',
      anchor_icon: null,
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '2',
      text: 'there',
      settings: null,
      page_id: '1',
      position: 2,
      displayed_in_navbar: true,
      anchor_label: 'there',
      anchor_icon: null,
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '3',
      text: '!',
      settings: null,
      page_id: '1',
      position: 3,
      displayed_in_navbar: true,
      anchor_label: '!',
      anchor_icon: null,
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
  ],
  editMode: false,
}
NavAnchorActive.storyName = 'nav anchor active'

export const EditModeNavAnchorActive = Template.bind({})
EditModeNavAnchorActive.args = {
  ...NavAnchorActive.args,
  editMode: true,
}
EditModeNavAnchorActive.storyName = 'edit mode with nav anchor active'

export const NavAnchorActiveWithLongLabel = Template.bind({})
NavAnchorActiveWithLongLabel.args = {
  containers: [
    {
      id: '1',
      text: 'I am a little too long for this box',
      settings: null,
      page_id: '1',
      position: 0,
      displayed_in_navbar: true,
      anchor_label: 'I am a little too long for this box',
      anchor_icon: null,
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '2',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      settings: null,
      page_id: '1',
      position: 1,
      displayed_in_navbar: true,
      anchor_label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut nibh vel neque auctor gravida. Donec volutpat mauris rutrum blandit sagittis.',
      anchor_icon: null,
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
  ],
}
NavAnchorActiveWithLongLabel.storyName = 'nav anchor active with long label'

export const EditModeNavAnchorActiveWithIcon = Template.bind({})
EditModeNavAnchorActiveWithIcon.args = {
  containers: [
    {
      id: '1',
      text: 'Hello',
      settings: null,
      page_id: '1',
      position: 0,
      displayed_in_navbar: true,
      anchor_label: 'Hello',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
  ],
  editMode: true,
}
EditModeNavAnchorActiveWithIcon.storyName = 'edit mode with containers and icon'

export const NavAnchorActiveWithLongLabelAndIcon = Template.bind({})
NavAnchorActiveWithLongLabelAndIcon.args = {
  containers: [
    {
      id: '1',
      text: 'I am a little too long for this box',
      settings: null,
      page_id: '1',
      position: 0,
      displayed_in_navbar: true,
      anchor_label: 'I am a little too long for this box',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'success',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '2',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      settings: null,
      page_id: '1',
      position: 1,
      displayed_in_navbar: true,
      anchor_label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut nibh vel neque auctor gravida. Donec volutpat mauris rutrum blandit sagittis.',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'success',
      display_title: false,
      elevation: false,
      blocks: [],
    },
  ],
}
NavAnchorActiveWithLongLabelAndIcon.storyName = 'nav anchor active with long label and icon'

export const NavAnchorActiveWithManyContainers = Template.bind({})
NavAnchorActiveWithManyContainers.args = {
  containers: [
    {
      id: '1',
      text: 'Hello',
      settings: null,
      page_id: '1',
      position: 0,
      displayed_in_navbar: true,
      anchor_label: 'Hello',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '2',
      text: 'Bonjour',
      settings: null,
      page_id: '1',
      position: 2,
      displayed_in_navbar: true,
      anchor_label: 'Bonjour',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'secondary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '3',
      text: 'Ciao',
      settings: null,
      page_id: '1',
      position: 3,
      displayed_in_navbar: true,
      anchor_label: 'Ciao',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'success',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '4',
      text: 'Hola',
      settings: null,
      page_id: '1',
      position: 4,
      displayed_in_navbar: true,
      anchor_label: 'Hola',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'warning',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '5',
      text: 'Hallo',
      settings: null,
      page_id: '1',
      position: 5,
      displayed_in_navbar: true,
      anchor_label: 'Hallo',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'danger',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '6',
      text: 'Saluton',
      settings: null,
      page_id: '1',
      position: 6,
      displayed_in_navbar: true,
      anchor_label: 'Saluton',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'primary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '7',
      text: 'Olá',
      settings: null,
      page_id: '1',
      position: 7,
      displayed_in_navbar: true,
      anchor_label: 'Olá',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'secondary',
      display_title: false,
      elevation: false,
      blocks: [],
    },
    {
      id: '8',
      text: 'Bouh',
      settings: null,
      page_id: '1',
      position: 8,
      displayed_in_navbar: true,
      anchor_label: 'On me voit plus',
      anchor_icon: 'bi bi-rainbow',
      anchor_icon_class: 'danger',
      display_title: false,
      elevation: false,
      blocks: [],
    },
  ],
  editMode: false,
}
NavAnchorActiveWithManyContainers.storyName = 'nav anchor active with meny containers'
