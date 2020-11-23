import { COLUMN_TYPE } from '@locokit/lck-glossary'

export class LckBaseModel {
  /**
   * UUID v4
   */
  id!: string;
  /**
   * Creation date of the instance
   */
  createdAt!: string;
  /**
   * Last update date of the current instance
   */
  updatedAt!: string;
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

export class LckTableColumn extends LckBaseModel {
  /**
   * Text / Title of the column
   */
  text!: string;
  table_id!: string;
  column_type_id!: COLUMN_TYPE;
  settings!: {
    values: Record<string, { label: string}>;
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
   * Sort properties
   */
  sort!: object;
  /**
   * Filters
   */
  filters?: object[]
  editable!: boolean;
  visible!: boolean;
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

export type LckTableRowData = string[] | string | number | LckTableRowDataComplex;

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
  triggers?: LckProcessTrigger[];
  runs?: LckProcessExecution[];
}
export class LckProcessTrigger extends LckBaseModel {
  text!: string;
  process?: LckProcess;
}

enum EXECUTION_RESULT {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING'
}
export class LckProcessExecution extends LckBaseModel {
  text!: string;
  trigger_id!: string;
  when!: Date;
  result!: EXECUTION_RESULT;
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
