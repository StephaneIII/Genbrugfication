<script>
import plasticIcon from '../Components/Images/RecycleIconPlastic.jpg'
import metalIcon from '../Components/Images/RecycleIconMetal.jpg'
import papIcon from '../Components/Images/RecycleIconPap.jpg'
import foodIcon from '../Components/Images/RecycleIconFood.jpg'
import BaseButton from '@/Components/BaseButton.vue'
import CheckoutController from '@/Controller/Checkout.controller.js'
import TrashController from '@/Controller/Trash.controller.js'
import UserController from '@/Controller/User.controller.js'
import PointController from '@/Controller/Point.controller.js'

export default {
  name: 'Cart',

  components: {
    BaseButton,
  },

  data() {
    return {
      checkoutController: CheckoutController,
      trashController: TrashController,
      uid: null,
      checkout: null,
      checkoutItems: [],
      allTrash: [],
      trashCategories: [],
      searchTrash: '',
      showDropdown: false,
      loading: false,
      addingTrashId: null,
      error: null,
    }
  },
  computed: {
    trashCategoryById() {
      return this.trashCategories.reduce((map, category) => {
        map[Number(category.TrashCategoryID)] = category
        return map
      }, {})
    },
    items() {
      return this.checkoutItems.map((item) => {
        const trash = item.Trash || {}
        const category = this.trashCategoryById[Number(trash.TrashCategoryID)]
        const categoryName = category?.Category || 'Ukendt'

        return {
          checkoutId: Number(item.CheckoutID),
          trashId: Number(item.TrashID),
          amount: Number(item.Amount || 0),
          name: trash.Name || 'Ukendt affald',
          category: categoryName,
          image: this.resolveTrashImage(categoryName),
          score: Number(trash.Score || 10),
        }
      })
    },
    availableTrashOptions() {
      const selectedTrashIds = new Set(this.items.map((item) => item.trashId))
      const query = this.searchTrash.trim().toLowerCase()

      return this.allTrash
        .filter((trash) => !selectedTrashIds.has(Number(trash.TrashID)))
        .filter((trash) => {
          if (!query) {
            return true
          }

          const categoryName = this.getTrashCategoryName(trash)
          return (
            String(trash.Name || '')
              .toLowerCase()
              .includes(query) || categoryName.toLowerCase().includes(query)
          )
        })
        .map((trash) => ({
          ...trash,
          category: this.getTrashCategoryName(trash),
          image: this.resolveTrashImage(this.getTrashCategoryName(trash)),
        }))
    },
    totalPoints() {
      return this.items.reduce((sum, item) => sum + item.amount * item.score, 0)
    },
  },
  methods: {
    resolveTrashImage(categoryName) {
      const normalized = String(categoryName || '').toLowerCase()

      if (normalized.includes('metal')) {
        return metalIcon
      }

      if (normalized.includes('pap')) {
        return papIcon
      }

      if (normalized.includes('mad')) {
        return foodIcon
      }

      return plasticIcon
    },
    getTrashCategoryName(trash) {
      const category = this.trashCategoryById[Number(trash.TrashCategoryID)]
      return category?.Category || 'Ukendt'
    },
    async loadCartData() {
      this.loading = true
      this.error = null

      try {
        const session = UserController.getUserSession()

        if (!session || !session.UID) {
          this.$router.push('/login')
          return
        }

        this.uid = Number(session.UID)

        const [checkoutResult, trashResult, categoryResponse] = await Promise.all([
          this.checkoutController.getOrCreateOpenCheckout(this.uid),
          this.trashController.getAllTrash(),
          fetch('http://localhost:3001/api/trashcategories'),
        ])

        if (!checkoutResult.success) {
          throw new Error(checkoutResult.error || 'Kunne ikke hente checkout')
        }

        if (!trashResult.success) {
          throw new Error(trashResult.error || 'Kunne ikke hente affaldstyper')
        }

        if (!categoryResponse.ok) {
          const categoryError = await categoryResponse.json().catch(() => ({}))
          throw new Error(categoryError.error || 'Kunne ikke hente affaldskategorier')
        }

        const checkoutData = checkoutResult.data || {}
        this.checkout = checkoutData.checkout || null
        this.checkoutItems = checkoutData.items || []
        this.allTrash = trashResult.data || []
        this.trashCategories = await categoryResponse.json()
      } catch (error) {
        this.error = error.message || 'Kunne ikke indlæse affaldsliste'
      } finally {
        this.loading = false
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    closeDropdown() {
      this.showDropdown = false
    },
    async addTrash(trash) {
      if (!this.uid) {
        return
      }

      try {
        this.addingTrashId = Number(trash.TrashID)
        const response = await this.checkoutController.addTrashToCheckout(
          this.uid,
          trash.TrashID,
          1,
        )

        if (!response.success) {
          throw new Error(response.error || 'Kunne ikke tilføje affald')
        }

        const checkoutData = response.data || {}
        this.checkout = checkoutData.checkout || this.checkout
        this.checkoutItems = checkoutData.items || []
        this.searchTrash = ''
        this.showDropdown = false
      } catch (error) {
        this.error = error.message || 'Kunne ikke tilføje affald'
      } finally {
        this.addingTrashId = null
      }
    },
    async increase(item) {
      if (!this.uid) {
        return
      }

      const nextAmount = item.amount + 1
      const response = await this.checkoutController.updateTrashAmount(
        this.uid,
        item.trashId,
        nextAmount,
      )

      if (!response.success) {
        this.error = response.error || 'Kunne ikke opdatere affald'
        return
      }

      this.checkoutItems = response.data?.items || []
    },
    async goToThankYouView() {
      if (!this.uid) {
        this.error = 'Du skal være logget ind for at registrere affald'
        return
      }

      const earnedPoints = Number(this.totalPoints || 0)

      const response = await this.checkoutController.lockOpenCheckout(this.uid)

      if (!response.success) {
        this.error = response.error || 'Kunne ikke registrere affald'
        return
      }

      const totalResult = await PointController.getTotalScoreByUID(this.uid)
      const totalPoints = totalResult.success
        ? Number(totalResult.data?.totalScore ?? earnedPoints)
        : earnedPoints

      sessionStorage.setItem('lastEarnedPoints', String(earnedPoints))
      sessionStorage.setItem('lastTotalPoints', String(totalPoints))

      this.$router.push({
        path: '/ThankYou',
        query: {
          earned: String(earnedPoints),
          total: String(totalPoints),
        },
      })
    },
    async decrease(item) {
      if (!this.uid) {
        return
      }

      const nextAmount = item.amount - 1

      const response =
        nextAmount > 0
          ? await this.checkoutController.updateTrashAmount(this.uid, item.trashId, nextAmount)
          : await this.checkoutController.removeTrashFromCheckout(this.uid, item.trashId)

      if (!response.success) {
        this.error = response.error || 'Kunne ikke opdatere affald'
        return
      }

      this.checkoutItems = response.data?.items || []
    },
  },
  async mounted() {
    await this.loadCartData()
  },
}
</script>

<template>
  <div class="cart-page">
    <div class="cart-content">
      <h1>Genbrugs liste</h1>

      <div v-if="error" class="error-banner">
        {{ error }}
      </div>

      <div v-if="loading" class="loading-text">Indlæser affald...</div>

      <v-row>
        <v-col v-for="item in items" :key="`${item.checkoutId}-${item.trashId}`" cols="12">
          <v-card class="pa-4 d-flex align-start item-card" theme="light">
            <img :src="item.image" :alt="item.category" class="category-icon" />

            <div class="card-content">
              <v-card-title>{{ item.name }}</v-card-title>

              <v-card-subtitle>Sorteres som</v-card-subtitle>

              <div class="category-box">{{ item.category }}</div>

              <div class="d-flex align-center mt-1">
                <v-btn variant="text" @click="decrease(item)">—</v-btn>
                <span class="mx-2">{{ item.amount }}</span>
                <v-btn variant="text" @click="increase(item)">+</v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="cart-footer-area">
      <div class="add-item-wrapper">
        <v-card class="pa-4 item-card action-card add-item-card" @click="toggleDropdown">
          <span class="add-icon">+</span>
          Tilføj nyt affald
        </v-card>

        <div v-if="showDropdown" class="dropdown-menu">
          <div class="search-box">
            <input
              v-model="searchTrash"
              type="text"
              placeholder="Søg efter affald..."
              class="search-input"
            />
          </div>

          <div class="dropdown-options">
            <div v-if="availableTrashOptions.length === 0" class="no-results">
              Intet affald fundet
            </div>

            <button
              v-for="trash in availableTrashOptions"
              :key="trash.TrashID"
              type="button"
              class="dropdown-option"
              :disabled="addingTrashId === Number(trash.TrashID)"
              @click="addTrash(trash)"
            >
              <img :src="trash.image" :alt="trash.category" class="option-icon" />
              <div class="option-copy">
                <div class="trash-name">{{ trash.Name }}</div>
                <div class="trash-meta">Sorteres som {{ trash.category }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <p class="points-text">
        Optjen <span class="points-number">{{ totalPoints }}</span> point ved denne sortering!
      </p>

      <base-button class="pa-4 action-card register-card" @click="goToThankYouView">
        Registrer affald
      </base-button>
    </div>

    <div v-if="showDropdown" class="dropdown-backdrop" @click="closeDropdown"></div>
  </div>
</template>

<style scoped>
.cart-page {
  width: 100%;
  min-height: 100%;
  background: var(--color-bg);
  padding: var(--gap-med);
  font-family: var(--font-body);
  color: var(--color-text);
}

.cart-content {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

h1 {
  font-family: var(--font-heading);
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--gap-med);
}

.error-banner {
  margin-bottom: var(--gap-med);
  padding: var(--gap-med);
  border-radius: var(--border-radius-large);
  background: var(--color-surface-muted);
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow);
}

.loading-text {
  color: var(--color-text-muted);
  margin-bottom: var(--gap-med);
}

.item-card {
  background: var(--color-surface-muted) !important;
  border-radius: var(--border-radius-large) !important;
  box-shadow: var(--shadow-card);
  color: var(--color-text);
  padding: var(--gap-med) !important;
}

.category-icon {
  width: 90px;
  height: 90px;
  margin-right: var(--gap-med);
  border-radius: var(--border-radius-med);
  object-fit: cover;
  align-self: center;
  flex-shrink: 0;
}

.card-content {
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-card .v-card-title {
  padding: 0;
  font-family: var(--font-heading);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  line-height: 1.2;
}

.item-card .v-card-subtitle {
  padding: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  opacity: 1;
}

.category-box {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid var(--color-text);
  border-radius: var(--border-radius-round);
  padding: var(--gap-xs) var(--gap-med);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.cart-footer-area {
  width: 100%;
  max-width: 720px;
  margin: var(--gap-large) auto 0;
  padding-top: var(--gap-large);
  border-top: 1px solid var(--color-border);
}

.action-card {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: var(--border-radius-large);
  font-family: var(--font-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  box-shadow: var(--shadow);
}

.add-item-wrapper {
  position: relative;
}

.add-item-card {
  background: var(--color-surface-muted) !important;
  min-height: 64px;
  font-size: var(--font-size-body);
}

.add-icon {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  margin-right: var(--gap-small);
  line-height: 1;
  color: var(--color-primary);
}

.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + var(--gap-small));
  z-index: 30;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-med);
  box-shadow: var(--shadow-card);
}

.search-box {
  margin-bottom: var(--gap-small);
}

.search-input {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  padding: var(--gap-small) var(--gap-med);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  color: white;
  outline: none;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.dropdown-options {
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: var(--gap-med);
  width: 100%;
  padding: var(--gap-small) var(--gap-med);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  text-align: left;
}

.dropdown-option:disabled {
  opacity: 0.65;
}

.option-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--border-radius-med);
  object-fit: cover;
}

.option-copy {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
}

.trash-name {
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.trash-meta,
.no-results {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.15);
}

.points-text {
  text-align: center;
  font-size: var(--font-size-body);
  color: var(--color-text);
  margin: var(--gap-large) 0 var(--gap-med);
}

.points-number {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}

.register-card {
  background: var(--color-accent);
  min-height: 64px;
  font-size: var(--font-size-body);
  color: var(--color-text);
  margin-top: var(--gap-med);
}

.register-card :deep(button) {
  width: 100%;
  min-height: 64px;
  border-radius: var(--border-radius-large);
}

/* Tablet - 768px */
@media (min-width: 768px) {
  .cart-page {
    padding: var(--gap-large);
  }

  .cart-content,
  .cart-footer-area {
    max-width: 760px;
  }

  h1 {
    font-size: var(--font-size-h1);
    margin-bottom: var(--gap-large);
  }

  .category-icon {
    width: 120px;
    height: 120px;
    }

  .card-content {
    min-height: 120px;
  }

  .item-card .v-card-title {
    font-size: var(--font-size-h3);
  }

  .cart-footer-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-med);
    align-items: center;
  }

  .add-item-wrapper,
  .points-text,
  .register-card {
    margin: 0;
  }

  .points-text {
    grid-column: 1 / -1;
    order: 3;
  }
}

/* Desktop - 1024px */
@media (min-width: 1024px) {
  .cart-page {
    padding: var(--gap-xl);
  }

  .cart-content,
  .cart-footer-area {
    max-width: 900px;
  }

  .cart-footer-area {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .points-text {
    grid-column: auto;
    order: initial;
    margin: 0;
  }
}
</style>