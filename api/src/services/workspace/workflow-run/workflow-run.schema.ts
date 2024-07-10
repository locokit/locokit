import { Static, StringEnum, Type, querySyntax, getValidator } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '@/commons/validators'

export const workflowRunSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid',
      description: 'Id of the workflow run',
    }),
    workflowId: Type.String({
      format: 'uuid',
      description: 'Matching workflow Id',
    }),
    input: Type.Any({
      description: `
      Data transmitted for the workflow.
      Any shape accepted, depending on the workflow.
      Need to be validated by the workflow itself.
    `,
    }),
    output: Type.Array(
      Type.Object({
        t: Type.Number({
          description: 'Time of the log in ms',
        }),
        m: Type.String({
          description: 'Message log',
        }),
        a: Type.Optional(
          Type.Any({
            description: 'Attachment',
          }),
        ),
        s: StringEnum(['INFO', 'DEBUG', 'ERROR'], { default: 'INFO' }),
      }),
      {
        description: 'Timed-logs transmitted by the workflow.',
      },
    ),
    result: Type.Any({
      description: `
      Result transmitted by the workflow,
      can be transmitted to the end user
      as the workflow result.
    `,
    }),
    status: StringEnum(['OK', 'NOK']),
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
    $id: 'WorkflowRunSchema',
    additionalProperties: false,
  },
)
export type WorkflowRunSchema = Static<typeof workflowRunSchema>

export const workflowRunDataExternalSchema = Type.Pick(workflowRunSchema, ['workflowId', 'input'], {
  $id: 'WorkflowRunDataExternalSchema',
  additionalProperties: false,
})
export type WorkflowRunDataExternal = Static<typeof workflowRunDataExternalSchema>
export const workflowRunDataExternalValidator = getValidator(
  workflowRunDataExternalSchema,
  dataValidator,
)
export const workflowRunDataSchema = Type.Omit(workflowRunSchema, ['id'], {
  $id: 'WorkflowRunDataSchema',
  additionalProperties: false,
})
export type WorkflowRunData = Static<typeof workflowRunDataSchema>
export const workflowRunDataValidator = getValidator(workflowRunDataSchema, dataValidator)

// Schema for allowed query properties
export const workflowRunQuerySchema = querySyntax(workflowRunSchema)
export type WorkflowRunQuery = Static<typeof workflowRunQuerySchema>
export const workflowRunQueryValidator = getValidator(workflowRunQuerySchema, queryValidator)
