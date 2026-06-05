<script>
import UserController from '@/Controller/User.controller.js'
import TrashController from '@/Controller/Trash.controller.js'
import plasticIcon from '../Components/Images/RecycleIconPlastic.jpg'
import pantIcon from '../Components/Images/RecycleIconPant.jpg'
import paperIcon from '../Components/Images/RecycleIconPaper.jpg'
import papIcon from '../Components/Images/RecycleIconPap.jpg'
import glassIcon from '../Components/Images/RecycleIconGlass.jpg'
import metalIcon from '../Components/Images/RecycleIconMetal.jpg'
import foodIcon from '../Components/Images/RecycleIconFood.jpg'
import restAffaldIcon from '../Components/Images/RecycleIconRestaffald.jpg'
import batteriesIcon from '../Components/Images/RecycleIconBatteries.jpg'
import dangerIcon from '../Components/Images/RecycleIconDanger.jpg'

export default {
  name: 'TrashListPage',

  data() {
    return {
      trashList: [],
      iconOptions: [
        { name: 'Plast', value: plasticIcon },
        { name: 'Pant', value: pantIcon },
        { name: 'Papir', value: paperIcon },
        { name: 'Pap', value: papIcon },
        { name: 'Glas', value: glassIcon },
        { name: 'Metal', value: metalIcon },
        { name: 'Madaffald', value: foodIcon },
        { name: 'Restaffald', value: restAffaldIcon },
        { name: 'Batterier', value: batteriesIcon },
        { name: 'Farligt affald', value: dangerIcon },
      ],
      dataForm: {
        TrashCategoryID: 0,
        Name: '',
        imgurl: '',
        IsRecyclingStation: false,
        Score: 0,
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
    }
  },

  async mounted() {
    const result = await TrashController.getAllTrash()

    if (result.success) {
      this.trashList = result.data
    } else {
      this.errorMessage = result.error
    }
  },

  computed: {
    isAdmin() {
      return UserController.isAdmin()
    },
  },

  methods: {
    async newTrashType() {
      this.clearMessages()
      this.errors = {}

      if (!this.validateTrash()) {
        this.errorMessage = 'Ret venligst valideringsfejlene'
        return
      }

      const result = await TrashController.createTrash(this.dataForm)

      if (result.success) {
        this.trashList.push(result.data)
        this.successMessage = 'Ny affaldstype er oprettet'

        this.dataForm = {
          TrashCategoryID: 0,
          Name: '',
          imgurl: '',
          IsRecyclingStation: false,
          Score: 0,
        }
      } else {
        this.errorMessage = result.error
      }
    },

    async deleteTrash(trash) {
      const confirmed = confirm(`Er du sikker på at du vil slette "${trash.Name}"?`)

      if (!confirmed) {
        return
      }

      const result = await TrashController.deleteTrash(trash.TrashID)

      if (result.success) {
        this.trashList = this.trashList.filter((t) => t.TrashID !== trash.TrashID)

        this.successMessage = `"${trash.Name}" blev slettet`
      } else {
        this.errorMessage = result.error
      }
    },

    validateTrash() {
      let isValid = true

      if (!this.dataForm.TrashCategoryID || this.dataForm.TrashCategoryID < 1) {
        this.errors.TrashCategoryID = 'Kategori-ID er påkrævet'
        isValid = false
      }

      if (!this.dataForm.Name) {
        this.errors.Name = 'Navn er påkrævet'
        isValid = false
      } else if (this.dataForm.Name.length < 2) {
        this.errors.Name = 'Navn skal være mindst 2 tegn langt'
        isValid = false
      }

      if (!this.dataForm.imgurl) {
        this.errors.imgurl = 'Billede er påkrævet'
        isValid = false
      }

      if (this.dataForm.Score <= 0) {
        this.errors.Score = 'Point skal være højere end 0'
        isValid = false
      }

      return isValid
    },

    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },
  },
}
</script>

