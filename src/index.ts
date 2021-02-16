export enum COLUMN_TYPE {
  BOOLEAN = 1,
  STRING = 2,
  NUMBER = 3,
  FLOAT = 4,
  DATE = 5,
  USER = 6,
  GROUP = 7,
  RELATION_BETWEEN_TABLES = 8,
  LOOKED_UP_COLUMN = 9,
  SINGLE_SELECT = 10,
  MULTI_SELECT = 11,
  FORMULA = 12,
  FILE = 13,
  MULTI_USER = 14,
  MULTI_GROUP = 15,
  TEXT = 16,
  URL = 17,
  GEOMETRY_POINT = 18,
  GEOMETRY_POLYGON = 19,
  GEOMETRY_LINESTRING = 20
}

export enum USER_PROFILE {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER'
}

export enum GROUP_ROLE {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum WORKSPACE_ROLE {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum BLOCK_TYPE {
  TABLE_VIEW = 'TableView',
  KANBAN_VIEW = 'KanbanView',
  DETAIL_VIEW = 'DetailView',
  PARAGRAPH = 'Paragraph',
  MARKDOWN = 'Markdown',
  MEDIA = 'Media',
}

export enum MEDIA_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
  GALLERY = 'gallery',
  CAROUSEL = 'carousel',
}

export enum ERROR_CODE {
  VIEW_LOCKED = 'VIEW_LOCKED',
  VIEW_USED_IN_BLOCK = 'VIEW_USED_IN_BLOCK',
}
export enum ERROR_LABEL {
  VIEW_LOCKED = 'View is locked',
  VIEW_USED_IN_BLOCK = 'View is used in a Block',
}

export interface TableViewDefinition {
  id: string;
  columns: {
    id: string;
    column_type_id: COLUMN_TYPE;
    position: number;
    editable: boolean;
    text: string;
    settings: object;
    table_id: string;
  }[];
}

export interface TableViewContent {
  data: {
    id: string;
    text: string;
    table_id: string;
    data: object;
  }[];
}

export interface Block {
  id: string;
  type: BLOCK_TYPE;
}

export interface BlockParagraph extends Block {
  type: BLOCK_TYPE.PARAGRAPH;
  settings: ParagraphSettings;
}

export interface BlockMarkdown extends Block {
  type: BLOCK_TYPE.MARKDOWN;
  settings: MarkdownSettings;
}

export interface BlockTableView extends Block {
  type: BLOCK_TYPE.TABLE_VIEW;
  settings: TableViewSettings;
}

export interface BlockTableViewEnhanced extends BlockTableView {
  definition: TableViewDefinition;
  content: TableViewContent;
}

export interface BlockKanbanView extends Block {
  type: BLOCK_TYPE.KANBAN_VIEW;
  settings: KanbanSettings;
}

export interface BlockMedia extends Block {
  type: BLOCK_TYPE.MEDIA;
  settings: MediaSettings;
}

export interface ParagraphSettings {
  content: string;
}

export interface MarkdownSettings {
  content: string;
}

export interface MediaSettings {
  displayMode: MEDIA_TYPE;
  medias: {
    name: string;
    srcURL: string;
    type: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO;
  }[];
}

export interface KanbanSettings {
  /**
   * Id of the table_view in database
   */
  id: string;
  /**
   * View's column id on which the kanban's columns is displayed
   */
  columnId: string;
  /**
   * View's column values to use for creating kanban's columns
   */
  columnValues: {
    valueId: string;
    position: number;
  }[];
}

export interface TableViewSettings {
  id: string; // Id of the table_view in database
  pageDetailId: string; // Id of the page to open for detail purpose
  addAllowed: boolean; // Allow the user to create a row from this table view
  exportAllowed: boolean; // Allow the user to export data from this table view
}
