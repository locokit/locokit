import { queryContainsKey } from './queryContainsKey'

describe('[hook] queryContainsKey', () => {
  it('return false if no param exist', () => {
    const result = queryContainsKey('myKey')({
      type: 'before',
    })
    expect(result).toBe(false);
  })
  it('return false if no query param exist', () => {
    const result = queryContainsKey('myKey')({
      type: 'before',
      params: {
        query: {

        }
      }
    })
    expect(result).toBe(false);
  })
  it('return true if myKey exist', () => {
    const result = queryContainsKey('myKey')({
      type: 'before',
      params: {
        query: {
          myKey: 'here'
        }
      }
    })
    expect(result).toBe(true);
  })
  it('return false if myKey is unset', () => {
    const result = queryContainsKey('myKey')({
      type: 'before',
      params: {
        query: {
          myKey: null
        }
      }
    })
    expect(result).toBe(false);
  })
})
