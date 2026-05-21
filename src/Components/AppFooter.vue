<template>
  <footer class="app-footer">
    <p class="footer-text">© Zealand 2026</p>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  width: 100%;
  height: var(--footer-height);
  background-color: #4a4a4a;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.footer-text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--white-text);
}
</style>