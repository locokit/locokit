export const COLUMN_TYPE = {
  BOOLEAN: 1,
  STRING: 2,
  NUMBER: 3,
  FLOAT: 4,
  DATE: 5,
  USER: 6,
  GROUP: 7,
  RELATION_BETWEEN_TABLES: 8,
  LOOKED_UP_COLUMN: 9,
  SINGLE_SELECT: 10,
  MULTI_SELECT: 11,
  FORMULA: 12,
  FILE: 13,
  MULTI_USER: 14,
  MULTI_GROUP: 15,
  TEXT: 16
}

export const USER_PROFILE = {
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  USER: 'USER'
}

export const GROUP_ROLE = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
}

export const WORKSPACE_ROLE = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
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

export interface Block {
  id: string;
  type: BLOCK_TYPE;
}

export interface BlockParagraph extends Block {
  type: BLOCK_TYPE.PARAGRAPH;
  settings: {
    content: string;
  };
}

export interface BlockMardown extends Block {
  type: BLOCK_TYPE.MARKDOWN;
  settings: {
    content: string;
  };
}

export interface BlockTableView extends Block {
  type: BLOCK_TYPE.TABLE_VIEW;
  settings: {
    /**
     * Id of the table_view in database
     */
    id: string;
  };
}

export interface BlockKanbanView extends Block {
  type: BLOCK_TYPE.KANBAN_VIEW;
  settings: {
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
    }[]
  };
}

export interface BlockMedia extends Block {
  type: BLOCK_TYPE.MEDIA;
  settings: {
    /**
     * Display mode
     * Single image, Single Video
     * Carousel or Gallery
     */
    displayMode: MEDIA_TYPE;
    medias: {
      name: string;
      srcURL: string;
      type: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO;
    }[];
  };
}
