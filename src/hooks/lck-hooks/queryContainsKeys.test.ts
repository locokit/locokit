import { queryContainsKeys } from './queryContainsKeys'

describe('[hook] queryContainsKeys', () => {
  it('return false if no param exist', () => {
    const result = queryContainsKeys(['myKey'])({
      type: 'before'
    })
    expect(result).toBe(false)
  })
  it('return false if no query param exist', () => {
    const result = queryContainsKeys(['myKey'])({
      type: 'before',
      params: {
        query: {

        }
      }
    })
    expect(result).toBe(false)
  })
  it('return true if myKey exist', () => {
    const result = queryContainsKeys(['myKey'])({
      type: 'before',
      params: {
        query: {
          myKey: 'here'
        }
      }
    })
    expect(result).toBe(true)
  })
  it('return false if myKey is unset', () => {
    const result = queryContainsKeys(['myKey'])({
      type: 'before',
      params: {
        query: {
          myKey: null
        }
      }
    })
    expect(result).toBe(false)
  })
  it('return false if none keys are set', () => {
    const result = queryContainsKeys(['myKey', 'myKey1'])({
      type: 'before',
      params: {
        query: {
        }
      }
    })
    expect(result).toBe(false)
  })
  it('return true if one of keys are set (default mode ANY)', () => {
    const result = queryContainsKeys(['myKey', 'myKey1'])({
      type: 'before',
      params: {
        query: {
          myKey: '1'
        }
      }
    })
    expect(result).toBe(true)
  })
  it('return true if all keys are set (default mode ANY)', () => {
    const result = queryContainsKeys(['myKey', 'myKey1'])({
      type: 'before',
      params: {
        query: {
          myKey: '1',
          myKey1: '2'
        }
      }
    })
    expect(result).toBe(true)
  })
  it('return false if one of keys are set (mode ALL)', () => {
    const result = queryContainsKeys(['myKey', 'myKey1'], 'ALL')({
      type: 'before',
      params: {
        query: {
          myKey: '1'
        }
      }
    })
    expect(result).toBe(false)
  })
  it('return true if all keys are set (mode ALL)', () => {
    const result = queryContainsKeys(['myKey', 'myKey1'], 'ALL')({
      type: 'before',
      params: {
        query: {
          myKey: '1',
          myKey1: '2'
        }
      }
    })
    expect(result).toBe(true)
  })
})
