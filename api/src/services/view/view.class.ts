import { MethodNotAllowed, NotAcceptable } from '@feathersjs/errors'
import { NullableId, Params } from '@feathersjs/feathers'
import { ERROR_CODE, ERROR_LABEL } from '@locokit/lck-glossary/src'
import { Service, ObjectionServiceOptions } from 'feathers-objection'
import { Application } from '../../declarations'
import { TableView } from '../../models/tableview.model'

interface Options extends ObjectionServiceOptions {
  Model: any
}

export class View extends Service<TableView> {
  app!: Application
  constructor (options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options
    super({
      ...otherOptions,
      model: Model,
    })
    this.app = app
  }

  async remove (id: NullableId, params?: Params): Promise<TableView | TableView[] | any> {
    if (id === null) {
      return await Promise.reject(new MethodNotAllowed('Can not remove multiple entries'))
    }
    /**
     * Load the current view
     */
    const currentView = await this._get(id, {})
    /**
       * Check the view is not locked
       */
    if (currentView.locked) {
      throw new NotAcceptable(ERROR_LABEL.VIEW_LOCKED, {
        code: ERROR_CODE.VIEW_LOCKED,
      })
    }
    /**
     * Check the view is not used in a Block
     */
    const blocks = await this.app.services.block._find({
      query: {
        settings: {
          id,
        },
      },
    })
    if (blocks.total > 0) {
      throw new NotAcceptable(ERROR_LABEL.VIEW_USED_IN_BLOCK, {
        code: ERROR_CODE.VIEW_USED_IN_BLOCK,
      })
    }
    /**
     * remove all table_view_has_table_column
     */
    await this.app.services['table-view-has-table-column']._remove(null, {
      query: {
        table_view_id: id,
        $noSelect: true,
      },
    })

    return await super.remove(id, params)
  }
}
