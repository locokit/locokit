import { app } from './src/app'

// Load our database connection info from the app configuration
const config = app.get('settings').db

module.exports = config
