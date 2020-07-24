export enum BlockTypes {
  TABLEVIEW = 'TableView',
  PARAGRAPH = 'Paragraph',
  MARKDOWN = 'Markdown'
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
