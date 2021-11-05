const bcrypt = require('bcryptjs')
async function hash () {
  const hashPassword = await bcrypt.hash('DVH19p6B67983455', 10)
  console.log(hashPassword)
}

hash()
