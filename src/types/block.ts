export enum BlockTypes {
  TABLEVIEW = 'TableView',
  PARAGRAPH = 'Paragraph',
  MARKDOWN = 'Markdown',
  MEDIA = 'Media',
}

export enum MediaTypes {
  IMAGE = 'image',
  VIDEO = 'video',
  GALLERY = 'gallery',
  CAROUSEL = 'carousel',
}

export interface Block {
  id: string;
  type: BlockTypes | string;
}

export interface BlockParagraph {
  id: string;
  type: 'Paragraph';
  settings: {
    content: string;
  };
}

export interface BlockMedia {
  id: string;
  type: 'Media';
  settings: {
    displayMode: MediaTypes;
    medias: {
      name: string;
      srcURL: string;
      type: MediaTypes;
    }[];
  };
}
