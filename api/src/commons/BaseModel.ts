import { Model, AjvValidator } from 'objection'
import { addFormats } from '@feathersjs/schema'
import { formats } from './validators'
import { USER_PROFILE } from '@locokit/definitions'

export default class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv, formats)
        ajv.addFormat('user-profile', {
          type: 'string',
          validate: (x: string) => Object.keys(USER_PROFILE).includes(x),
        })
      },
      options: {
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
        coerceTypes: true,
        allowUnionTypes: true,
        // v5: true,
      },
    })
  }
}
