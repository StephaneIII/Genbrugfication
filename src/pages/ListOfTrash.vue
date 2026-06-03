<script>
import BaseButton from '@/Components/BaseButton.vue'

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

  methods: {
    goToDetails(trashID) {
      this.$router.push(`/Detailspage/${trashID}`)
    },
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
        <header class="page-header">
          <h1>{{ trashCategory.Category }}</h1>

          <p class="category-description">
            {{ trashCategory.Description }}
          </p>
        </header>

        <v-row class="trash-grid">
          <v-col v-for="trash in filteredTrash" :key="trash.TrashID" cols="12">
            <v-card class="item-card">
              <div class="trash-card-layout">
                <div class="image-panel">
                  <div class="image-box">
                    <v-img :src="trash.imgurl" class="category-icon" />
                  </div>
                </div>

                <div class="card-content">
                  <div class="card-main-text">
                    <div class="card-title-row">
                      <v-card-title>{{ trash.Name }}</v-card-title>

                      <p class="score-text">+{{ trash.Score }} points</p>
                    </div>

                    <v-card-subtitle>
                      {{
                        trash.IsRecyclingStation
                          ? 'Skal på genbrugsstation'
                          : 'Kan smides i affald ved boliger'
                      }}
                    </v-card-subtitle>
                  </div>

                  <div class="card-footer-area">
                    <span class="category-box">
                      {{ trashCategory.Category }}
                    </span>

                    <button class="temp-btn" @click="goToDetails(trash.TrashID)">
                      Flere detaljer
                    </button>
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
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  padding: var(--gap-large) var(--gap-med);
  box-sizing: border-box;
}

.trash-types {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--gap-large);
}

h1 {
  margin: 0 0 var(--gap-small);
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: 1.15;
  letter-spacing: 0.02em;
}

.category-description {
  max-width: 60ch;
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-body);
  line-height: 1.6;
}

.status-text {
  width: 100%;
  max-width: 520px;
  margin: var(--gap-large) auto;
  padding: var(--gap-med);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow);
  color: var(--color-text);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  text-align: center;
}

/* Vuetify reset */
.trash-grid {
  margin: 0;
}

:deep(.v-row) {
  margin: 0;
}

:deep(.v-col) {
  padding: 0;
  margin-bottom: var(--gap-large);
}

/* Card */
.item-card {
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large) !important;
  box-shadow: var(--shadow-card) !important;
  overflow: hidden;
  padding: 0 !important;
}

/* Mobile card layout */
.trash-card-layout {
  display: grid;
  grid-template-columns: 1fr;
}

.image-panel {
  background: var(--color-surface-muted);
  padding: var(--gap-large);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-box {
  width: 100%;
  max-width: 180px;
  aspect-ratio: 1 / 1;
  background: var(--color-surface);
  border-radius: var(--border-radius-med);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.category-icon {
  width: 100%;
  height: 100%;
}

.category-icon :deep(img) {
  object-fit: contain !important;
  padding: var(--gap-med);
}

/* Content */
.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--gap-large);
  padding: var(--gap-large);
  color: var(--color-text);
}

.card-main-text {
  min-width: 0;
}

.card-title-row {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.item-card .v-card-title {
  padding: 0;
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  line-height: 1.25;
  white-space: normal;
  overflow-wrap: break-word;
}

.item-card .v-card-subtitle {
  padding: var(--gap-small) 0 0;
  margin: 0;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  opacity: 1;
  white-space: normal;
  overflow-wrap: break-word;
}

.score-text {
  width: fit-content;
  margin: 0;
  padding: 0.35rem 0.7rem;
  border-radius: var(--border-radius-round);
  background: #dce9e2;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

/* Footer */
.card-footer-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--gap-med);
  padding-top: var(--gap-med);
  border-top: 1px solid var(--color-border);
}

.category-box {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-small);
  color: var(--color-primary);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.category-box::before {
  content: "";
  width: 0.55rem;
  height: 0.55rem;
  border-radius: var(--border-radius-round);
  background: var(--color-primary);
}

/* Button */
.temp-btn {
  width: 100%;
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-med);
  background: var(--color-accent);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.temp-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.temp-btn:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

/* Tablet */
@media (min-width: 768px) {
  .trash-list-page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .trash-types {
    max-width: 820px;
  }

  .trash-card-layout {
    grid-template-columns: 240px 1fr;
    min-height: 240px;
  }

  .image-panel {
    padding: var(--gap-xl);
  }

  .image-box {
    max-width: 170px;
  }

  .card-content {
    padding: var(--gap-xl);
    justify-content: space-between;
  }

  .card-title-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-large);
  }

  .score-text {
    flex-shrink: 0;
  }

  .item-card .v-card-title {
    font-size: var(--font-size-h2);
  }

  .item-card .v-card-subtitle {
    font-size: var(--font-size-body);
  }

  .card-footer-area {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .temp-btn {
    width: auto;
    min-width: 150px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .trash-list-page {
    padding: var(--gap-xl);
  }

  .trash-types {
    max-width: 960px;
  }

  .item-card {
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .item-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card) !important;
  }

  .trash-card-layout {
    grid-template-columns: 280px 1fr;
    min-height: 260px;
  }

  .image-box {
    max-width: 185px;
  }
}

/* Large desktop */
@media (min-width: 1200px) {
  .trash-types {
    max-width: 1050px;
  }
}
</style>