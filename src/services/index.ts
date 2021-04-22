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
import container from './container/container.service'
import view from './view/view.service'
import columnrelation from './columnrelation/columnrelation.service'
import trr from './trr/trr.service'
import usergroup from './usergroup/usergroup.service'
import mailer from './mailer/mailer.service'
import authmanagement from './authmanagement/authmanagement.service'
import authentication from './authentication/authentication.service'
import tableViewHasTableColumn from './table_view_has_table_column/table_view_has_table_column.service'
import process from './process/process.service'
import processRun from './process_run/process_run.service'
import attachment from './attachment/attachment.service'
import upload from './upload/upload.service'
import permission from './permission/permission.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
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
  app.configure(processRun)
  app.configure(container)
  app.configure(attachment)
  app.configure(upload)
  app.configure(permission)
}
