import { Paginated } from '@feathersjs/feathers'
import { BLOCK_TYPE, COLUMN_TYPE, EXTERNAL_APP_URL_PART_TYPE, GROUP_ROLE, MapSourceSettings, MediaSettings, MEDIA_TYPE } from '@locokit/lck-glossary'

export class LckBaseModel {
  /**
   * UUID v4
   */
  id!: string;
  /**
   * Creation date of the instance
   */
  createdAt?: string;
  /**
   * Last update date of the current instance
   */
  updatedAt?: string;
}

export interface LckWorkspaceSettings {
  color?: string | null;
  backgroundColor?: string | null;
  icon?: string | null;
}

export class LckWorkspace extends LckBaseModel {
  text!: string;
  chapters?: LckChapter[];
  databases?: LckDatabase[];
  aclsets?: LckAclSet[];
  documentation?: string;
  generate_sql!: boolean;
  slug?: string;
  settings?: LckWorkspaceSettings;

  constructor () {
    super()
    this.settings = {}
  }
}

export class LckAttachment {
  id!: number
  filepath!: string
  filename!: string
  mime!: string
  ext!: string
  thumbnail!: boolean; // has the attachment a thumbnail available
  size!: number

  workspace_id!: string
}

export type LckTableColumnValidation = {
  minDate?: {
    fromDate: string;
  };
  required?: boolean;
}

/**
 * Database section
 */
export class LckDatabase extends LckBaseModel {
  text!: string;
  workspace_id!: string
  tables: LckTable[] = []
}

export class LckTable extends LckBaseModel {
  text!: string;
  documentation?: string
  slug!: string
  database_id!: string;
  columns?: LckTableColumn[]
  views?: LckTableView[]
}

export interface SelectValue {
  value: string;
  label: string;
  color: string;
  backgroundColor: string;
  position?: number;
}

export interface SelectValueWithId extends SelectValue {
  id: string;
}

export class LckTableColumn extends LckBaseModel {
  /**
   * Text / Title of the column
   */
  text!: string;
  table_id!: string;
  column_type_id!: COLUMN_TYPE;
  parents?: LckTableColumn[]|null;
  children?: LckTableColumn[]|null;
  documentation?: string
  slug!: string
  position!: number;
  reference!: boolean;
  reference_position!: number;
  locked!: boolean
  settings!: {
    formula?: string;
    formula_type_id?: COLUMN_TYPE;
    query?: {
      select: string[];
      where: Record<string, {}>;
      sort: { field: string; order: string}[];
      limit: number;
      skip: number;
      aggregate: string; // count, avg, sum, min, max, count distinct
    };
    tableId?: string;
    localField?: string;
    foreignField?: string;
    values?: Record<string, SelectValue>;
    default?: string;
    width?: number;
    required?: boolean;
    map_center?: {
      center: [number, number]; // [lng, lat]
      zoom: number;
    };
    map_sources?: (MapSourceSettings & { excludeFromBounds: boolean })[];
  };

  validation?: LckTableColumnValidation;
}

export class LckTableViewColumn extends LckTableColumn {
  table_column_id!: string;
  table_view_id!: string;
  /**
   * Display position
   */
  position!: number;
  /**
   * Filters
   */
  filter?: object[]
  foreign_filter?: object
  /**
   * Whether editable
   */
  editable!: boolean;
  /**
   * Whether displayed
   */
  displayed!: boolean;
  /**
   * Whether transmitted
   */
  transmitted!: boolean;
  /**
   * Value which specify a data/template in order to parameterize a behaviour
   */
  default?: {
    /**
     * The default value for the field, or magic strings
     */
    value?: string | number | boolean | '{rowId}' | '{userId}' | '{groupId}';
    /**
     * Id of the field this field will take the initial value.
     * On the front side, as soon as the fieldId value is mutated,
     * we set the value of the current field if unset.
     * On the back side, the current field value is set to the field value with fieldId.
     */
    fieldId?: string;
  } | Record<string, unknown>;

