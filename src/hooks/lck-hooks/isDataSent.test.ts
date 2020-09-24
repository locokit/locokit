import { isDataSent } from './isDataSent'

describe('[hook] isDataSent', () => {
  it('return true if data is part of data transmitted', () => {
    const result = isDataSent({
      type: 'before',
      data: {
        data: {
          'something': 'yes'
        }
      }
    })
    expect(result).toBe(true);
  })
  it('return true if data is part of data transmitted', () => {
    const result = isDataSent({
      type: 'before',
      data: {
        text: 'something'
      }
    })
    expect(result).toBe(false);
  })
})
