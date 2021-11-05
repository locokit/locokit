import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { getColumnClass } from '../../../services/lck-utils/columns'

export default {
  title: 'components/store/ColumnIcons',
  parameters: {
    docs: {
      description: `
        You find here all the icons we use for column types.
      `,
    },
  },
}

/* eslint-disable @typescript-eslint/camelcase */
const columns = [
  {
    text: 'Boolean',
    column_type_id: COLUMN_TYPE.BOOLEAN,
  },
  {
    text: 'String',
    column_type_id: COLUMN_TYPE.STRING,
  },
  {
    text: 'Number',
    column_type_id: COLUMN_TYPE.NUMBER,
  },
  {
    text: 'Float',
    column_type_id: COLUMN_TYPE.FLOAT,
  },
  {
    text: 'Date',
    column_type_id: COLUMN_TYPE.DATE,
  },
  {
    text: 'DateTime',
    column_type_id: COLUMN_TYPE.DATETIME,
  },
  {
    text: 'User',
    column_type_id: COLUMN_TYPE.USER,
  },
  {
    text: 'Group',
    column_type_id: COLUMN_TYPE.GROUP,
  },
  {
    text: 'Relation between table',
    column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
  },
  {
    text: 'Looked up column',
    column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
  },
  {
    text: 'Virtual looked up column',
    column_type_id: COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
  },
  {
    text: 'Single Select',
    column_type_id: COLUMN_TYPE.SINGLE_SELECT,
  },
  {
    text: 'Multi Select',
    column_type_id: COLUMN_TYPE.MULTI_SELECT,
  },
  {
    text: 'Formula',
    column_type_id: COLUMN_TYPE.FORMULA,
    settings: {
      formula_type_id: COLUMN_TYPE.FORMULA, // here we cheat a little to display the FORMULA icon
    },
  },
  {
    text: 'File',
    column_type_id: COLUMN_TYPE.FILE,
  },
  {
    text: 'Multi User',
    column_type_id: COLUMN_TYPE.MULTI_USER,
  },
  {
    text: 'Multi Group',
    column_type_id: COLUMN_TYPE.MULTI_GROUP,
  },
  {
    text: 'Textarea',
    column_type_id: COLUMN_TYPE.TEXT,
  },
  {
    text: 'URL',
    column_type_id: COLUMN_TYPE.URL,
  },
  {
    text: 'Geometry point',
    column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
  },
  {
    text: 'Geometry polygon',
    column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
  },
  {
    text: 'Geometry linestring',
    column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
  },
  {
    text: 'Geometry multi point',
    column_type_id: COLUMN_TYPE.GEOMETRY_MULTIPOINT,
  },
  {
    text: 'Geometry multi polygon',
    column_type_id: COLUMN_TYPE.GEOMETRY_MULTIPOLYGON,
  },
  {
    text: 'Geometry multi linestring',
    column_type_id: COLUMN_TYPE.GEOMETRY_MULTILINESTRING,
  },
]

export const allColumnTypes = () => (
  {
    data () {
      return {
        columns,
      }
    },
    methods: {
      getColumnClass,
    },
    template: `
    <div>
      <p v-for="column in columns">
        <i
          :class="getColumnClass(column)"
          style="filter: brightness(2)"
        />
        {{ column.text }}
      </p>
    </div>`,
  }
)

allColumnTypes.storyName = 'All column types with their icons'
