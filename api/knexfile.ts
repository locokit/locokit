require('dotenv').config();

module.exports = {
  client: "pg",
  connection: process.env.NODE_ENV === 'test' ? process.env.LCK_DATABASE_URL_TEST : process.env.LCK_DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts'
  },
  seeds: {
    recursive: true
  }
};
