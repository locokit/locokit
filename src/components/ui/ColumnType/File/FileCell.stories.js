/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
import FileCell from './Cell.vue'

export default {
  title: 'components/ui/ColumnType/File/Cell',
  component: FileCell,
  parameters: {
    docs: {
      description: `
        FILE columns are used in the DataTable and DataDetail components.
        Here are some examples using this column type in several use case.
      `
    }
  }
}

export const defaultStory = () => (
  {
    components: { FileCell },
    template: '<div style="width: 200px; height: 2rem; border: 1px solid gray;"><file-cell /></div>'
  }
)

defaultStory.storyName = 'default'

export const afterClickOnIt = () => (
  {
    components: { FileCell },
    template: `
      <div style="width: 200px; height: 2rem; border: 1px solid gray;">
        <file-cell
          ref="fileCell"
          title="this is the dialog title"
        />
      </div>
    `,
    async mounted () {
      await this.$refs.fileCell.$el.click()
    }
  }
)

afterClickOnIt.storyName = 'after click'
afterClickOnIt.args = {
  waitForSelector: '.p-dialog'
}

export const afterClickOnItDisabled = () => (
  {
    components: { FileCell },
    template: `
      <div style="width: 200px; height: 2rem; border: 1px solid gray;">
        <file-cell
          ref="fileCell"
          title="this is the dialog title"
          :disabled="true"
        />
      </div>
    `,
    async mounted () {
      await this.$refs.fileCell.$el.click()
    }
  }
)

afterClickOnItDisabled.storyName = 'after click (disabled)'
afterClickOnIt.args = {
  waitForSelector: '.p-dialog'
}

const attachments = [{
  id: 4,
  filepath: '',
  filename: 'logokit-grayscale.png',
  mime: 'image/png',
  thumbnail: true,
  workspace_id: ''
}, {
  id: 5,
  filepath: '',
  filename: LCK_THEME.LOGO_BG_PRIMARY_URL,
  mime: 'image/png',
  thumbnail: false,
  workspace_id: ''
}, {
  id: 1,
  filepath: '',
  filename: 'document.pdf',
  mime: 'application/pdf',
  thumbnail: false,
  workspace_id: ''
}, {
  id: 2,
  filepath: '',
  filename: 'testing-file.txt',
  mime: 'application/vnd.oasis.opendocument.text',
  thumbnail: false,
  workspace_id: ''
}, {
  id: 3,
  filepath: '',
  filename: 'testing-file.ods',
  mime: 'application/vnd.oasis.opendocument.spreadsheet',
  thumbnail: false,
  workspace_id: ''
}]

export const withAttachments = () => (
  {
    components: { FileCell },
    data () {
      return {
        attachments
      }
    },
    template: `
      <div style="width: 200px; height: 2rem; border: 1px solid gray;">
        <file-cell
          ref="fileCell"
          title="this is the dialog title"
          :attachments="attachments"
          workspaceId="themes/locokit/img"
        />
      </div>
    `
  }
)

withAttachments.storyName = 'with attachments'

export const withAttachmentsAndOverflow = () => (
  {
    components: { FileCell },
    data () {
      return {
        attachments
      }
    },
    template: `
      <div style="width: 100px; height: 2rem; border: 1px solid gray;">
        <file-cell
          ref="fileCell"
          title="this is the dialog title"
          :attachments="attachments"
          workspaceId="themes/locokit/img"
        />
      </div>
    `
  }
)

withAttachmentsAndOverflow.storyName = 'with attachments and overflow'

export const withAttachmentsAfterClickOnIt = () => (
  {
    components: { FileCell },
    data () {
      return {
        attachments
      }
    },
    template: `
      <div style="width: 200px; height: 2rem; border: 1px solid gray;">
        <file-cell
          ref="fileCell"
          title="this is the dialog title"
          :attachments="attachments"
        />
      </div>
    `,
    async mounted () {
      await this.$refs.fileCell.$el.click()
    }
  }
)

withAttachmentsAfterClickOnIt.storyName = 'after click with attachments'
withAttachmentsAfterClickOnIt.args = {
  waitForSelector: '.p-dialog'
}

export const withAttachmentsAfterClickOnItDisabled = () => (
  {
    components: { FileCell },
    data () {
      return {
        attachments
      }
    },
    template: `
      <div style="width: 200px; height: 2rem; border: 1px solid gray;">
        <file-cell
          ref="fileCell"
          title="this is the dialog title"
          :attachments="attachments"
          :disabled="true"
        />
      </div>
    `,
    async mounted () {
      await this.$refs.fileCell.$el.click()
    }
  }
)

withAttachmentsAfterClickOnItDisabled.storyName = 'after click with attachments (disabled)'
withAttachmentsAfterClickOnItDisabled.args = {
  waitForSelector: '.p-dialog'
}
