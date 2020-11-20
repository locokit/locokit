import { Application } from '../declarations'
import user from './user/user.service'
import row from './row/row.service'
import column from './column/column.service'
import workspace from './workspace/workspace.service'
import database from './database/database.service'
import table from './table/table.service'
import group from './group/group.service'
import page from './page/page.service'
import block from './block/block.service'
import chapter from './chapter/chapter.service'
import view from './view/view.service'
import columnrelation from './columnrelation/columnrelation.service'
import trr from './trr/trr.service'
import usergroup from './usergroup/usergroup.service'
import mailer from './mailer/mailer.service'
import authmanagement from './authmanagement/authmanagement.service'
import authentication from './authentication/authentication.service'
import tableViewHasTableColumn from './table_view_has_table_column/table_view_has_table_column.service'
import process from './process/process.service'
import processTrigger from './process_trigger/process_trigger.service'
import processExecution from './process_execution/process_execution.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(authentication)
  app.configure(user)
  app.configure(row)
  app.configure(column)
  app.configure(workspace)
  app.configure(database)
  app.configure(table)
  app.configure(group)
  app.configure(page)
  app.configure(block)
  app.configure(chapter)
  app.configure(view)
  app.configure(columnrelation)
  app.configure(trr)
  app.configure(usergroup)
  app.configure(mailer)
  app.configure(authmanagement)
  app.configure(tableViewHasTableColumn)
  app.configure(process)
  app.configure(processTrigger)
  app.configure(processExecution)
}
