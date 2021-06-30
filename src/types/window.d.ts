import { Environment } from 'monaco-editor-core/esm/vs/editor/editor.api.js'

declare global {
  interface Window {
    MonacoEnvironment: Environment;
  }
}

export default Window
