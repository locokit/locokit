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
    <p style="background-color: var(--primary-color); color: var(--text-color); padding: 1rem;" />
    primary-color-light
    <p style="background-color: var(--primary-color-light); color: var(--text-color); padding: 1rem;" />
    primary-color-lighten
    <p style="background-color: var(--primary-color-lighten); color: var(--text-color); padding: 1rem;" />
    primary-color-dark
    <p style="background-color: var(--primary-color-dark); color: var(--text-color); padding: 1rem;" />
    <h3>Secondary colors</h3>
    secondary-color
    <p style="background-color: var(--secondary-color); color: var(--text-color); padding: 1rem;" />
    secondary-color-light
    <p style="background-color: var(--secondary-color-light); color: var(--text-color); padding: 1rem;" />
    secondary-color-lighten
    <p style="background-color: var(--secondary-color-lighten); color: var(--text-color); padding: 1rem;" />
    secondary-color-dark
    <p style="background-color: var(--secondary-color-dark); color: var(--text-color); padding: 1rem;" />
  </div>
  `,
})
defaultStory.storyName = 'main'

export const states = () => ({
  template: `
  <div>
    color-warning
    <p style="background-color: var(--color-warning); color: var(--text-color); padding: 1rem;" />
    color-warning-light
    <p style="background-color: var(--color-warning-light); color: var(--text-color); padding: 1rem;" />
    color-warning-lighten
    <p style="background-color: var(--color-warning-lighten); color: var(--text-color); padding: 1rem;" />
    color-warning-dark
    <p style="background-color: var(--color-warning-dark); color: var(--text-color); padding: 1rem;" />

    color-error
    <p style="background-color: var(--color-error); color: var(--text-color); padding: 1rem;" />
    color-error-light
    <p style="background-color: var(--color-error-light); color: var(--text-color); padding: 1rem;" />
    color-error-lighten
    <p style="background-color: var(--color-error-lighten); color: var(--text-color); padding: 1rem;" />
    color-error-dark
    <p style="background-color: var(--color-error-dark); color: var(--text-color); padding: 1rem;" />

    color-success
    <p style="background-color: var(--color-success); color: var(--text-color); padding: 1rem;" />
    color-success-light
    <p style="background-color: var(--color-success-light); color: var(--text-color); padding: 1rem;" />
    color-success-lighten
    <p style="background-color: var(--color-success-lighten); color: var(--text-color); padding: 1rem;" />
    color-success-dark
    <p style="background-color: var(--color-success-dark); color: var(--text-color); padding: 1rem;" />
  </div>
  `,
})
states.storyName = 'states'
