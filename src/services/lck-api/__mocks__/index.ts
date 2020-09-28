/* eslint-disable @typescript-eslint/camelcase */
export default {
  reAuthenticate: () => ({
    accessToken: 'jeSuisUnToken',
    authentication: {
      strategy: 'jwt',
      accessToken: 'jeSuisUnToken'
    },
    user: {
      name: 'FirstName LastName',
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
      name: 'FirstName LastName',
      email: 'email@email.email',
      profile: 'SUPERADMIN'
    }
  }),
  service: () => ({})
}
