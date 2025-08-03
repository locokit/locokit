import { SERVICES, USER_PROFILE } from '@locokit/shared'
import { Application, HookContext, NextFunction } from '@/declarations'
import { UserSignUpService } from './user-signup.class'
import { validateData } from '@feathersjs/schema/lib'
import { userSignUpDataSchema, userSignUpDataValidator } from './user-signup.schema'
import pkg from 'feathers-swagger'
import { setLocoKitContext } from '@/hooks/locokit'
import { authenticate } from '@feathersjs/authentication'
import { transaction } from '@/feathers-objection'
import { checkUserWorkspaceAccess } from '@/hooks/locokit/access'
import { Forbidden } from '@feathersjs/errors'

const { createSwaggerServiceOptions } = pkg

// Add this service to the service type index
declare module '@/declarations' {
  interface ServiceTypes {
    [SERVICES.WORKSPACE_USER_SIGNUP]: UserSignUpService
  }
}

export function userSignup(app: Application): void {
  // Initialize our service with any options it requires
  app.use(SERVICES.WORKSPACE_USER_SIGNUP, new UserSignUpService(app), {
    methods: ['create'],
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { createRequest: userSignUpDataSchema, createResponse: userSignUpDataSchema },
      docs: {
        description:
          'Workspace user signup service, allow workspace owner to create an account without sending email',
        tag: 'workspace > user-signup',
      },
    }),
  })

  app.service(SERVICES.WORKSPACE_USER_SIGNUP).hooks({
    around: {
      all: [
        authenticate('jwt'),
        setLocoKitContext,
        /**
         * Check user is an ADMIN or the owner
         */
        checkUserWorkspaceAccess,
        async function computeAbilities(context: HookContext, next: NextFunction) {
          if (
            context.params.user.profile !== USER_PROFILE.ADMIN &&
            !context.params.$workspace.creator
          ) {
            throw new Forbidden('You cannot access this endpoint.')
          }
          await next()
        },
      ],
    },
    before: {
      create: [transaction.start(), validateData(userSignUpDataValidator)],
    },
    after: {
      all: [transaction.end()],
    },
  })
}
