<template>
  <Story title="IdentityCard" icon="bi:person-vcard-fill">
    <Variant title="default">
      <IdentityCard
        title="Ellie"
        subtitle="Ellie Williams"
        icon="bi-person"
        name-tag="Admin"
      />
      <IdentityCard
        title="Daenerys Targaryen"
        subtitle="Queen Daenerys Stormborn of the House Targaryen, the First of Her Name, Queen of the Andals, the Rhoynar and the First Men, Lady of the Seven Kingdoms and Protector of the Realm, Lady of Dragonstone, Queen of Meereen, Khaleesi of the Great Grass Sea, the Unburnt, Breaker of Chains and Mother of Dragons."
        icon="bi-person"
        name-tag="Creator"
      />
      <IdentityCard
        title="Marvin"
        icon="bi-robot"
        name-tag="Severe depression and boredom"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import IdentityCard from '../components/IdentityCard/IdentityCard.vue'
</script>

<docs lang="md">
### IdentyCard

Allows to display a some information in a specific format.

Still in progress
</docs>
