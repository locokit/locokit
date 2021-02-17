import registerRequireContextHook from 'babel-plugin-require-context-hook/register'

// eslint-disable-next-line @typescript-eslint/no-empty-function
global.URL.createObjectURL = () => {}
registerRequireContextHook()
