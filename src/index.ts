/* eslint-disable camelcase */
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
  GEOMETRY_LINESTRING = 20,
}

export enum COLUMN_GEO_TYPE {
  POINT = COLUMN_TYPE.GEOMETRY_POINT,
  LINESTRING = COLUMN_TYPE.GEOMETRY_LINESTRING,
  POLYGON = COLUMN_TYPE.GEOMETRY_POLYGON,
}

export enum ACTION_BUTTON_TYPE {
  PAGE_DETAIL_TO = 'page_detail_to',
  PROCESS_TRIGGER = 'process_trigger',
}

export enum BUTTON_CLASS {
  DANGER = 'danger',
  WARNING = 'warning',
  SUCCESS = 'success',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export enum AGGREGATE_FUNCTION {
  SUM = 'SUM',
  AVERAGE = 'AVG',
  COUNT = 'COUNT',
}

export enum USER_PROFILE {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER',
  CREATOR = 'CREATOR',
}

export enum GROUP_ROLE {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum BLOCK_TYPE {
  TABLESET = 'TableSet',
  DATARECORD = 'DataRecord',
  PARAGRAPH = 'Paragraph',
  MARKDOWN = 'Markdown',
  MEDIA = 'Media',
  KANBANSET = 'KanbanSet',
  HIGHLIGHTFIELD = 'HighlightField',
  MAPSET = 'MapSet',
  MAPFIELD = 'MapField',
  CARDSET = 'CardSet',
  ACTIONBUTTON = 'ActionButton',
  MARKDOWNFIELD = 'MarkdownField',
  FORMRECORD = 'FormRecord',
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

export enum GEOMETRY_TYPE {
  POINT = 'Point',
  LINESTRING = 'Linestring',
  POLYGON = 'Polygon',
}

export interface Block {
  id: string;
  type: BLOCK_TYPE;
}

export interface ParagraphSettings {
  content: string;
}

export interface BlockParagraph extends Block {
  type: BLOCK_TYPE.PARAGRAPH;
  settings: ParagraphSettings;
}

export interface MarkdownSettings {
  content: string;
}

export interface BlockMarkdown extends Block {
  type: BLOCK_TYPE.MARKDOWN;
  settings: MarkdownSettings;
}

export interface TableSetSettings {
  id: string; // uuid of table_view
  pageDetailId: string; // uuid of page, allow to redirect to a detail page (display only a record)
  addAllowed: boolean; // option to allow creation of record
  exportAllowed: boolean; // option to allow data export
}

export interface BlockTableSet extends Block {
  type: BLOCK_TYPE.TABLESET;
  settings: TableSetSettings;
}

export interface DataRecordSettings {
  id: string; // uuid of table_view
}

export interface BlockDataRecord extends Block {
  type: BLOCK_TYPE.DATARECORD;
  settings: DataRecordSettings;
}

export interface KanbanSetSettings {
  id: string; // uuid of table_view
  columnId: string; // uuid table_column
  columnValues: { // View's column values to use for creating kanban's columns
    valueId: string; // uuid
    position: number; // column position
  }[];
}

export interface BlockKanbanSet extends Block {
  type: BLOCK_TYPE.KANBANSET;
  settings: KanbanSetSettings;
}

export interface MediaSettings {
  displayMode: MEDIA_TYPE; // display mode
  medias: {
    name: string; // image or video name
    srcURL: string; // image or video public url
    type: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO; // media type
  }[];
}

export interface BlockMedia extends Block {
  type: BLOCK_TYPE.MEDIA;
  settings: MediaSettings;
}

export interface MapSetSettings {
  id: string;// uuid of the table_view
  pageDetailId: string; // uuid of page, allow to redirect to a detail page (display only a record)
  sources: {
    geometry: GEOMETRY_TYPE; // geometry type
    field: string; // column / field 's UUID
    popup: boolean; // do we display a popup
    popupSettings: { // a popup is like a card
      title: string; // column / field 's UUID
      contentFields: {
        field: string; // column / field's UUID
        class: string; // css class to apply on this field
      }[]
    }
  }[];
}

export interface BlockMapSet extends Block {
  type: BLOCK_TYPE.MAPSET;
  settings: MapSetSettings;
}

export interface BlockMapField extends Block {
  type: BLOCK_TYPE.MAPFIELD;
  settings: MapSetSettings;
}

export interface HighlightFieldSettings {
  id: string;// uuid of the table_view
  columnId: string; // uuid of the column. Select data to display.
  prefix: string; // Add a prefix.
  suffix: string; // Add a suffix.
  aggregate: AGGREGATE_FUNCTION; // Parse data according to a function
}

export interface BlockHighlightField extends Block {
  type: BLOCK_TYPE.HIGHLIGHTFIELD;
  settings: HighlightFieldSettings;
}

export interface ActionButtonSettings {
  id: string; // uuid of table_view
  label: string; // Title of the button
  classButton: BUTTON_CLASS; // Class applied to the button,
  icon: string; // Class icon injected in the button, at the beginning, like NavBar,
  action: ACTION_BUTTON_TYPE; // action's type
  processId: string; // uuid trigger
  pageDetailId: string; // uuid pageDetail
  pageRedirectId: string; // uuid page detail
  pageQueryFieldId: string; // uuid from a relation_between_table column, allows to get data form another table
  displayFieldId: string; // "uuid-of-the-field-used-for-display-purpose",
  displayFieldValue: boolean; // true // for the first iteration, we only use BOOLEAN fields
}

export interface BlockActionButton extends Block {
  type: BLOCK_TYPE.ACTIONBUTTON;
  settings: ActionButtonSettings;
}

export interface CardSetSettings extends Block {
  id: string; // uuid of table_view
  displayField: {
    fieldId: string; // uuid table_column
  }[] // To limit at 3 front side
}

export interface BlockCardSet extends Block {
  type: BLOCK_TYPE.CARDSET;
  settings: CardSetSettings;
}

export interface MarkdownFieldSettings extends Block {
  id: string; // uuid of table_view
  displayFieldId: string; // uuid table_column
}

export interface BlockMarkdownField extends Block {
  type: BLOCK_TYPE.MARKDOWNFIELD;
  settings: MarkdownFieldSettings;
}

export interface FormRecordSettings extends Block {
  id: string; // uuid of table_view
}

export interface BlockFormRecord extends Block {
  type: BLOCK_TYPE.FORMRECORD;
  settings: FormRecordSettings;
}
