import { NotAcceptable } from '@feathersjs/errors'

/**
 * Replace placeholder in an ACL filter (read, update or delete ones)
 * * {userId} is replaced with the current user id
 * * {groupId} is replaced with the groupId var
 *   depending it's an array or a string, will spread it or replace simply
 *
 * @return the filter with all palceholder replaced
 */
export function replacePlaceholderInACLFilter (
  filter: string,
  userId: number,
  groupId: string | null | string[],
): string {
  let filterEnhance = filter.replace('"{userId}"', userId.toString())
  if (filterEnhance.includes('{groupId}')) {
    if (!groupId) {
      throw new NotAcceptable('Missing filter $lckGroupId.', {
        code: 'RECORDS_NOT_FILTERABLE',
      })
    } else if (Array.isArray(groupId)) {
      filterEnhance = filterEnhance.replace('"{groupId}"', `{
        "$in": [
          "${groupId.join('", "')}"
        ]
      }`)
    } else {
      filterEnhance = filterEnhance.replace('{groupId}', groupId)
    }
  }
  return filterEnhance
}
