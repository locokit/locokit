/* eslint-disable @typescript-eslint/camelcase */
export default {
  reAuthenticate: () => ({
    accessToken: 'jeSuisUnToken',
    authentication: {
      strategy: 'jwt',
      accessToken: 'jeSuisUnToken'
    },
    user: {
      first_name: 'FirstName',
      last_name: 'LastName',
      email: 'email@email.email',
      profile: 'SUPERADMIN'
    }
  }),
  authenticate: () => ({
    accessToken: 'jeSuisUnToken',
    authentication: {
      strategy: 'local'
    },
    user: {
      first_name: 'FirstName',
      last_name: 'LastName',
      email: 'email@email.email',
      profile: 'SUPERADMIN'
    }
  }),
  service: () => ({})
}
