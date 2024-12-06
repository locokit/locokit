import { errors } from '@feathersjs/errors'
import {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} from 'objection'
import { objectionLogger } from './logger'

export const ERROR = Symbol('@feathersjs/knex/error')

export function errorHandler(error: any) {
  const { message } = error
  let feathersError = error

  if (error.sqlState?.length) {
    // remove SQLSTATE marker (#) and pad/truncate SQLSTATE to 5 chars

    const sqlState = ('00000' + error.sqlState.replace('#', '')).slice(-5)

    switch (sqlState.slice(0, 2)) {
      case '02':
        feathersError = new errors.NotFound(message)
        break
      case '28':
        feathersError = new errors.Forbidden(message)
        break
      case '08':
      case '0A':
      case '0K':
        feathersError = new errors.Unavailable(message)
        break
      case '20':
      case '21':
      case '22':
      case '23':
      case '24':
      case '25':
      case '40':
      case '42':
      case '70':
        feathersError = new errors.BadRequest(message)
        break
      default:
        feathersError = new errors.GeneralError(message)
    }
  } else if (error.code === 'SQLITE_ERROR') {
    // NOTE (EK): Error codes taken from
    // https://www.sqlite.org/c3ref/c_abort.html
    switch (error.errno) {
      case 1:
      case 8:
      case 18:
      case 19:
      case 20:
        feathersError = new errors.BadRequest(message)
        break
      case 2:
        feathersError = new errors.Unavailable(message)
        break
      case 3:
      case 23:
        feathersError = new errors.Forbidden(message)
        break
      case 12:
        feathersError = new errors.NotFound(message)
        break
      default:
        feathersError = new errors.GeneralError(message)
        break
    }
  } else if (error instanceof DBError) {
    if (error instanceof ValidationError) {
      switch (error.type) {
        case 'ModelValidation':
          feathersError = new errors.BadRequest(message, error.data)
          break
        case 'RelationExpression':
          feathersError = new errors.BadRequest('Invalid Relation Expression')
          break
        case 'UnallowedRelation':
          feathersError = new errors.BadRequest('Unallowed Relation Expression')
          break
        case 'InvalidGraph':
          feathersError = new errors.BadRequest('Invalid Relation Graph')
          break
        default:
          feathersError = new errors.BadRequest('Unknown Validation Error')
      }
    } else if (error instanceof NotFoundError) {
      feathersError = new errors.NotFound(message)
    } else if (error instanceof UniqueViolationError) {
      feathersError = new errors.Conflict(`${error.columns.join(', ')} must be unique`, {
        columns: error.columns,
        table: error.table,
        constraint: error.constraint,
      })
    } else if (error instanceof NotNullViolationError) {
      feathersError = new errors.BadRequest(`${error.column} must not be null`, {
        column: error.column,
        table: error.table,
      })
    } else if (error instanceof ForeignKeyViolationError) {
      feathersError = new errors.Conflict('Foreign Key Violation', {
        table: error.table,
        constraint: error.constraint,
      })
    } else if (error instanceof CheckViolationError) {
      feathersError = new errors.BadRequest('Check Violation', {
        table: error.table,
        constraint: error.constraint,
      })
    } else if (error instanceof ConstraintViolationError) {
      feathersError = new errors.Conflict('Constraint Violation', {
        name: error.name,
      })
    } else if (error instanceof DataError) {
      feathersError = new errors.BadRequest('Invalid Data')
    } else if (error instanceof DBError) {
      feathersError = new errors.GeneralError('Unknown Database Error')
    } else {
      feathersError = new errors.GeneralError(message)
    }
  } else if (typeof error.code === 'string' && error.severity && error.routine) {
    // NOTE: Error codes taken from
    // https://www.postgresql.org/docs/9.6/static/errcodes-appendix.html
    // Omit query information
    const messages = error.message.split('-')
    error.message = messages[messages.length - 1]

    if (!feathersError) {
      switch (error.code.slice(0, 2)) {
        case '22':
          feathersError = new errors.NotFound(message)
          break
        case '23':
          feathersError = new errors.BadRequest(message)
          break
        case '28':
          feathersError = new errors.Forbidden(message)
          break
        case '3D':
        case '3F':
        case '42':
          feathersError = new errors.Unprocessable(message)
          break
        default:
          feathersError = new errors.GeneralError(message)
          break
      }
    }
  } else if (!(error instanceof errors.FeathersError)) {
    objectionLogger.info('not a feathers error', message)
    feathersError = new errors.GeneralError(message)
  }

  objectionLogger.error(error)

  feathersError[ERROR] = error

  throw feathersError
}
