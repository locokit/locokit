import ajvErrors from 'ajv-errors'
import addFormats from 'ajv-formats'
import Ajv from 'ajv'

// We're using a custom AJV validator instance so that we have more control
const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
})

addFormats(ajv)
ajvErrors(ajv)

// console.log(ajv.formats)

export default ajv
