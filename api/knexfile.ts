import { createApp } from './src/app'

const app = createApp()
// Load our database connection info from the app configuration
const config = app.get('settings').db

module.exports = config
