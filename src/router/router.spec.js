import router, { checkPathAvailable } from './index'
import { authState } from '../store/auth'

jest.mock('@/services/lck-api')
jest.mock('@/views/routes/Home.vue', () => ({
  name: 'Home',
  render: h => h('section'),
}))

jest.mock('@/views/routes/workspace/admin/database/Database.vue', () => ({
  name: 'Database',
  render: h => h('section'),
}))

jest.mock('@/views/routes/workspace/admin/database/DatabaseSchema.vue', () => ({
  name: 'DatabaseSchema',
  render: h => h('section'),
}))

jest.mock('@/views/routes/workspace/visualization/Page.vue', () => ({
  name: 'Page',
  render: h => h('section'),
}))

jest.mock('@/views/routes/workspace/visualization/Workspace.vue', () => ({
  name: 'Workspace',
  render: h => h('section'),
}))

jest.mock('@/views/routes/workspace/visualization/WorkspaceList.vue', () => ({
  name: 'WorkspaceList',
  render: h => h('section'),
}))

describe('Router', () => {
  it('should always have access to home', () => {
    router.push('/')
    expect(router.history.current.path).toEqual('/')
    expect(router.getMatchedComponents('/')[0].name).toEqual('Home')
  })

  it('should redirect to home page if user not authenticated ', () => {
    router.push('workspace')
    expect(router.history.current.path).not.toEqual('/workspace')
    expect(router.getMatchedComponents()[0].name).not.toBe('WorkspaceList')
    expect(router.history.current.path).toEqual('/')
    expect(router.getMatchedComponents()[0].name).toBe('Home')
  })

  it('should allow access to the page (with user authenticated)', () => {
    authState.data.isAuthenticated = true
    router.push('workspace')
    expect(router.history.current.path).toEqual('/workspace')
    expect(router.getMatchedComponents()[0].name).toBe('WorkspaceList')
    expect(router.history.current.path).not.toEqual('/')
    expect(router.getMatchedComponents()[0].name).not.toBe('Home')
    authState.data.isAuthenticated = false
  })

  it('test each condition of checkPathAvailable', () => {
    expect(checkPathAvailable(false, false, false)).toEqual(true)
    expect(checkPathAvailable(false, false, true)).toEqual(true)
    expect(checkPathAvailable(true, false, false)).toEqual(false)
    expect(checkPathAvailable(true, false, true)).toEqual(true)
    expect(checkPathAvailable(false, true, false)).toEqual(true)
    expect(checkPathAvailable(false, true, true)).toEqual(false)
    expect(() => {
      checkPathAvailable(true, true, false)
    }).toThrow()
    expect(() => {
      checkPathAvailable(true, true, true)
    }).toThrow()
  })
})