<template>
  <main class="trash-list-page">
    <div class="admin-container">
      <header class="page-header">
        <div>
          <p class="eyebrow">Admin</p>
          <h1>Affaldstyper</h1>
          <p class="page-description">
            Se eksisterende affaldstyper og opret nye elementer til sorteringssystemet.
          </p>
        </div>

        <div class="admin-status" :class="{ 'admin-status--active': isAdmin }">
          {{ isAdmin ? 'Admin adgang' : 'Ingen admin adgang' }}
        </div>
      </header>

      <section class="content-layout">
        <section class="trash-types">
          <div class="section-header">
            <h2>Liste over affald</h2>
            <p>{{ trashList.length }} affaldstyper i systemet</p>
          </div>

          <v-row class="trash-grid">
            <v-col v-for="trash in trashList" :key="trash.TrashID" cols="12">
              <v-card class="item-card" theme="light">
                <div class="item-layout">
                  <div class="image-box">
                    <img :src="trash.imgurl" :alt="trash.Name" class="category-icon" />
                  </div>

                  <div class="card-content">
                    <div class="card-title-row">
                      <h3>{{ trash.Name }}</h3>
                      <span class="id-badge">ID: {{ trash.TrashID }}</span>
                    </div>

                    <div class="card-bottom-row">
                      <dl class="meta-list">
                        <div>
                          <dt>Kategori-ID</dt>
                          <dd>{{ trash.TrashCategoryID }}</dd>
                        </div>

                        <div>
                          <dt>Genbrugsstation</dt>
                          <dd>{{ trash.IsRecyclingStation ? 'Ja' : 'Nej' }}</dd>
                        </div>

                        <div>
                          <dt>Point</dt>
                          <dd>{{ trash.Score }}</dd>
                        </div>
                      </dl>

                      <div v-if="isAdmin" class="card-actions">
                        <button class="delete-button" @click="deleteTrash(trash)">Slet</button>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <section v-if="isAdmin" class="admin-form-card">
          <div class="section-header">
            <h2>Opret ny affaldstype</h2>
            <p>Tilføj et nyt element til affaldsdatabasen.</p>
          </div>

          <form class="trash-form" @submit.prevent="newTrashType">
            <div class="form-group">
              <label for="category">Kategori-ID</label>
              <input
                id="category"
                v-model="dataForm.TrashCategoryID"
                type="number"
                placeholder="Indtast kategori-ID"
                :class="{ error: errors.TrashCategoryID }"
              />
              <span v-if="errors.TrashCategoryID" class="error-text">
                {{ errors.TrashCategoryID }}
              </span>
            </div>

            <div class="form-group">
              <label for="name">Navn</label>
              <input
                id="name"
                v-model="dataForm.Name"
                type="text"
                name="Name"
                placeholder="Indtast navn"
                :class="{ error: errors.Name }"
                required
              />
              <span v-if="errors.Name" class="error-text">{{ errors.Name }}</span>
            </div>

            <div class="form-group">
              <label for="imgurl">Billede</label>
              <select id="imgurl" v-model="dataForm.imgurl" :class="{ error: errors.imgurl }">
                <option disabled value="">Vælg et ikon</option>

                <option v-for="icon in iconOptions" :key="icon.name" :value="icon.value">
                  {{ icon.name }}
                </option>
              </select>
              <span v-if="errors.imgurl" class="error-text">{{ errors.imgurl }}</span>
            </div>

            <div class="form-group">
              <label for="score">Point</label>
              <input
                id="score"
                v-model="dataForm.Score"
                type="number"
                placeholder="Indtast pointværdi"
                :class="{ error: errors.Score }"
              />
              <span v-if="errors.Score" class="error-text">
                {{ errors.Score }}
              </span>
            </div>

            <label class="checkbox-group">
              <input v-model="dataForm.IsRecyclingStation" type="checkbox" />
              <span>Skal afleveres på genbrugsstation</span>
            </label>

            <button type="submit" class="submit-button">Opret affaldstype</button>

            <div v-if="errorMessage" class="form-message error-message">
              {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="form-message success-message">
              {{ successMessage }}
            </div>
          </form>
        </section>

        <section v-else class="admin-form-card restricted-card">
          <h2>Admin adgang kræves</h2>
          <p>Du skal være admin for at kunne oprette nye affaldstyper.</p>
        </section>
      </section>
    </div>
  </main>
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

.admin-container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--gap-med);
  margin-bottom: var(--gap-large);
}

.eyebrow {
  margin: 0 0 var(--gap-xs);
  color: var(--color-primary);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  color: var(--color-text);
  font-weight: var(--font-weight-bold);
}

h1 {
  margin: 0;
  font-size: var(--font-size-h1);
  line-height: 1.15;
}

h2 {
  margin: 0;
  font-size: var(--font-size-h2);
}

h3 {
  margin: 0;
  font-size: var(--font-size-h3);
  line-height: 1.25;
}

.page-description {
  max-width: 60ch;
  margin: var(--gap-small) 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-body);
  line-height: 1.6;
}

.admin-status {
  width: fit-content;
  padding: 0.45rem 0.85rem;
  border: 1px solid #9f1c2e;
  border-radius: var(--border-radius-round);
  background: #fff5f5;
  color: #9f1c2e;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.admin-status--active {
  border-color: var(--color-primary);
  background: #edf7f1;
  color: var(--color-primary);
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-large);
}

