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
    const datasource = await this.app.service(SERVICES.WORKSPACE_DATASOURCE).find({
      query: {
        slug: params?.route?.datasourceSlug,
        $eager: '[tables.[fields,relations]]',
      },
      route: {
        workspaceSlug: params?.route?.workspaceSlug,
      },
    })

    if (datasource.total !== 1) throw new NotFound('Datasource not found.')

    /**
     * According the type of mermaid diagram,
     * we generate a specific syntax
     */
    let mermaidDiagram = ''
    switch (params?.query?.type) {
      case 'er':
        mermaidDiagram += 'erDiagram\n'
        datasource.data?.[0]?.tables?.forEach((t) => {
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
        mermaidDiagram += 'classDiagram\n'
        datasource.data?.[0]?.tables?.forEach((t) => {
          mermaidDiagram += 'class ' + (t.schema ? t.schema + '.' : '') + t.slug + ' {\n'
          t.fields.forEach((f: TableFieldResult) => {
            mermaidDiagram += '\t' + f.type + ' ' + f.slug
            if (f.settings.primary) mermaidDiagram += ' 🔑'
            mermaidDiagram += '\n'
          })
          mermaidDiagram += '}\n'
          t.relations.forEach((r: TableRelationResult) => {
            mermaidDiagram += r.settings.fromTable + ' --|> ' + r.settings.toTable + ' \n'
          })
        })
    }

    return mermaidDiagram
  }
}
