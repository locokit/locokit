/**
 * Extension of Typebox typings
 * cf https://github.com/sinclairzx81/typebox#unsafe-types
 */
import { Type, Static, TSchema } from '@sinclair/typebox'

// Nullable<T>

export function OptionalNullable<T extends TSchema>(schema: T) {
  return Type.Optional(Type.Unsafe<Static<T> | null>({ ...schema, nullable: true, default: null }))
}

export function Nullable<T extends TSchema>(schema: T) {
  return Type.Unsafe<Static<T> | null>({ ...schema, nullable: true, default: null })
}
