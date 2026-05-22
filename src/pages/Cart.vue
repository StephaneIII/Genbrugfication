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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 10px 16px 24px;
  font-family: var(--font-body);
  background: var(--primary-bg-color);
}

.cart-content {
  flex: 1;
}

h1 {
  font-family: var(--font-heading);
  margin: 10px 0 10px 10px;
  color: var(--white-text);
}

.error-banner {
  margin: 8px 0 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(180, 60, 60, 0.2);
  color: #ffd7d7;
  font-weight: 600;
}

.loading-text {
  margin: 8px 0 12px;
  color: var(--white-text);
}

.item-card {
  background-color: #d6ecd2;
  border-radius: 10px;
}

.category-icon {
  height: 120px;
  width: 120px;
  margin-right: 24px;
  border-radius: 10px;
}

.item-card .v-card-title {
  padding: 0;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 600;
}

.item-card .v-card-subtitle {
  padding: 0;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 600;
}

.card-content {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-footer-area {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}

.action-card {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  color: var(--dark-text);
  border-radius: 14px;
}

.add-item-card {
  background: #d6ecd2;
  min-height: 68px;
  font-size: 18px;
}

.add-item-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 12px);
  z-index: 20;
  background: #f8f9fa;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
}

.search-box {
  margin-bottom: 10px;
}

.search-input {
  width: 100%;
  border: 1px solid rgba(58, 92, 66, 0.25);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}

.dropdown-options {
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(58, 92, 66, 0.15);
  border-radius: 12px;
  background: #fff;
  text-align: left;
}

.dropdown-option:disabled {
  opacity: 0.65;
}

.option-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
}

.option-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trash-name {
  font-weight: 700;
  color: var(--dark-text);
}

.trash-meta,
.no-results {
  font-size: 13px;
  color: rgba(26, 43, 31, 0.75);
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.15);
}

.add-icon {
  font-size: 32px;
  font-weight: bold;
  margin-right: 10px;
  line-height: 1;
}

.register-card {
  background-color: var(--accent-color);
  min-height: 92px;
  font-size: 20px;
  color: var(--dark-text);
  margin-top: 14px;
}

.category-box {
  display: inline-flex;
  align-items: center;
  border: 1px solid #3a5c42;
  border-radius: 50px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: bold;
}

.points-text {
  text-align: center;
  font-size: 18px;
  color: var(--white-text);
  margin: 18px 0 0;
}

.points-number {
  color: var(--accent-color);
  font-weight: bold;
}
</style>
