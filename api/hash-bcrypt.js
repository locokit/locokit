const bcrypt = require('bcryptjs')

console.log(`
*************************************
      Tool for password hash

Could be used for generating hash
and inject them in database directly.

*************************************
`)

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`

Syntax :

node hash-bcrypt.js [stringA] [stringB] ...

Example :

node hash-bcrypt.js pouet pouic
`)
}

async function hash (...args) {
  args.forEach(async currentString => {
    const hashPassword = await bcrypt.hash('nzIYNbUCgMG1PEGnoTei', 10)
    console.log('Hash for string "' + currentString + '" : ', hashPassword)
  })
}
hash(...process.argv.slice(2))
