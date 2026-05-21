<script>
import BaseButton from '../Components/BaseButton.vue'

export default {
  name: 'PostcodePage',
  components: {
    BaseButton
  },
  data() {
    return {
        postcode: '',
        errorMessage: ''
    }
    },
    methods: {
      handleShowMap() {
        const trimmedPostcode = this.postcode.trim()

        if (!trimmedPostcode) {
          this.errorMessage = 'Indtast et postnummer'
          return
        }

        this.errorMessage = ''
        this.$router.push(`/map/${trimmedPostcode}`)
      }
    }
}
</script>

<template>
  <main class="postcode-page">
    <section class="postcode-card">
      <h1 class="postcode-title">Indtast postnummer</h1>
      <p class="postcode-subtitle">Find nærmeste genbrugsstation og se affaldsinfo i dit område.</p>

      <input
        v-model="postcode"
        type="text"
        placeholder="Prøv: 4000, 4040, 4130"
        class="postcode-input"
      />

      <BaseButton class="postcode-button" @click="handleShowMap">
        Vis kort
      </BaseButton>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </section>
  </main>
</template>

<style scoped>
.postcode-page {
  width: 100%;
  min-height: 100%;
  background: var(--color-bg);
  padding: var(--gap-large) var(--gap-med);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.postcode-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface-muted);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  padding: var(--gap-large);
  text-align: center;
  margin-top: var(--gap-large);
}

.postcode-title {
  font-family: var(--font-heading);
  color: var(--color-primary);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--gap-small);
}

.postcode-subtitle {
  font-family: var(--font-body);
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: 1.5;
  margin-bottom: var(--gap-large);
}

.postcode-input {
  width: 100%;
  height: 44px;
  padding: 0 var(--gap-med);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  margin-bottom: var(--gap-med);
  outline: none;
}

.postcode-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.postcode-button {
  display: block;
  width: 100%;
}

.postcode-button :deep(button) {
  width: 100%;
  border-radius: var(--border-radius-round);
}

.error-message {
  margin-top: var(--gap-med);
  color: var(--color-accent);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

@media (min-width: 768px) {
  .postcode-page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .postcode-card {
    max-width: 520px;
    padding: var(--gap-xl);
  }

  .postcode-title {
    font-size: var(--font-size-h1);
  }
}

@media (min-width: 1024px) {
  .postcode-card {
    margin-top: var(--gap-xl);
  }
}
</style>