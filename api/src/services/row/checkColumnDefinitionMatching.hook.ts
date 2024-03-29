/* eslint-disable no-case-declarations */
import { Hook, HookContext } from '@feathersjs/feathers'
import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { SelectValue, TableColumn } from '../../models/tablecolumn.model'
import { GeneralError, NotAcceptable } from '@feathersjs/errors'
import { TableRow } from '../../models/tablerow.model'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Knex from 'knex'
import validator from 'validator'
import { LckAttachment } from '../../models/attachment.model'

dayjs.extend(customParseFormat)

const DATE_FORMAT = {
  [COLUMN_TYPE.DATE]: 'YYYY-MM-DD',
  [COLUMN_TYPE.DATETIME]: ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss'],
}

class CheckError {
  columnName!: string
  columnError!: string
}

enum GEOMETRY_TYPE {
  POINT = 'POINT',
  POLYGON = 'POLYGON',
  LINESTRING = 'LINESTRING',
  MULTIPOINT = 'MULTIPOINT',
  MULTIPOLYGON = 'MULTIPOLYGON',
  MULTILINESTRING = 'MULTILINESTRING',
}

function getGeometryType (columnType: COLUMN_TYPE): GEOMETRY_TYPE | null {
  switch (columnType) {
    case COLUMN_TYPE.GEOMETRY_LINESTRING:
      return GEOMETRY_TYPE.LINESTRING
    case COLUMN_TYPE.GEOMETRY_POINT:
      return GEOMETRY_TYPE.POINT
    case COLUMN_TYPE.GEOMETRY_POLYGON:
      return GEOMETRY_TYPE.POLYGON
    case COLUMN_TYPE.GEOMETRY_MULTILINESTRING:
      return GEOMETRY_TYPE.MULTILINESTRING
    case COLUMN_TYPE.GEOMETRY_MULTIPOINT:
      return GEOMETRY_TYPE.MULTIPOINT
    case COLUMN_TYPE.GEOMETRY_MULTIPOLYGON:
      return GEOMETRY_TYPE.MULTIPOLYGON
    default:
      return null
  }
}
/**
 * Check that the value we have for a column
 * match its definition :
 * * a BOOLEAN is a boolean, true / false or nullable value
 * * a NUMBER is a number or nullable value
 * * a DATE is a ISO 8601 Date, or nullable value https://en.wikipedia.org/wiki/ISO_8601#Dates
 * * a DATETIME is a ISO 8601 DateTime, or nullable value https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations
 * * a STRING is a string or nullable value
 * * a FLOAT is a float or nullable value
 * * a USER is an existing user, defined by its reference
 * * a GROUP is an existing group, defined by its reference
 * * a RELATION_BETWEEN_TABLES is a value pointing to an existing row, from the right table, or a nullable value
 * * a LOOKED_UP_COLUMN can't be sent
 * * a SINGLE_SELECT has only one value, and this value is from the column definition values set, or nullable value
 * * a MULTI_SELECT has a value's array, and all values are from the column definition values set, or nullable value
 * * a FORMULA can't be sent
 * * a FILE is not yet implemented
 * * a MULTI_USER is not yet implemented
 * * a MULTI_GROUP is not yet implemented
 * * a TEXT is a string
 *
 * Need the loadColumnsDefinition hook before.
 */
