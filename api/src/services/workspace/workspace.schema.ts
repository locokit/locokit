import { Type, querySyntax, Static } from '@feathersjs/typebox'

// Schema for the basic data model (e.g. creating new entries)
// export const workspaceDataJSONSchema: JSONSchemaDefinition =

export const workspaceSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the workspace',
    }),
    slug: Type.String({
      description:
        'Slug to reference the workspace in URL, easier to read/memorize for end users',
    }),
    legacy: Type.Boolean({
      description: 'Does this workspace use the legacy mode for storing data',
    }),
    public: Type.Boolean({
      description: 'Allow the workspace to be findable/visible publicly',
    }),
    documentation: Type.String({
      description: 'Explain what is this workspace',
    }),
    settings: Type.Object(
      {
        color: Type.String({
          description: 'Main color for this workspace',
        }),
        backgroundColor: Type.String({
          description: 'Main background color for this workspace',
        }),
        icon: Type.String({
          description: 'Icon displayed in the workspace list',
        }),
      },
      {
        description: "Workspace's settings",
      },
    ),
    createdBy: Type.Number({
      description: "Workspace's user creator",
    }),
  },
  {
    $id: 'WorkspaceSchema',
    additionalProperties: false,
  },
)

export type WorkspaceSchema = Static<typeof workspaceSchema>

export const workspaceDataSchema = Type.Omit(workspaceSchema, [
  'id',
  'createdBy',
])
export type WorkspaceData = Static<typeof workspaceDataSchema>

// Schema for making partial updates
export const workspacePatchSchema = Type.Omit(workspaceSchema, ['id'])

export type WorkspacePatch = Static<typeof workspacePatchSchema>

// Schema for the data that is being returned
export const workspaceResultSchema = workspaceSchema
export type WorkspaceResult = Static<typeof workspaceResultSchema>

// Schema for allowed query properties
export const workspaceQuerySchema = Type.Intersect(
  [
    querySyntax(Type.Omit(workspaceSchema, ['settings'])),
    Type.Object({
      $forCurrentUser: Type.Optional(Type.Boolean()),
    }),
  ],
  { additionalProperties: false },
)
export type WorkspaceQuery = Static<typeof workspaceQuerySchema>
