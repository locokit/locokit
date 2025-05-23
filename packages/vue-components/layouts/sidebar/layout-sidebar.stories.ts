import type { Meta, StoryObj } from '@storybook/vue3'

import LayoutSidebar from './layout-sidebar.vue'

const meta: Meta<typeof LayoutSidebar> = {
  title: 'layouts/sidebar',
  component: LayoutSidebar,
}

export default meta
type Story = StoryObj<typeof LayoutSidebar>

export const Default: Story = {
  render: () => ({
    components: { LayoutSidebar },
    template: `
      <layout-sidebar>
        <template #sidebar-title>
          <h3>
            <i class="bi bi-window-sidebar"></i>
            My Workspace
          </h3>
        </template>
        <p>This is a layout sidebar</p>
        <h2>
          Loco<span class="text-secondary font-bold">Kit</span>
        </h2>
      </layout-sidebar>
    `,
  }),
}
export const Mobile: Story = {
  render: () => ({
    components: { LayoutSidebar },
    template: `
      <layout-sidebar>
        <template #sidebar-nav="{ closeSidebar }">
          <button @click="closeSidebar">Close sidebar button</button>
        </template>
        <p>This is a layout sidebar</p>
      </layout-sidebar>
    `,
  }),
  parameters: {
    // 👇 Override default viewport for this story
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const SidebarOverflow: Story = {
  render: () => ({
    components: { LayoutSidebar },
    template: `
      <div class="h-[200px]">
        <layout-sidebar>
          <template #sidebar-nav>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
              <li>Item 4</li>
              <li>Item 5</li>
              <li>Item 6</li>
              <li>Item 7</li>
              <li>Item 8</li>
              <li>Item 9</li>
              <li>Item 10</li>
              <li>Item 11</li>
              <li>Item 12</li>
              <li>Item 13</li>
              <li>Item 14</li>
            </ul>
          </template>
        </layout-sidebar>
      </div>
    `,
  }),
}

export const WithMenuItems: Story = {
  render: () => ({
    components: { LayoutSidebar },
    template: `
      <layout-sidebar>
        <template #sidebar-nav="{ closeSidebar }">
          <ul class="pl-2">
            <li class="mb-2">
              <a @click="closeSidebar" class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <i class="bi bi-graph-up-arrow text-xl"></i>
                  Dashboards
                </span>
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
            <li class="mb-2">
              <a @click="closeSidebar" class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <i class="bi bi-database-fill text-xl"></i>
                  Datasources
                </span>
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
            <li class="mb-2">
              <a @click="closeSidebar" class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <i class="bi bi-window text-xl"></i>
                  Applications
                </span>
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </template>
        <p>This is a layout sidebar</p>
      </layout-sidebar>
    `,
  }),
}
