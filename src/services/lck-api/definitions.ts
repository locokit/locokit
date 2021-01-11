import { COLUMN_TYPE } from '@locokit/lck-glossary'

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

export class LckWorkspace extends LckBaseModel {
  text!: string;
  chapters?: LckChapter[];
  databases?: LckDatabase[];
}

/**
 * Database section
 */
export class LckDatabase extends LckBaseModel {
  text!: string;
  tables: LckTable[] = []
}

export class LckTable extends LckBaseModel {
  text!: string;
}

export interface SelectValue {
  label: string;
  color: string;
  backgroundColor: string;
}

export class LckTableColumn extends LckBaseModel {
  /**
   * Text / Title of the column
   */
  text!: string;
  table_id!: string;
  column_type_id!: COLUMN_TYPE;
  settings!: {
    formula?: string;
    query?: {
      select: string[];
      where: Record<string, {}>;
      sort: { field: string; order: string}[];
      limit: number;
      skip: number;
      aggregate: string; // count, avg, sum, min, max, count distinct
    };
    table_to_id?: string;
    column_to_id?: string;
    column_from_id?: string;
    tableId?: string;
    localField?: string;
    foreignField?: string;
    values?: Record<string, SelectValue>;
    width?: number;
    required?: boolean;
  }
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
  filters?: object[]
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
  default!: string;
  /**
   * Style css rules
   */
  style!: object;
  /**
   * Sort of value
   */
  sort!: SORT_COLUMN;
}

export enum SORT_COLUMN {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class LckTableView extends LckBaseModel {
  text!: string;
  /**
   * Reference to the LckTable
   */
  table_id!: string;
  columns?: LckTableViewColumn[]
}

export class LckTableRowDataComplex {
  reference!: string;
  value!: string;
}

export class LCKTableRowMultiDataComplex {
  reference!: string[];
  value!: string[];
}

export type LckTableRowData = string[] | string | number | LckTableRowDataComplex | LCKTableRowMultiDataComplex;

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
}
export class LckContainer extends LckBaseModel {
  text!: string;
}
export class LckBlock extends LckBaseModel {
  text!: string;
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
  settings?: {
    column_id?: string;
    column?: LckTableColumn;
  };

  runs?: LckProcessRun[];
  table?: LckTable;
}

export enum PROCESS_TRIGGER {
  CREATE_ROW = 'CREATE_ROW', // when a row in inserted
  UPDATE_ROW = 'UPDATE_ROW', // when a row is updated, no matter which data
  UPDATE_ROW_DATA = 'UPDATE_ROW_DATA', // when a data in a row is updated
  CRON = 'CRON',
  MANUAL = 'MANUAL',
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
  // password!: string;
  profile!: string;
  blocked!: boolean;
  isVerified!: boolean;
}

export class LckGroup extends LckBaseModel {
  workspace?: LckWorkspace;
  chapter?: LckChapter;
  chapter_id?: string;
  workspace_role?: string;
  name!: string;
  users?: LckUser[];
}
