import { Type, Static, StringEnum, getValidator } from '@feathersjs/typebox'
import { queryValidator } from '@/commons/validators'

// Schema for allowed query properties
export const datasourceMermaidQuerySchema = Type.Object(
  {
    type: Type.Optional(StringEnum(['er', 'class'])),
  },
  {
    additionalProperties: false,
  },
)
export type DatasourceMermaidQuery = Static<typeof datasourceMermaidQuerySchema>
export const datasourceMermaidQueryValidator = getValidator(
  datasourceMermaidQuerySchema,
  queryValidator,
)
