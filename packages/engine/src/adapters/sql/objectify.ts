import { QueryBuilder, Model } from 'objection'

const METHODS = {
  $ne: 'whereNot',
  $in: 'whereIn',
  $nin: 'whereNotIn',
  $or: 'orWhere',
  $and: 'andWhere',
}

const OPERATORS = {
  $lt: '<',
  $lte: '<=',
  $gt: '>',
  $gte: '>=',
  $like: 'like',
  $notlike: 'not like',
  $ilike: 'ilike',
  $unaccent: 'unaccent',
}

/**
 * Function forked from https://github.com/feathersjs/feathers/blob/dove/packages/knex/src/adapter.ts#L79
 */
export function objectify<T extends Model>(
  knexQuery: QueryBuilder<T, T[]>,
  query: Record<string | keyof typeof METHODS, Object | string | number | null> = {},
  parentKey?: string,
): QueryBuilder<T, T[]> {
  return Object.keys(query || {}).reduce((currentQuery, key) => {
    const value = query[key]

    if (typeof value === 'object') {
      return objectify(currentQuery, value as Record<string, Object | string | number | null>, key)
    }

    const column = parentKey ?? key
    const method = METHODS[key as keyof typeof METHODS]

    if (method) {
      // if (key === '$or' || key === '$and') {
      //   // This will create a nested query
      //   currentQuery.where(function (this: any) {
      //     for (const condition of value) {
      //       this[method](function (this: Knex.QueryBuilder) {
      //         objectify(this, condition)
      //       })
      //     }
      //   })

      //   return currentQuery
      // }

      return (currentQuery as any)[method](column, value)
    }

    const operator = OPERATORS[key as keyof typeof OPERATORS] || '='

    switch (operator) {
      case OPERATORS.$unaccent:
        currentQuery.whereRaw('unaccent(??) ilike ?', [column, value])
        break
      default:
        currentQuery.where(column, operator, value)
    }

    return currentQuery
  }, knexQuery)
}
