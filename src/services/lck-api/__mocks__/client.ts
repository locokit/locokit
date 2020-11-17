/* eslint-disable @typescript-eslint/camelcase */
export const lckClient = {
  reAuthenticate: () => ({
    accessToken: 'jeSuisUnToken',
    authentication: {
      strategy: 'jwt',
      accessToken: 'jeSuisUnToken'
    },
    user: {
      name: 'FirstName LASTNAME',
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
      name: 'FirstName LASTNAME',
      email: 'email@email.email',
      profile: 'SUPERADMIN'
    }
  }),
  service: () => ({})
}
