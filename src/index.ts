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
  DATETIME = 21,
  GEOMETRY_MULTIPOINT = 22,
  GEOMETRY_MULTIPOLYGON = 23,
  GEOMETRY_MULTILINESTRING = 24,
  VIRTUAL_LOOKED_UP_COLUMN = 25,
}

export enum COLUMN_GEO_TYPE {
  POINT = COLUMN_TYPE.GEOMETRY_POINT,
  LINESTRING = COLUMN_TYPE.GEOMETRY_LINESTRING,
  POLYGON = COLUMN_TYPE.GEOMETRY_POLYGON,
  MULTIPOINT = COLUMN_TYPE.GEOMETRY_MULTIPOINT,
  MULTILINESTRING = COLUMN_TYPE.GEOMETRY_MULTILINESTRING,
  MULTIPOLYGON = COLUMN_TYPE.GEOMETRY_MULTIPOLYGON,
}

export enum ACTION_BUTTON_TYPE {
  PAGE_DETAIL_TO = 'page_detail_to',
  PROCESS_TRIGGER = 'process_trigger',
}

export enum COLOR_CLASS {
  DANGER = 'danger',
  WARNING = 'warning',
  SUCCESS = 'success',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  BLACK = 'black',
}
export enum TEXT_ALIGN_CLASS {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  JUSTIFY = 'justify',
}

export enum AGGREGATE_FUNCTION {
  SUM = 'SUM',
  AVERAGE = 'AVG',
  COUNT = 'COUNT',
}

