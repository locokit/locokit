import { Type, Static, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'

export const workflowSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
    }),
    name: Type.String({
      description: 'Name of the workflow',
    }),
    slug: Type.String({
      description: 'Slug of the workflow',
    }),
    documentation: Type.String({
      description: 'Documentation of the workflow',
    }),
    filepath: Type.String({
      description: 'Filepath to be executed when trigerred',
    }),
    public: Type.Boolean({
      description: 'Is the workflow available publicly',
      default: false,
    }),
    createdAt: Type.String({
      format: 'date-time',
      description: 'Creation date of the workflow',
    }),
    updatedAt: Type.String({
      format: 'date-time',
      description: 'Update date of the workflow',
    }),
  },
  {
    $id: 'WorkflowSchema',
    additionalProperties: false,
  },
)

export type WorkflowSchema = Static<typeof workflowSchema>

// Schema for the data that is being returned
export const workflowResultSchema = workflowSchema
export type WorkflowResult = Static<typeof workflowResultSchema>

export const workflowDataExternalSchema = Type.Partial(
  Type.Pick(workflowSchema, ['name', 'documentation', 'filepath']),
  {
    $id: 'WorkflowDataExternal',
    additionalProperties: false,
  },
)
export type WorkflowDataExternal = Static<typeof workflowDataExternalSchema>
export const workflowDataExternalValidator = getValidator(workflowDataExternalSchema, dataValidator)

export const workflowDataInternalSchema = Type.Omit(workflowSchema, ['id'], {
  $id: 'WorkflowDataInternal',
  additionalProperties: false,
})
export type WorkflowDataInternal = Static<typeof workflowDataInternalSchema>
export const workflowDataInternalValidator = getValidator(workflowDataInternalSchema, dataValidator)

export const workflowPatchExternalSchema = Type.Pick(
  workflowSchema,
  ['name', 'documentation', 'filepath', 'public'],
  {
    $id: 'WorkflowPatchExternal',
    additionalProperties: false,
  },
)
export type WorkflowPatch = Static<typeof workflowPatchExternalSchema>
export const workflowPatchValidator = getValidator(workflowPatchExternalSchema, dataValidator)

export const workflowPatchInternalSchema = Type.Omit(workflowSchema, ['id'], {
  $id: 'WorkflowPatchInternal',
  additionalProperties: false,
})
export type WorkflowPatchInternal = Static<typeof workflowPatchInternalSchema>
export const workflowPatchInternalValidator = getValidator(
  workflowPatchInternalSchema,
  dataValidator,
)

// Schema for allowed query properties
export const workflowQuerySchema = querySyntax(workflowSchema)
export type WorkflowQuery = Static<typeof workflowQuerySchema>
export const workflowQueryValidator = getValidator(workflowQuerySchema, queryValidator)
