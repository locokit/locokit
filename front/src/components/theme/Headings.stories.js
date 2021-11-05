export default {
  title: 'theme/Headings',
  parameters: {
    docs: {
      description: `
        Some examples for headings with current theme.
      `,
    },
  },
}

export const defaultStory = () => ({
  template: `
  <div>
    <h6>This is a h6 title</h6>
    <h5>This is a h5 title</h5>
    <h4>This is a h4 title</h4>
    <h3>This is a h3 title</h3>
    <h2>This is a h2 title</h2>
    <h1>This is a h1 title</h1>
    <p>
      This is a paragraph with some text inside.
    </p>
  </div>
  `,
})
defaultStory.storyName = 'headings'
