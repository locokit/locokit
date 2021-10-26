export default {
  title: 'theme/Colors',
  parameters: {
    docs: {
      description: `
        The current theme's colors.
      `,
    },
  },

}

export const defaultStory = () => ({
  template: `
  <div>
    <h3>Primary colors</h3>
    primary-color
    <p style="background-color: var(--primary-color); color: var(--text-color-secondary); padding: 1rem;" />
    primary-color-light
    <p style="background-color: var(--primary-color-light); color: var(--text-color-secondary); padding: 1rem;" />
    primary-color-lighten
    <p style="background-color: var(--primary-color-lighten); color: var(--text-color-secondary); padding: 1rem;" />
    primary-color-very-lighten
    <p style="background-color: var(--primary-color-very-lighten); color: var(--text-color-secondary); padding: 1rem;" />
    primary-color-darken
    <p style="background-color: var(--primary-color-darken); color: var(--text-color-secondary); padding: 1rem;" />
    <h3>Secondary colors</h3>
    secondary-color
    <p style="background-color: var(--secondary-color); color: var(--text-color-secondary); padding: 1rem;" />
    secondary-color-light
    <p style="background-color: var(--secondary-color-light); color: var(--text-color-secondary); padding: 1rem;" />
    secondary-color-lighten
    <p style="background-color: var(--secondary-color-lighten); color: var(--text-color-secondary); padding: 1rem;" />
    secondary-color-very-lighten
    <p style="background-color: var(--secondary-color-very-lighten); color: var(--text-color-secondary); padding: 1rem;" />
    secondary-color-darken
    <p style="background-color: var(--secondary-color-darken); color: var(--text-color-secondary); padding: 1rem;" />
  </div>
  `,
})
defaultStory.storyName = 'main'

export const surfaces = () => ({
  template: `
  <div>
    surface-a
    <p style="background-color: var(--primary-color); color: var(--primary-color-text); padding: 1rem;" />
    surface-b
    <p style="background-color: var(--primary-color); color: var(--primary-color-text); padding: 1rem;" />
    surface-c
    <p style="background-color: var(--surface-c); color: var(--primary-color-text); padding: 1rem;" />
    surface-d
    <p style="background-color: var(--surface-d); color: var(--primary-color-text); padding: 1rem;" />
    surface-e
    <p style="background-color: var(--surface-e); color: var(--primary-color-text); padding: 1rem;" />
    surface-f
    <p style="background-color: var(--surface-f); color: var(--primary-color-text); padding: 1rem;" />
    surface-w
    <p style="background-color: var(--surface-w); color: var(--primary-color-text); padding: 1rem;" />
    surface-lck-1
    <p style="background-color: var(--surface-lck-1); color: var(--primary-color-text); padding: 1rem;" />
    surface-lck-2
    <p style="background-color: var(--surface-lck-2); color: var(--primary-color-text); padding: 1rem;" />
  </div>
  `,
})
surfaces.storyName = 'surfaces'

export const semaphore = () => ({
  template: `
  <div>
    color-warning
    <p style="background-color: var(--color-warning); color: var(--primary-color-text); padding: 1rem;" />
    color-warning-light
    <p style="background-color: var(--color-warning-light); color: var(--primary-color-text); padding: 1rem;" />
    color-error
    <p style="background-color: var(--color-error); color: var(--primary-color-text); padding: 1rem;" />
    color-error-light
    <p style="background-color: var(--color-error-light); color: var(--primary-color-text); padding: 1rem;" />
    color-success
    <p style="background-color: var(--color-success); color: var(--primary-color-text); padding: 1rem;" />
    color-success-light
    <p style="background-color: var(--color-success-light); color: var(--primary-color-text); padding: 1rem;" />
  </div>
  `,
})
semaphore.storyName = 'semaphore'
