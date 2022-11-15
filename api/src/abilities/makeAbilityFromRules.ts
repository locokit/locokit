import {
  MongoAbility,
  RawRuleFrom,
  AbilityOptions,
  AbilityTuple,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability'

function makeAbilityFromRules<
  A extends AbilityTuple = AbilityTuple,
  C extends MongoQuery = MongoQuery,
>(
  rules?: Array<RawRuleFrom<A, C>>,
  options?: AbilityOptions<A, C>,
): MongoAbility<A, C> {
  rules = rules ?? []
  options = options ?? {}
  return createMongoAbility(rules, options)
}

export default makeAbilityFromRules
