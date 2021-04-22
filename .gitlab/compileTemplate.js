const nunjucks = require('nunjucks')
const fs = require('fs')

console.log('Creating environment variables')
const envVars = {
  lck_app_title: process.env.VUE_APP_TITLE,
  lck_app_theme: process.env.VUE_APP_THEME,
}
console.log('Compiling dist/index.html')
const indexHTML = nunjucks.render('dist/index.html', envVars)

console.log('Writing dist/index.html')
fs.writeFileSync('dist/index.html', indexHTML)
