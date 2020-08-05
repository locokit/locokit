import { Application } from '../declarations';
import user from './user/user.service';
import row from './row/row.service';
import column from './column/column.service';
import workspace from './workspace/workspace.service';
import database from './database/database.service';
import table from './table/table.service';
import group from './group/group.service';
import permission from './permission/permission.service';
import page from './page/page.service';
import block from './block/block.service';
import chapter from './chapter/chapter.service';
import view from './view/view.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(user);
  app.configure(row);
  app.configure(column);
  app.configure(workspace);
  app.configure(database);
  app.configure(table);
  app.configure(group);
  app.configure(permission);
  app.configure(page);
  app.configure(block);
  app.configure(chapter);
  app.configure(view);
}
