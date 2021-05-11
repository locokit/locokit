export default {
  title: 'theme/Forms',
  parameters: {
    docs: {
      description: `
        Some examples for input forms with current theme.
      `
    }
  }
}

export const defaultStory = () => ({
  template: `
  <div>
    <p>
      Input type text<br/>
      <input type="text" value="hello locokit" />
    </p>
    <p>
      Input type number<br/>
      <input type="number" value="123" />
    </p>
    <p>
      Textarea<br/>
      <textarea>This is an example of a textarea</textarea>
    </p>
  </div>
  `
})
defaultStory.storyName = 'headings'
