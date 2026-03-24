<template>
  <v-btn class="base-button" @click="$emit('click')">
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'BaseButton',
  emits: ['click']
}
</script>

<style scoped>
.base-button {
  background-color: var(--accent-color) !important;
  color: var(--dark-text) !important;
  font-family: var(--font-body);
  font-weight: 600;
  text-transform: none;
  border-radius: 999px !important;
  padding-inline: 1.5rem;
}
</style>