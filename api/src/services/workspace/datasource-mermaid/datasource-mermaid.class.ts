/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { KnexAdapterParams } from '@feathersjs/knex'

import { Application } from '@/declarations'
import { SERVICES } from '@locokit/definitions'
import { DatasourceMermaidQuery } from './datasource-mermaid.schema'
import { NotFound } from '@feathersjs/errors/lib'
import { TableFieldResult } from '../table-field/table-field.schema'
import { TableRelationResult } from '../table-relation/table-relation.schema'

export interface DatasourceParams extends KnexAdapterParams<DatasourceMermaidQuery> {}

export class DatasourceMermaid {
  app!: Application

  async setup(app: Application) {
    this.app = app
  }

  async find(params: DatasourceParams) {
    const datasources = await this.app.service(SERVICES.WORKSPACE_DATASOURCE).find({
      query: {
        slug: params?.route?.datasourceSlug,
        $eager: '[tables.[fields,relations]]',
      },
      route: {
        workspaceSlug: params?.route?.workspaceSlug,
      },
    })

    if (datasources.total !== 1) throw new NotFound('Datasource not found.')

    if (!datasources.data[0].tables || datasources.data[0].tables.length === 0)
      return new NotFound('Impossible to display schema without tables.')

    /**
     * According to the type of mermaid diagram,
     * we generate a specific syntax
     */
    let mermaidDiagram = ''
    const currentDatasource = datasources.data?.[0]
    switch (params?.query?.type) {
      case 'er':
        mermaidDiagram += 'erDiagram\n'
        currentDatasource?.tables?.forEach((t) => {
          mermaidDiagram += '"' + (t.schema ? t.schema + '.' : '') + t.slug + '" {\n'
          t.fields.forEach((f: TableFieldResult) => {
            mermaidDiagram += '\t' + f.type + ' ' + f.slug + '\n'
          })
          mermaidDiagram += '}\n'
          t.relations.forEach((r: TableRelationResult) => {
            mermaidDiagram +=
              r.settings.fromTable + ' }|--|| ' + r.settings.toTable + ' : relation \n'
          })
        })
        break
      case 'class':
      default:
        // Mermaid transform class name and properties according to standard of Class Diagram
        mermaidDiagram += 'classDiagram\n'
        currentDatasource.tables?.forEach((table) => {
          mermaidDiagram +=
            '    class ' +
            (table.schema ? table.schema + '.' : '') +
            table.slug +
            ':::styleMermaidClass ' +
            ' {\n'
          table.fields.forEach((field: TableFieldResult) => {
            mermaidDiagram += '    ' + field.type.toLowerCase() + ' ' + field.slug
            if (field.settings.primary) mermaidDiagram += ' 🔑'
            mermaidDiagram += '\n'
          })
          mermaidDiagram += '    }\n'
          mermaidDiagram +=
            'click ' + table.slug + ' call window.openTableSidebar(' + table.id + ') \n'

          table.relations.forEach((relation: TableRelationResult) => {
            mermaidDiagram +=
              relation.settings.fromTableSlug + ' --|> ' + relation.settings.toTableSlug + ' \n'
          })
        })
    }
    return { data: mermaidDiagram }
  }
}