  /**
   * Style css rules
   */
  style!: object;
  /**
   * Sort of value
   */
  sort!: SORT_COLUMN;
  /**
   * Is value required
   * TODO: need to be removed, this field may be not used anymore
   */
  required!: boolean;
  display_conditions?: Array<{
    field_id: string;
    operator: '$eq' | '$in' | '$ne';
    value: string | number | string[] | number [];
  }>
}

export enum SORT_COLUMN {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type LckTableViewFilterPattern = boolean | number | string | Array<string | number>

export interface LckTableViewFilterValue {
  action: string;
  column: string;
  dbAction: string;
  pattern: LckTableViewFilterPattern;
}

export interface LckTableViewFilter {
  operator: string;
  values: LckTableViewFilterValue[];
}

export class LckTableView extends LckBaseModel {
  text!: string;
  /**
   * Reference to the LckTable
   */
  table_id!: string;
  columns?: LckTableViewColumn[]
  filter?: LckTableViewFilter | null
  locked!: boolean
}

export class LckTableAction extends LckBaseModel {
  label!: string
  class_button!: string
  icon?: string|null
  action!: string
  page_redirect_id?: string
  pageRedirectId?: string
  display_field_id?: string
  displayFieldId?: string
  display_field_condition_query?: object|null
  table_id!: string
  process_id?: string
  page_detail_Id?: string;
  pageDetailId?: string;
  type_page_to?: string;
  typePageTo?: string;
  notification_success_title?: string;
  notification_success_description?: string;
  notification_error_title?: string;
  notification_error_description?: string;
}

export class LckTableRowDataComplex {
  reference!: string;
  value!: string | Date | boolean | null;
}

export class LCKTableRowMultiDataComplex {
  reference!: string[];
  value!: string[];
}

export type LckTableRowData = Date
  | string[]
  | string
  | number
  | LckTableRowDataComplex
  | LCKTableRowMultiDataComplex
  | null
  | boolean
  | LckAttachment[];

export class LckTableRow extends LckBaseModel {
  text!: string;
  data!: Record<string, LckTableRowData>;
}

/**
 * Visualisation section
 */
export class LckChapter extends LckBaseModel {
  text!: string;
  pages?: LckPage[];
}

export class LckPage extends LckBaseModel {
  text!: string;
  hidden?: boolean;
  position!: number;
  layout!: string;
  modeNavigation!: string;
  chapter?: LckChapter;
  containers: LckContainer[] = [];
}

export enum AnchorClass {
  VISIBLE = 'visible',
  CLASSIC = 'classic'
}

export class LckContainer extends LckBaseModel {
  text!: string;
  page_id!: string;
  display_title!: boolean;
  displayed_in_navbar!: boolean;
  elevation!: boolean;
  anchor_label?: string;
  anchor_icon?: string;
  anchor_icon_class?: AnchorClass;
  blocks: LckBlockExtended[] = [];
  position!: number;
}

export class LckBlock extends LckBaseModel {
  text!: string;
  position!: number;
}

export class LckBlockExtended extends LckBaseModel {
  container_id!: string;
  type!: BLOCK_TYPE;
  title?: string;
  position!: number;
  settings: {
    id?: string;
    addSourceId?: string;
    sources: LckBlockSource[];
    pagination?: number;
    parts: {
      type: EXTERNAL_APP_URL_PART_TYPE;
      id: string;
    }[];
    pageDetailId?: string;
    redirectPageId?: string;
  } | MediaSettings = {
    sources: [],
    parts: [],
  };

  elevation?: boolean;
  conditionalDisplayTableViewId?: string;
  conditionalDisplayFieldId?: string;
  conditionalDisplayFieldValue?: boolean;

  displayTableView?: LckTableView;
  displayField?: LckTableColumn;

