import { GROUP_ROLE } from '@locokit/lck-glossary'
import app from '../../app'
import { group as LckGroup } from '../../models/group.model'
import { User as LckUser } from '../../models/user.model'

let group: LckGroup
let user: LckUser
describe('\'usergroup\' service', () => {
  beforeAll(async () => {
    group = await app.service('group').create({
      name: 'user group test'
    })
    user = await app.service('user').create({
      name: 'user group test',
      email: 'hello1@world.com',
      password: 'yo'
    })
  })
  it('registered the service', () => {
    const service = app.service('usergroup')
    expect(service).toBeTruthy()
  })

  it('throw if user_id doesn\'t exist', async () => {
    const service = app.service('usergroup')
    expect.assertions(1)
    await expect(service.create({
      group_id: group.id
    })).rejects.toThrow()
  })
  it('throw if group_id doesn\'t exist', async () => {
    const service = app.service('usergroup')
    expect.assertions(1)
    await expect(service.create({
      user_id: user.id
    })).rejects.toThrow()
  })
  it('throw if group_id doesn\'t exist', async () => {
    const service = app.service('usergroup')
    expect.assertions(3)
    const uhg = await service.create({
      user_id: user.id,
      group_id: group.id
    })
    expect(uhg.uhg_role).toBe(GROUP_ROLE.MEMBER)
    expect(uhg.user_id).toBe(user.id)
    expect(uhg.group_id).toBe(group.id)
  })

  afterAll(async () => {
    await app.service('user').remove(user.id)
    await app.service('group').remove(group.id)
  })
})
