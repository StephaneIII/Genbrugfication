<script>
import BaseButton from '@/Components/BaseButton.vue';

export default {
  name: 'ListOfTrash',

  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      trashCategory: null,
      trashList: [],
      loading: true,
      error: null,
    }
  },
methods:{
  goToDetails(trashID) {
    this.$router.push(`/Detailspage/${trashID}`)
  }
},
  computed: {
    filteredTrash() {
      if (!this.trashCategory) return []

      return this.trashList.filter(
        (trash) => Number(trash.TrashCategoryID) === Number(this.trashCategory.TrashCategoryID),
      )
    },
  },

  async mounted() {
    try {
      const categoryResponse = await fetch(`http://localhost:3001/api/trashcategories/${this.id}`)

      if (!categoryResponse.ok) {
        throw new Error('Denne kategori af affald eksisterer ikke')
      }

      this.trashCategory = await categoryResponse.json()

      const trashResponse = await fetch('http://localhost:3001/api/trash')

      if (!trashResponse.ok) {
        throw new Error('Could not load trash')
      }

      this.trashList = await trashResponse.json()
    } catch (error) {
      this.error = error.message
    } finally {
      this.loading = false
    }
  },
}
</script>

<template>
  <div class="trash-list-page">
    <div class="trash-types">
      <p v-if="loading" class="status-text">Loading...</p>

      <p v-else-if="error" class="status-text">{{ error }}</p>

      <div v-else>
        <h1>{{ trashCategory.Category }}</h1>

        <p class="category-description">
          {{ trashCategory.Description }}
        </p>

        <v-row>
          <v-col v-for="trash in filteredTrash" :key="trash.TrashID" cols="12">
            <v-card class="item-card pa-3">
              <div class="trash-card-layout">
                <v-img :src="trash.imgurl" class="category-icon" cover />

                <div class="card-content">
                  <div>
                    <v-card-title>{{ trash.Name }}</v-card-title>

                    <v-card-subtitle>
                      {{ trash.IsRecyclingStation ? 'Skal på genbrugsstation' : 'Kan smides i affald ved boliger' }}
                    </v-card-subtitle>
                  </div>

                  <div class="card-footer-area">
                    <span class="category-box">
                      {{ trashCategory.Category }}
                    </span>
                    <button class="temp-btn" @click="goToDetails(trash.TrashID)">
                      Flere detaljer om {{ trash.Name }}
                    </button>

                    <p class="score-text">+{{ trash.Score }} points</p>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <p v-if="filteredTrash.length === 0" class="status-text">
          Ingen affald i denne kategori.
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.trash-list-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 10px 16px 24px;
  font-family: var(--font-body);
  background: var(--primary-bg-color);
}
.temp-btn {
  background: var(--accent-color);
  color: var(--dark-text);
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 16px;
}
.temp-btn:hover {
  background: rgb(220, 145, 6);
}

.trash-types {
  flex: 1;
}

h1 {
  font-family: var(--font-heading);
  margin: 10px 0 10px 10px;
  color: var(--dark-text);
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
  height: 135px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--dark-text);
}

.card-footer-area {
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
  color: var(--dark-text);
  margin: 18px 0 0;
}

.points-number {
  color: var(--accent-color);
  font-weight: bold;
}
.category-description {
  margin: 0 0 18px 10px;
  color: var(--dark-text);
  font-size: 14px;
}

.placeholder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-bg-color);
  color: var(--dark-text);
  font-size: 42px;
  font-weight: bold;
}

.score-text {
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: bold;
  color: var(--dark-text);
}

.status-text {
  color: var(--dark-text);
  margin: 20px 10px;
  font-weight: bold;
}
</style>
