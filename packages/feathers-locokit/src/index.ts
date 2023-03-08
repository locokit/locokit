import { createAdapter } from '@locokit/engine'
import { Connexion } from '@locokit/engine/adapters/interface'
import { getJSONTypeFromSQLType } from '@locokit/engine/utils/sqlTypeConverter'

export class SwaggerService {
  private readonly connexion: Connexion
  private readonly baseURL: string

  constructor(connexion: Connexion, baseURL: string) {
    this.connexion = connexion
    this.baseURL = baseURL
  }

  async generateOpenAPISpec() {
    const adapter = await createAdapter(this.connexion)
    const schemaTables = await adapter.retrieveSchema()

    const definitions: Record<string, any> = {}
    const paths: Record<string, any> = {}
    const xTagGroups: Array<{ name: string; tags: string[] }> = []

    schemaTables.forEach((currentTable) => {
      xTagGroups.push({
        name: currentTable.name,
        tags: [currentTable.name],
      })
      paths[this.baseURL + '/t/' + currentTable.name] = {
        get: {
          tags: [currentTable.name],
          responses: {
            200: {
              description: 'Table definition of ' + currentTable.name,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  fields: { type: 'string' },
                  comment: { type: 'string' },
                },
              },
            },
          },
        },
      }
      paths[this.baseURL + '/t/' + currentTable.name + '/r'] = {
        get: {
          tags: [currentTable.name],
          responses: {
            200: {
              description: 'Records of ' + currentTable.name,
              schema: {
                $ref: '#/definitions/' + currentTable.name,
              },
            },
          },
        },
      }
      definitions[currentTable.name] = {
        type: 'object',
        required: [currentTable.fields.filter((c) => !c.is_nullable).map((c) => c.name)],
        tags: [currentTable.name],
        properties: currentTable.fields.reduce<Record<string, any>>((result, c) => {
          result[c.name] = {
            type: getJSONTypeFromSQLType(c.data_type),
          }
          return result
        }, {}),
      }
    })

    return {
      swagger: '2.0',
      info: {
        title: 'LocoKit auto generated Swagger',
        description: 'This is A-MA-ZING !',
        version: '0.0.1-alpha.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost:3030',
      port: '3030',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      definitions,
      paths,
      'x-TagGroups': xTagGroups,
    }
  }

  async generateGraphQLSpec() {
    const adapter = await createAdapter(this.connexion)
    const schemaTables = await adapter.retrieveSchema()
    let schema = ''
    let QueryString = '  type Query {'
    const resolvers = {
      Query: {} as Record<string, Function>,
    }
    schemaTables.forEach((currentTable) => {
      const resolverName =
        currentTable.name === 'baserow' ? 'qb_' + currentTable.name : currentTable.name
      resolvers.Query[resolverName] = async () => {
        return await adapter.queryTable(currentTable.name)
      }
      schema += `
        type LCK_${currentTable.name} {
        ${currentTable.fields
          .map((f) => `    ${f.name}: String${'' /* f.is_nullable === true ? '' : '!' */}`)
          .join('\n')}
        }
      `
      QueryString += '\n    ' + resolverName + ': [LCK_' + currentTable.name + ']'
    })
    QueryString += '\n  }'
    schema += QueryString

    return {
      schema,
      resolvers,
    }
  }
}
