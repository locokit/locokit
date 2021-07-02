import { objectFromArray } from './arrays'

describe('Array utils', () => {
  describe('objectFromArray', () => {
    const arrayOfObjects = [
      {
        id: '1',
        text: 'My first element',
        number: 1,
      },
      {
        id: '2',
        text: 'My second element',
        number: 2,
      },
      {
        id: '3',
        text: 'My third element',
        number: 3,
      },
    ]
    it('Return an object whose the keys are the value of one property of the object and the value the related object', () => {
      expect(objectFromArray(arrayOfObjects, 'id')).toMatchObject({
        1: arrayOfObjects[0],
        2: arrayOfObjects[1],
        3: arrayOfObjects[2],
      })
    })
    it('Return an empty object if the selected property is not a string', () => {
      expect(objectFromArray(arrayOfObjects, 'number')).toStrictEqual({})
    })
  })
})