export function checkColumnDefinitionMatching (): Hook {
  return async (context: HookContext): Promise<HookContext> => {
    if (!['patch', 'create', 'update'].includes(context.method)) {
      throw new GeneralError('[checkColumnDefinitionMatching] hook available only for create / update / patch methods')
    }
    /**
     * Need column definitions and columnsIds transmitted
     */
    if (!context.params._meta?.columns) {
      throw new GeneralError('[checkColumnDefinitionMatching] columns definitions needed')
    }
    if (!context.params._meta?.columnsIdsTransmitted) {
      throw new GeneralError('[checkColumnDefinitionMatching] columnsIdsTransmitted definitions needed')
    }

    const columnsDefinitionByColumnId: Record<string, TableColumn> = {}
    context.params._meta.columns.forEach((column: TableColumn) => {
      columnsDefinitionByColumnId[column.id] = column
    })
    context.params._meta.columnsDefinitionByColumnId = columnsDefinitionByColumnId
    // console.log('checkColumnDefinitionMatching hook', context.params._meta?.columnsIdsTransmitted, columnsDefinitionByColumnId)

    /**
     * For each values sent, check the matching
     */
    const checkErrors: CheckError[] = []
    await Promise.all(
      context.params._meta.columnsIdsTransmitted.map(async (columnId: string) => {
        const currentColumn = columnsDefinitionByColumnId[columnId]
        const currentColumnValue = context.data.data ? context.data.data[columnId] : context.data[`data:${columnId}`]
        /**
       * If the current value is null
       */
        if (currentColumnValue === null) {
        /**
         * and is required, we add an error
         */
          if (currentColumn.validation?.required) {
            checkErrors.push({
              columnName: currentColumn.text,
              columnError: `The current field is required (received: ${currentColumnValue as string})`,
            })
          }
          /**
         * for both case -required or not- we don't have to check the type
         */
          return
        }
        switch (currentColumn.column_type_id) {
          case COLUMN_TYPE.BOOLEAN:
            if (!(typeof currentColumnValue === 'boolean')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a boolean (received: ${currentColumnValue as string})`,
              })
            }
            break
          case COLUMN_TYPE.NUMBER:
            if (!(typeof currentColumnValue === 'number' && Number.isSafeInteger(currentColumnValue))) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a number (received: ${currentColumnValue as string})`,
              })
            }
            break
          case COLUMN_TYPE.FLOAT:
            if (!(typeof currentColumnValue === 'number')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a float (received: ${currentColumnValue as string})`,
              })
            }
            break
          case COLUMN_TYPE.DATE:
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value need to be sent as a string (received: ${currentColumnValue as string})`,
              })
            } else if (!dayjs(currentColumnValue, DATE_FORMAT[COLUMN_TYPE.DATE], true).isValid()) {
              /**
               * Check that the date is in a ISO 8601 format
               */
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a ISO8601 date (received: ${currentColumnValue})`,
              })
            }
            break
          case COLUMN_TYPE.DATETIME:
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value need to be sent as a string (received: ${currentColumnValue as string})`,
              })
            } else if (!dayjs(currentColumnValue, DATE_FORMAT[COLUMN_TYPE.DATETIME]).isValid()) {
              /**
               * Check that the datetime is in a ISO 8601 format
               */
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a ISO8601 datetime (received: ${currentColumnValue})`,
              })
            }
            break
          case COLUMN_TYPE.SINGLE_SELECT:
          /**
           * A single select is sent as a string
           */
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a string (received: ${currentColumnValue as string})`,
              })
            } else {
            /**
             * The single select is one of the settings values ids
             */
              const currentSingleSelectSettingsValues = currentColumn.settings.values as Record<string, SelectValue>
              if (!Object.keys(currentSingleSelectSettingsValues).includes(currentColumnValue)) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: `The current value is not a string (received: ${currentColumnValue})`,
                })
              }
            }
            break
          case COLUMN_TYPE.MULTI_SELECT:
            /**
           * A multi select is sent as a string array
           */
            if (!(currentColumnValue instanceof Array)) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not an array of value (received: ${currentColumnValue as string})`,
              })
            } else {
              /**
               * Each value of a multi select is a string,
               * and each value is one of the settings values ids
               */
              const currentSettingsValues = currentColumn.settings?.values as Record<string, SelectValue>
              if (!currentSettingsValues) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: 'The current multi select column is not well configured. Please add values in the column\'s settings.',
                })
              } else {
                currentColumnValue.forEach((multiSelectValue: string | any) => {
                  if (!(typeof multiSelectValue === 'string')) {
                    checkErrors.push({
                      columnName: currentColumn.text,
                      columnError: 'The current multi select value is not a string (received: \' + multiSelectValue + \')',
                    })
                  } else {
                    if (!Object.keys(currentSettingsValues).includes(multiSelectValue)) {
                      checkErrors.push({
                        columnName: currentColumn.text,
                        columnError: 'The current value is not a string (received: \' + multiSelectValue + \')',
                      })
                    }
                  }
                })
              }
            }
            break
          case COLUMN_TYPE.STRING:
          case COLUMN_TYPE.TEXT:
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a string / text (received: ${currentColumnValue as string})`,
              })
            }
            break
          case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a string reference (received: ${currentColumnValue as string})`,
              })
            } else {
              /**
               * We have to check this reference exist
               * and is related to the table_id from column definition
               */
              try {
                const relatedRow: TableRow = await context.service.get(currentColumnValue)
                if (relatedRow.table_id !== currentColumn.settings.tableId) {
                  checkErrors.push({
                    columnName: currentColumn.text,
                    columnError: `The current value is not a row related to the table referenced in column definition (received: ${currentColumnValue})`,
                  })
                }
              } catch (error) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: `The current value is not a row related to the table referenced in column definition (received: ${currentColumnValue})`,
                })
              }
            }
            break
          case COLUMN_TYPE.USER:
            if (!(typeof currentColumnValue === 'number')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a user reference (received: ${currentColumnValue as string})`,
              })
            } else {
              /**
               * We have to check this user exist
               */
              try {
                await context.app.service('user').get(currentColumnValue)
              } catch (error) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: `The current value is not an existing user (received: ${currentColumnValue})`,
                })
              }
            }
            break
          case COLUMN_TYPE.GROUP:
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a group reference (received: ${currentColumnValue as string})`,
              })
            } else {
              /**
               * We have to check this group exist
               */
              try {
                await context.app.service('group').get(currentColumnValue)
              } catch (error) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: `The current value is not an existing group (received: ${currentColumnValue})`,
                })
              }
            }
            break
          case COLUMN_TYPE.FORMULA:
            // The formula value is automatically computed so it's forbidden to update it from outside the server
            // Except when it's a reference for a column (Duplicate Action)
            if (context.params.provider) {
              if (!currentColumn.reference) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: 'This type of column can\'t be set. It\'s automagically computed.',
                })
              }
            }
            break
          case COLUMN_TYPE.LOOKED_UP_COLUMN:
          case COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN:
            checkErrors.push({
              columnName: currentColumn.text,
              columnError: 'This type of column can\'t be set. It\'s automagically computed.',
            })
            break
          case COLUMN_TYPE.URL:
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a string (received: ${currentColumnValue as string})`,
              })
            } else {
              try {
                // eslint-disable-next-line no-new
                new URL(currentColumnValue)
              } catch (error) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: `The current value is not a valid URL (received: ${currentColumnValue})`,
                })
              }
            }
            break
          case COLUMN_TYPE.MULTI_GROUP:
            if (!(currentColumnValue instanceof Array)) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not an array of values (received: ${currentColumnValue as string})`,
              })
            } else if (currentColumnValue.length > 0) {
              // Check is value is a string/UUID
              if (!currentColumnValue.every((groupID: string | any) => typeof groupID === 'string')) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  columnError: `The current value is not an array of group references (received: ${currentColumnValue})`,
                })
              } else {
                /**
                 * We have to check that all group exist
                 */
                const groups = await context.app.service('group').find({
                  query: {
                    id: {
                      $in: currentColumnValue,
                      $limit: -1,
                    },
                  },
                })
                if (currentColumnValue.length !== groups.total) {
                  checkErrors.push({
                    columnName: currentColumn.text,
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    columnError: `The current value is not an array of existing and distinct group references (received: ${currentColumnValue})`,
                  })
                }
              }
            }
            break
          case COLUMN_TYPE.MULTI_USER:
            /**
             * A multi user is sent as a number array
             */
            if (!(currentColumnValue instanceof Array)) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not an array of values (received: ${currentColumnValue as string})`,
              })
            } else if (currentColumnValue.length > 0) {
              /**
               * Each value of a multi user is a number,
               * and each value is associated to an existed user
               */
              if (!currentColumnValue.every((userID: number | any) => typeof userID === 'number')) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  columnError: `The current value is not an array of user references (received: ${currentColumnValue})`,
                })
              } else {
                /**
                 * We have to check that all users exist
                 */
                const users = await context.app.service('user').find({
                  query: {
                    id: { $in: currentColumnValue },
                    $limit: 0,
                  },
                })
                if (currentColumnValue.length !== users.total) {
                  checkErrors.push({
                    columnName: currentColumn.text,
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    columnError: `The current value is not an array of existing and distinct user references (received: ${currentColumnValue})`,
                  })
                }
              }
            }
            break
          case COLUMN_TYPE.GEOMETRY_POINT:
          case COLUMN_TYPE.GEOMETRY_LINESTRING:
          case COLUMN_TYPE.GEOMETRY_POLYGON:
          case COLUMN_TYPE.GEOMETRY_MULTIPOINT:
          case COLUMN_TYPE.GEOMETRY_MULTILINESTRING:
          case COLUMN_TYPE.GEOMETRY_MULTIPOLYGON:
            /**
             * Check if it is a string
             */
            if (!(typeof currentColumnValue === 'string')) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not a string / text (received: ${currentColumnValue as string})`,
              })
            } else {
              try {
                const ewktSanitized: string = validator.escape(currentColumnValue)
                /**
                 * Then check in PostGIS if the data is valid
                 */
                await (context.app.get('knex') as Knex).raw(`
                  SELECT ST_IsValid(ST_GeomFromEWKT('${ewktSanitized}'))
                `)
                /**
                 * Then check if it's the right geometry
                 */
                const geometryType = await (context.app.get('knex') as Knex).raw(`
                  SELECT GeometryType(ST_GeomFromEWKT('${ewktSanitized}'))
                `)
                const geometryTypeReceived = geometryType.rows[0].geometrytype
                const geometryTypeNeeded = getGeometryType(currentColumn.column_type_id) as GEOMETRY_TYPE
                if (geometryTypeReceived !== geometryTypeNeeded) {
                  checkErrors.push({
                    columnName: currentColumn.text,
                    columnError: `This geometry is not a ${geometryTypeNeeded}. (found ${geometryTypeReceived as string})`,
                  })
                } else {
                  /**
                   * If yes, transform it in EWKT before insertion
                   */
                  context.data.data[columnId] = ewktSanitized
                }
              } catch (e: any) {
                /**
                 * If no, return the reason from PostGIS
                 */
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: `This geometry is not valid. (${e.detail as string})`,
                })
              }
            }
            break
          case COLUMN_TYPE.FILE:
            /**
             * FILE column is an array of attachments
             */
            if (!(currentColumnValue instanceof Array)) {
              checkErrors.push({
                columnName: currentColumn.text,
                columnError: `The current value is not an array of attachment (received: ${currentColumnValue as string})`,
              })
            } else {
              /**
               * For files, we need to check every ids really exist in database
               */
              try {
                const attachments = await context.app.service('attachment')._find({
                  query: {
                    id: {
                      $in: currentColumnValue,
                    },
                  },
                  paginate: false,
                }) as LckAttachment[]
                if (attachments.length !== currentColumnValue.length) {
                  checkErrors.push({
                    columnName: currentColumn.text,
                    columnError: 'Attachments are not all in the database. Please check what you have send.',
                  })
                } else {
                  context.data.data[columnId] = attachments.map(a => ({
                    filename: a.filename,
                    filepath: a.filepath,
                    mime: a.mime,
                    id: a.id,
                    thumbnail: a.thumbnail,
                  }))
                }
              } catch (error) {
                checkErrors.push({
                  columnName: currentColumn.text,
                  columnError: 'We encounter an error when checking attachments... sorry.',
                })
              }
            }
            break
          default:
            checkErrors.push({
              columnName: currentColumn.text,
              columnError: 'We are sorry, this column type is not yet implemented',
            })
            break
        }
      }),
    )

    if (checkErrors.length > 0) {
      throw new NotAcceptable('Several values sent are incorrect', checkErrors)
    }
    return context
  }
};
