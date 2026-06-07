<script>
import appleJuice from '@/Components/Images/applejuice.png'
import BaseButton from '@/Components/BaseButton.vue'
import CheckoutController from '@/Controller/Checkout.controller.js'
import UserController from '@/Controller/User.controller.js'

export default {
  components: {
    BaseButton,
  },

  data() {
    return {
      checkoutController: CheckoutController,
      trashCount: 0,
      trash: null,
      error: null,
      loading: true,
      uid: null,
      toast: null,
      // ↓ Kunne ændres til at være en del af trash objektet, så det ikke er nødvendigt at matche på TrashCategoryID
      trashCategories: [
        { name: 'Metal', value: 1 },
        { name: 'Restaffald', value: 2 },
        { name: 'Blød Plast', value: 3 },
        { name: 'Madaffald', value: 4 },
        { name: 'Pap', value: 5 },
        { name: 'Farligt Affald', value: 6 },
      ],
      stationCategories: [
        { name: 'Metal', value: 1 },
        { name: 'Sorter restaffald hjemme', value: 2 },
        { name: 'Blød Plast', value: 3 },
        { name: 'Sorter madaffald hjemme', value: 4 },
        { name: 'Pap', value: 5 },
        { name: 'Batterier', value: 6 },
      ],
    }
  },

  methods: {
    showToast(message) {
      this.toast = message
      setTimeout(() => {
        this.toast = null
      }, 3000)
    },

    async addtrash() {
      const user = UserController.getUserSession()

      if (!user) {
        this.showToast('Knappen kræver at du er logget ind')
        return
      }

      const checkoutResult = await this.checkoutController.getOrCreateOpenCheckout(user.UID)

      if (!checkoutResult.success) {
        this.showToast('Kunne ikke hente kurv. Prøv igen.')
        return
      }

      const addResult = await this.checkoutController.addTrashToCheckout(
        user.UID,
        this.trash.TrashID,
        1,
      )

      if (!addResult.success) {
        this.showToast('Kunne ikke tilføje affald. Prøv igen.')
        return
      }

      this.trashCount++
    },

    goToMap() {
      this.$router.push('/PostcodePage')
    },

    goToCheckout() {
      this.$router.push('/Cart')
    },
  },
  computed: {
    selectedHomeCategory() {
      return this.trashCategories.find((category) => category.value === this.trash.TrashCategoryID)
    },
    selectedStationCategory() {
      return this.stationCategories.find(
        (category) => category.value === this.trash.TrashCategoryID,
      )
    },
  },

  async mounted() {
    try {
      const id = this.$route.params.id

      const trashResponse = await fetch(`http://localhost:3001/api/trash/${id}`)

      if (!trashResponse.ok) {
        throw new Error('Dette affald eksisterer ikke')
      }

      this.trash = await trashResponse.json()
    } catch (error) {
      this.error = error.message
    } finally {
      console.log(this.trash)
      this.loading = false
    }

    const user = UserController.getUserSession()
    if (user) {
      const checkoutResult = await this.checkoutController.getOrCreateOpenCheckout(user.UID)
      if (checkoutResult.success) {
        const items = checkoutResult.data?.items || []
        const match = items.find((item) => Number(item.TrashID) === Number(this.trash?.TrashID))
        this.trashCount = match ? Number(match.Amount || 0) : 0
      }
    }
  },
}
</script>

<template>
  <main class="page">
    <transition name="toast-fade">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>
    <p v-if="loading" class="status-text">Loading...</p>
    <p v-else-if="error" class="status-text">{{ error }}</p>
    <section v-else-if="trash" class="detail-layout" :key="trash.id">
      <div class="product-card">
        <button class="floating-btn" @click="goToCheckout">
          <span class="trashcount">{{ trashCount }}</span>
          <img src="@/Components/Images/TrashCanIcon.png" alt="Checkout" />
        </button>
        <img :src="trash.imgurl" class="trash-img" :alt="trash.Name" />

        <h1>{{ trash.Name }}</h1>
      </div>

      <div class="divider"></div>

      <section class="info-card">
        <article class="info-row">
          <div class="icon-box">
            <img src="@/Components/Images/TrashCanIcon.png" alt="" />
          </div>

          <div class="info-text">
            <h3>Hjemme</h3>
            <p>{{ selectedHomeCategory.name }}</p>
          </div>

          <span class="arrow">›</span>
        </article>

        <article class="info-row">
          <div class="icon-box">
            <img src="@/Components/Images/TrashCanIcon.png" alt="" />
          </div>

          <div class="info-text">
            <h3>Genbrugsplads</h3>
            <p>{{ selectedStationCategory.name }}</p>
          </div>

          <span class="arrow">›</span>
        </article>
      </section>
    </section>

    <section class="buttons">
      <BaseButton @click="addtrash"> Tilføj affald </BaseButton>

      <BaseButton class="secondary-btn" @click="goToMap"> Kort </BaseButton>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: calc(100dvh - var(--header-height));
  background: var(--color-bg);
  padding: var(--gap-med);
  padding-bottom: var(--gap-large);
  font-family: var(--font-body);
  color: var(--color-text);
  box-sizing: border-box;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-large);
  max-width: var(--max-width);
  margin: 0 auto;
}

