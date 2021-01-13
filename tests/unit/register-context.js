import registerRequireContextHook from 'babel-plugin-require-context-hook/register'

global.URL.createObjectURL = () => {}
registerRequireContextHook()