export enum TYPE_PAGE {
  PAGEDETAIL = 'PageDetail',
  PAGE = 'Page',
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
  TABLE_SET = 'TableSet',
  DATA_RECORD = 'DataRecord',
  PARAGRAPH = 'Paragraph',
  MARKDOWN = 'Markdown',
  MEDIA = 'Media',
  KANBAN_SET = 'KanbanSet',
  HIGHLIGHT_FIELD = 'HighlightField',
  MAP_SET = 'MapSet',
  MAP_FIELD = 'MapField',
  CARD_SET = 'CardSet',
  ACTION_BUTTON = 'ActionButton',
  MARKDOWN_FIELD = 'MarkdownField',
  FORM_RECORD = 'FormRecord',
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

export interface TriggerBlockEvent<T> {
  name: string; // Name of the trigger event (must be unique in a page)
  type: T; // Type of the trigger event
  field?: string; // The field to include in an event
  raiseOnLoad?: boolean; // Trigger the event on load
}

export interface CaughtBlockEvent {
  type: 'select' | 'reset' // Type of the catch event
  targetField?: string; // The target id
}

export interface CommunicatingBlockSettings<T extends string = string, CustomCaughtEvent extends CaughtBlockEvent = CaughtBlockEvent> {
  caughtEvents?: Record<string, CustomCaughtEvent[]>; // The key is the trigger event name of the event triggered by another block
  triggerEvents?: TriggerBlockEvent<T>[]; // Events to trigger for the block
}

export interface Block {
  id: string;
  type: BLOCK_TYPE;
  elevation?: boolean; // option elevation
  conditionalDisplayTableViewId?: string; // table_view id which allow to choose one field
  conditionalDisplayFieldId?: string; // field id to compare with conditionalDisplayFieldValue
  conditionalDisplayFieldValue?: boolean; // value to compare to display block (only boolean for now)
}

export interface ParagraphSettings extends CommunicatingBlockSettings {
  content: string; // text to display
}

export interface BlockParagraph extends Block {
  type: BLOCK_TYPE.PARAGRAPH;
  settings: ParagraphSettings;
}

export interface MarkdownSettings {
  content: string; // text to display
  textColor?: COLOR_CLASS; // option to choose text color
  textAlign?: TEXT_ALIGN_CLASS; // option to choose text position
}

export interface BlockMarkdown extends Block {
  type: BLOCK_TYPE.MARKDOWN;
  settings: MarkdownSettings;
}

export interface TableSetSettings {
  id: string; // uuid of table_view
  pageDetailId?: string; // uuid of page, allow to redirect to a detail page (display only a record)
  addAllowed?: boolean; // option to allow creation of record
  exportAllowed?: boolean; // option to allow data export
  deleteAllowed?: boolean; // option to allow record deletion
  duplicateAllowed?: boolean; // option to allow record duplication
  pagination?: number; // maximum allowed number of items per page
}

export interface BlockTableSet extends Block {
  type: BLOCK_TYPE.TABLE_SET;
  settings: TableSetSettings;
}

export interface DataRecordSettings extends CommunicatingBlockSettings<'update'> {
  id: string; // uuid of table_view
}

export interface BlockDataRecord extends Block {
  type: BLOCK_TYPE.DATA_RECORD;
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
  type: BLOCK_TYPE.KANBAN_SET;
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

export type MapSourceTriggerEvents = TriggerBlockEvent<'selectRow'|'selectField'>[];

export interface MapFeatureStyle {
  fill?: {
    color?: string;
    width?: number;
  };
  stroke?: {
    color?: string;
    width?: number;
  }
  icon?: string; // used icon for the feature
}

export interface MapSourceStyle {
  default?: MapFeatureStyle & {
    layout?: Record<string, unknown>; // Mapbox layout properties
    paint?: Record<string, unknown>; // Mapbox paint properties
  },
  fields?: string[]; // the field UUIDs used to customize the features
  dataDriven?: { // The style to apply to the features when the related fields have some specific values
    values: {
      field: string;
      value: unknown;
    }[]
    style: MapFeatureStyle;
  }[]
}

export interface MapSourceSettings {
  id: string; // uuid of the table_view
  geometry?: GEOMETRY_TYPE; // geometry type
  field?: string; // column / field 's UUID
  aggregationField?: string; // aggregation column / field 's UUID
  popup?: boolean; // do we display a popup
  popupSettings?: { // a popup is like a card
    title?: string; // column / field 's UUID
    pageDetailId?: string; // uuid of page, allow to redirect to a detail page (display only a record)
    onHover?: boolean;
    contentFields?: {
      field: string; // column / field's UUID
      class?: string; // css class to apply on this field
    }[]
  }
  selectable?: boolean; // can we select a feature
  style?: MapSourceStyle; // style of the source
  triggerEvents?: MapSourceTriggerEvents; // event to trigger
  caughtEvents?: string[] // ids of the caught events to capture for this source
}

export interface MapCaughtBlockEvent extends CaughtBlockEvent {
  centerToFeature?: boolean;
  zoomLevel?: number;
}

export interface MapSettings extends CommunicatingBlockSettings<'', MapCaughtBlockEvent> {
  addAllowed?: boolean;
  addSourceId?: string; // uuid of the table view to use when creating new record
  addButtonTitle?: string; // title of the "add button" and the matching dialog
  sources: MapSourceSettings[];
}

export interface BlockMapSet extends Block {
  type: BLOCK_TYPE.MAP_SET;
  settings: MapSettings;
}

export interface BlockMapField extends Block {
  type: BLOCK_TYPE.MAP_FIELD;
  settings: MapSettings;
}

export interface HighlightFieldSettings {
  id: string;// uuid of the table_view
  columnId: string; // uuid of the column. Select data to display.
  prefix: string; // Add a prefix.
  suffix: string; // Add a suffix.
  aggregate: AGGREGATE_FUNCTION; // Parse data according to a function
}

export interface BlockHighlightField extends Block {
  type: BLOCK_TYPE.HIGHLIGHT_FIELD;
  settings: HighlightFieldSettings;
}

export interface ActionButtonSettings {
  id: string; // uuid of table_view
  label: string; // Title of the button
  classButton: COLOR_CLASS; // Class applied to the button,
  icon?: string; // Class icon injected in the button, at the beginning, like NavBar,
  action: ACTION_BUTTON_TYPE; // action's type
  processId?: string; // uuid trigger
  pageDetailId?: string; // uuid pageDetail
  pageRedirectId?: string; // uuid page detail
  typePageTo: TYPE_PAGE; // Type page, needed for router
  pageQueryFieldId?: string; // uuid from a relation_between_table column, allows to get data form another table
  displayFieldId?: string; // field id to compare with conditionalDisplayFieldValue
  displayFieldValue?: boolean; // value to compare to display block (only boolean for now)
  notificationSuccessTitle?: string; // Message title display in the notification when action succeed
  notificationSuccessDescription?: string; // Message description display in the notification when action succeed
  notificationErrorTitle?: string; // Message title display in the notification when action failed
  notificationErrorDescription?: string; // Message title display in the notification when action failed
}

export interface BlockActionButton extends Block {
  type: BLOCK_TYPE.ACTION_BUTTON;
  settings: ActionButtonSettings;
}

export interface CardSetSettings {
  id: string; // uuid of table_view
  displayField: {
    fieldId: string; // uuid table_column
  }[] // To limit at 3 front side
}

export interface BlockCardSet extends Block {
  type: BLOCK_TYPE.CARD_SET;
  settings: CardSetSettings;
}

export interface MarkdownFieldSettings {
  id: string; // uuid of table_view
  displayFieldId: string; // uuid table_column
  textColor?: COLOR_CLASS; // option to choose text color
  textAlign?: TEXT_ALIGN_CLASS; // option to choose text position
}

export interface BlockMarkdownField extends Block {
  type: BLOCK_TYPE.MARKDOWN_FIELD;
  settings: MarkdownFieldSettings;
}

export interface FormRecordSettings extends CommunicatingBlockSettings<'update'|'submit'> {
  id: string; // uuid of table_view
}

export interface BlockFormRecord extends Block {
  type: BLOCK_TYPE.FORM_RECORD;
  settings: FormRecordSettings;
}
