import { Ability, AbilityClass } from '@casl/ability'

export type Actions = 'find' | 'get' | 'create' | 'update' | 'patch' | 'remove' | 'manage' | 'read' | 'delete'
type Subjects = 'workspace' | 'user' | 'group'

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>

// export const resolveAction = createAliasResolver({
//   update: 'patch', // define the same rules for update & patch
//   read: ['get', 'find'], // use 'read' as a equivalent for 'get' & 'find'
//   delete: 'remove' // use 'delete' or 'remove'
// })

export default new Ability([])
