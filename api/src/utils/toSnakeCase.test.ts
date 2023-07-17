import { describe, it, expect } from 'vitest'
import { toSnakeCase } from './toSnakeCase'

describe('[toSnakeCase] utils to snake case', () => {
  const expectedConversions: Record<string, string> = {
    CreatedBy: 'created_by',
    événementiel: 'evenementiel',
    CamelCASE: 'camel_case',
    snakeCase: 'snake_case',
    CustomerID: 'customer_id',
    GPS: 'gps',
    'IP address': 'ip_address',
    'IP-address': 'ip_address',
    'Another & Another, one too': 'another_another_one_too',
    'random ----- Thing123': 'random_thing123',
    'kebab-case-example': 'kebab_case_example',
    aID: 'a_id',
    TheONE: 'the_one',
    CamelCASERules: 'camel_case_rules',
    IndexID: 'index_id',
    theIDForUSGovAndDOD: 'the_id_for_us_gov_and_dod',
    TheID_: 'the_id_',
    _IDOne: '_id_one',
  }

  it('convert correctly each strings', () => {
    const keys = Object.keys(expectedConversions)
    expect.assertions(keys.length)
    keys.forEach((k) => {
      expect(toSnakeCase(k)).toBe(expectedConversions[k])
    })
  })
})
