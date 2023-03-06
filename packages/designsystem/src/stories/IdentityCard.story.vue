<template>
  <Story title="IdentityCard" icon="bi:person-vcard-fill">
    <Variant title="default">
      <IdentityCard
        title="Ellie"
        subtitle="Ellie Williams"
        icon="bi-person"
        name-tag="ADMIN"
      />
      <IdentityCard
        title="Ellie"
        subtitle="Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams Ellie Williams"
        icon="bi-person"
        name-tag="CREATOR"
      />
      <IdentityCard
        title="Ellie"
        subtitle="Ellie Williams"
        icon="bi-person"
        name-tag="MEMBER"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import IdentityCard from '../components/IdentityCard/IdentityCard.vue'
</script>
