<template>
  <Story auto-props-disabled title="MessageForUser" icon="bi:chat-fill">
    <Variant title="default">
      <MessageForUser status="success" custom-msg-tk-success-form="Good game" />
      <MessageForUser status="success" />
      <MessageForUser status="failed" custom-msg-tk-success-form="Try again" />
      <MessageForUser status="failed" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MessageForUser from '../components/MessageForUser/MessageForUser.vue'
</script>
