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
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.base-button:hover {
  filter: brightness(0.92);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}

.base-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
</style>