.trash-types,
.admin-form-card {
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-med);
  box-shadow: var(--shadow-card);
}

.section-header {
  margin-bottom: var(--gap-med);
}

.section-header p {
  margin: var(--gap-xs) 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.trash-grid {
  margin: 0;
}

:deep(.v-row) {
  margin: 0;
}

:deep(.v-col) {
  padding: 0;
  margin-bottom: var(--gap-med);
}

.item-card {
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large) !important;
  box-shadow: var(--shadow) !important;
  overflow: hidden;
  padding: 0 !important;
}

.item-layout {
  display: grid;
  grid-template-columns: 1fr;
}

.image-box {
  background: #dce9e2;
  padding: var(--gap-large);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  box-shadow: var(--shadow);
}

.card-content {
  padding: var(--gap-med);
}

.card-title-row {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
  margin-bottom: var(--gap-med);
}

.id-badge {
  width: fit-content;
  padding: 0.35rem 0.65rem;
  border-radius: var(--border-radius-round);
  background: #edf7f1;
  color: var(--color-primary);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.card-bottom-row {
  display: flex;
  flex-direction: column;
  gap: var(--gap-med);
}

.meta-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-small);
  margin: 0;
}

.meta-list div {
  display: flex;
  justify-content: space-between;
  gap: var(--gap-med);
  padding-top: var(--gap-small);
  border-top: 1px solid var(--color-border);
}

.meta-list dt {
  color: var(--color-text-muted);
  font-size: var(--font-size-small);
}

.meta-list dd {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  text-align: right;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.trash-form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-med);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--gap-small);
}

.form-group label,
.checkbox-group {
  color: var(--color-text);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.form-group input,
.form-group select {
  width: 100%;
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  outline: none;
  box-sizing: border-box;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.form-group input::placeholder {
  color: var(--color-text-muted);
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(47, 107, 95, 0.18);
}

.form-group input.error,
.form-group select.error {
  border-color: #9f1c2e;
  box-shadow: 0 0 0 3px rgba(159, 28, 46, 0.14);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: var(--gap-small);
  padding: var(--gap-med);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  cursor: pointer;
}

.checkbox-group input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
}

.submit-button {
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

.submit-button:hover {
  background: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.submit-button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.delete-button {
  min-height: 40px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-med);
  background: #c6c6c6;
  color: var(--color-text-light);
  padding: 0.65rem 1rem;
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    transform var(--transition-fast);
}

.delete-button:hover {
  background: #b71c1c;
  transform: translateY(-1px);
}

.error-text {
  color: #9f1c2e;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}

.form-message {
  padding: var(--gap-med);
  border-radius: var(--border-radius-med);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
}

.error-message {
  background: #fff5f5;
  color: #9f1c2e;
  border: 1px solid #f5c2c7;
}

.success-message {
  background: #edf7f1;
  color: var(--color-primary);
  border: 1px solid var(--color-secondary);
}

.restricted-card {
  background: var(--color-surface);
}

.restricted-card p {
  margin: var(--gap-small) 0 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* Tablet */
@media (min-width: 768px) {
  .trash-list-page {
    padding: var(--gap-xl) var(--gap-large);
  }

  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .trash-types,
  .admin-form-card {
    padding: var(--gap-large);
  }

  .item-layout {
    grid-template-columns: 150px 1fr;
  }

  .image-box {
    border-right: 1px solid var(--color-border);
    padding: var(--gap-med);
  }

  .category-icon {
    width: 110px;
    height: 110px;
  }

  .card-content {
    padding: var(--gap-large);
  }

  .card-title-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .card-bottom-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .meta-list {
    flex: 1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .meta-list div {
    display: block;
    border-top: 1px solid var(--color-border);
  }

  .meta-list dd {
    margin-top: var(--gap-xs);
    text-align: left;
  }

  .card-actions {
    flex-shrink: 0;
    margin-left: var(--gap-med);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .content-layout {
    grid-template-columns: minmax(0, 1.5fr) minmax(340px, 0.8fr);
    align-items: start;
  }

  .admin-form-card {
    position: sticky;
    top: calc(var(--header-height) + var(--gap-large));
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
}

/* Small mobile */
@media (max-width: 430px) {
  .trash-list-page {
    padding: var(--gap-med);
  }

  h1 {
    font-size: var(--font-size-h2);
  }

  h2 {
    font-size: var(--font-size-h3);
  }

  .trash-types,
  .admin-form-card {
    padding: var(--gap-med);
  }

  .category-icon {
    width: 100px;
    height: 100px;
  }
}
</style>
