import { FIELD_TYPE } from '@locokit/definitions'

export function getFieldIconClass(type: string): string {
  switch (type) {
    case FIELD_TYPE.ID_NUMBER:
      return 'bi-upc-scan'
    case FIELD_TYPE.ID_UUID:
      return 'bi-upc-scan'
    case FIELD_TYPE.BOOLEAN:
      return 'bi-check2-square'
    case FIELD_TYPE.NUMBER:
      return 'bi-123'
    case FIELD_TYPE.FLOAT:
      return 'bi-hash'
    case FIELD_TYPE.STRING:
      return 'bi-type'
    case FIELD_TYPE.TEXT:
      return 'bi-paragraph'
    case FIELD_TYPE.DATE:
      return 'bi-calendar-date'
    case FIELD_TYPE.DATETIME:
      return 'bi-clock'
    case FIELD_TYPE.UUID:
      return 'bi-upc'
    case FIELD_TYPE.USER:
      return 'bi-person-fill'
    case FIELD_TYPE.MULTI_USER:
      return 'bi-people-fill'
    case FIELD_TYPE.GROUP:
      return 'bi-person-vcard'
    case FIELD_TYPE.MULTI_GROUP:
      return 'bi-person-vcard-fill'
    case FIELD_TYPE.RELATION:
      return 'bi-link-45deg'
    case FIELD_TYPE.LOOKUP:
      return 'bi-binoculars-fill'
    case FIELD_TYPE.VIRTUAL_LOOKUP:
      return 'bi-binoculars'
    case FIELD_TYPE.ROLLUP:
      return 'bi-diamond-half'
    case FIELD_TYPE.SINGLE_SELECT:
      return 'bi-caret-down-square'
    case FIELD_TYPE.MULTI_SELECT:
      return 'bi-list-check'
    case FIELD_TYPE.FORMULA:
      return 'bi-magic'
    case FIELD_TYPE.JSON:
      return 'bi-braces-asterisk'
    case FIELD_TYPE.NETWORK:
      return 'bi-rocket-takeoff-fill'
    case FIELD_TYPE.MEDIA:
      return 'bi-image-alt'
    case FIELD_TYPE.URL:
      return 'bi-globe2'
    case FIELD_TYPE.GEOMETRY:
      return 'bi-globe-europe-africa'
    case FIELD_TYPE.GEOMETRY_POINT:
      return 'bi-geo'
    case FIELD_TYPE.GEOMETRY_POLYGON:
      return 'bi-bounding-box-circles'
    case FIELD_TYPE.GEOMETRY_LINESTRING:
      return 'bi-slash'
    case FIELD_TYPE.GEOMETRY_MULTIPOINT:
      return 'bi-geo-fill'
    case FIELD_TYPE.GEOMETRY_MULTIPOLYGON:
      return 'bi-bounding-box-circles'
    case FIELD_TYPE.GEOMETRY_MULTILINESTRING:
      return 'bi-slash-lg'
    default:
      return ''
  }
}