.product-card,
.info-card,
.buttons {
  width: 100%;
  max-width: 430px;
  margin-left: auto;
  margin-right: auto;
}

.product-card {
  position: relative;
  background: var(--color-surface-muted);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large);
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-card);
}

.trash-img {
  width: 55%;
  max-width: 150px;
  height: auto;
  object-fit: contain;
}

h1 {
  margin-top: var(--gap-med);
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h2);
  text-align: center;
}

.floating-btn {
  position: absolute;
  top: var(--gap-med);
  right: var(--gap-med);
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-round);
  border: none;
  background: var(--color-accent);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.floating-btn img {
  width: 2rem;
  height: 2rem;
}

.trashcount {
  position: absolute;
  top: -0.6rem;
  right: -0.1rem;
  color: var(--color-text-light);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.info-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.info-row {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: var(--gap-med);
  padding: var(--gap-med);
}

.info-row + .info-row {
  border-top: 1px solid var(--color-border);
}

.icon-box {
  background: var(--color-primary);
  color: var(--color-text-light);
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  font-size: 0.65rem;
  font-weight: var(--font-weight-bold);
}

.icon-box img {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.info-text h3 {
  margin-bottom: var(--gap-xs);
  font-family: var(--font-heading);
  font-size: var(--font-size-body);
  color: var(--color-text);
}

.info-text p {
  font-size: var(--font-size-small);
  line-height: 1.4;
  color: var(--color-text-muted);
}

.arrow {
  font-size: 2rem;
  color: var(--color-text);
}

.buttons {
  margin-top: var(--gap-large);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-med);
}

.buttons :deep(button) {
  width: 100%;
  border-radius: var(--border-radius-med);
}

.secondary-btn :deep(button),
.buttons :deep(.secondary-btn) {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* Tablet: svarer til --breakpoint-tablet: 768px */
@media (min-width: 768px) {
  .page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .product-card,
  .info-card,
  .buttons {
    max-width: 520px;
  }

  .product-card {
    min-height: 300px;
  }

  .trash-img {
    width: 50%;
    max-width: 170px;
  }

  h1 {
    font-size: var(--font-size-h1);
  }

  .info-row {
    grid-template-columns: 76px 1fr auto;
    padding: 1.25rem;
  }

  .icon-box {
    width: 76px;
    height: 76px;
  }

  .icon-box img {
    width: 38px;
    height: 38px;
  }

  .info-text h3 {
    font-size: var(--font-size-h3);
  }

  .info-text p {
    font-size: var(--font-size-body);
  }
}

/* Desktop: svarer til --breakpoint-desktop: 1024px */
@media (min-width: 1024px) {
  .page {
    padding: var(--gap-xl);
  }

  .detail-layout {
    grid-template-columns: 1fr 1px 1fr;
    align-items: center;
  }

  .product-card {
    max-width: 430px;
    min-height: 330px;
  }

  .trash-img {
    max-width: 170px;
  }

  .divider {
    width: 1px;
    height: 300px;
    background: var(--color-border);
  }

  .info-card {
    max-width: 430px;
  }

  .buttons {
    max-width: 860px;
  }
}

/* Large desktop: svarer til --breakpoint-large-desktop: 1200px */
@media (min-width: 1200px) {
  .page {
    padding: var(--gap-xl) 4rem;
  }
}

.toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: var(--color-bg);
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius-med);
  font-size: var(--font-size-small);
  z-index: 999;
  white-space: nowrap;
  box-shadow: var(--shadow-card);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