  loading?: boolean
  definition?: LckTableView
  pageLoaded?: boolean;
}

export type LckBlockSecondarySource = Record<string, {
  definition?: LckTableView;
  content?: LckTableRow[];
}>

export type LckBlockGeoSource = Record<string, {
  definition?: Record<string, LckTableView>;
}>

export type LckBlockSource = {
  id: string;
  definition?: LckTableView;
  content?: LckTableRow[] | Paginated<LckTableRow>;
  multi: boolean;
  blocks: string[];
  options: {
    sort: Record<string, unknown>;
    page: number;
    itemsPerPage: number;
    filters: Record<string, unknown>;
  };
}

export class MediaConfiguration {
  name?: string;
  srcURL?: string;
  type?: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO;
}

export enum PROCESS_TRIGGER {
  CREATE_ROW = 'CREATE_ROW', // when a row in inserted
  UPDATE_ROW = 'UPDATE_ROW', // when a row is updated, no matter which data
  UPDATE_ROW_DATA = 'UPDATE_ROW_DATA', // when a data in a row is updated
  CRON = 'CRON',
  MANUAL = 'MANUAL',
}

/**
 * Process section
 */
export class LckProcess extends LckBaseModel {
  text!: string;
  url!: string;
  enabled!: boolean;
  trigger!: PROCESS_TRIGGER;
  table_id?: string;
  maximumNumberSuccess?: number;
  settings!: {
    column_id?: string;
    column?: LckTableColumn;
  };

  workspace_id!: string

  runs?: LckProcessRun[];
  table?: LckTable;

  constructor () {
    super()
    this.settings = {}
    this.trigger = PROCESS_TRIGGER.MANUAL
  }
}

export enum PROCESS_RUN_STATUS {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  RUNNING = 'RUNNING'
}

export class LckProcessRun extends LckBaseModel {
  text!: string;
  process_id!: string;
  table_row_id!: string;
  status!: PROCESS_RUN_STATUS;
  duration!: number;
  log!: string;
}

/**
 * Users / Groups
 */
export class LckUser {
  id!: number;
  createdAt!: string;
  updatedAt!: string;
  email!: string;
  name!: string;
  password?: string;
  profile!: string;
  blocked!: boolean;
  isVerified!: boolean;
}

export class LckGroup extends LckBaseModel {
  name!: string
  users?: LckUser[]
  usergroups?: {
    user_id: string;
    group_id: string;
    uhg_role: GROUP_ROLE;
  }[]

  uhg_role!: GROUP_ROLE;
  aclset_id!: string
  aclset?: LckAclSet
}

export class LckUserGroup extends LckBaseModel {
  uhg_role!: GROUP_ROLE
  user_id!: number
  user?: LckUser
  group_id!: string
  group?: LckGroup
}

export class LckAclTable extends LckBaseModel {
  aclset_id!: string
  table_id!: string
  create_rows = false
  read_rows = false
  update_rows = false
  delete_rows = false
  read_filter: object = {}
  update_filter: object = {}
  delete_filter: object = {}
  table?: LckTable

  constructor (aclSetId: string, table: LckTable | undefined) {
    super()
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.aclset_id = aclSetId
    if (table) {
      this.table = table
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.table_id = table.id
    }
  }
}

export class LckSettings {
  allow_signup!: boolean;
}

export class LckSignUp {
  email!: string
  name!: string
}

export class LckAclSet extends LckBaseModel {
  label!: string
  workspace_id!: string
  workspace?: LckWorkspace
  chapter_id?: string
  chapter?: LckChapter
  manager!: boolean
  groups?: LckGroup[]
  acltables?: LckAclTable[]

  constructor (label = '', workspaceId = '', manager = false) {
    super()
    this.label = label
    this.manager = manager
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.workspace_id = workspaceId
  }
}

export interface Submitting {
  inProgress: boolean;
  errors?: Error[];
}

export interface EmittedBlockEvent {
  sourceId?: string;
  originalValue?: LckTableRowData;
  displayedValue?: string | number;
}

export type MapPopupMode = 'click' | 'hover' | null
