import { Ability, RawRuleFrom, AbilityOptions, AbilityTuple, MongoQuery } from '@casl/ability'

function makeAbilityFromRules<
  A extends AbilityTuple = AbilityTuple,
  C extends MongoQuery = MongoQuery,
>(rules?: Array<RawRuleFrom<A, C>>, options?: AbilityOptions<A, C>): Ability<A, C> {
  rules = rules ?? []
  options = options ?? {}
  return new Ability(rules, options)
}

export default makeAbilityFromRules
