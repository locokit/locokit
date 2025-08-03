import { LocoKitTableFieldComplexValue, LocoKitTableFieldValue } from './fields'

/**
 * Generic interface for LocoKit table records
 */
export interface LocoKitTableRecord extends Record<string, LocoKitTableFieldValue> {}

/**
 * An enhanced type for a specific business type,
 * useful when we need to complexify datasource record
 * with hydrated values (foreign keys => record from the foreign table)
 */
export type LocoKitTableRecordEnhanced<T extends LocoKitTableRecord = LocoKitTableRecord> = {
  [Property in keyof T]: T[Property] | LocoKitTableFieldComplexValue
}
