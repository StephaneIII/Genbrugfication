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
      //  trashList: [ //mock-data for testing
      //   { TrashID: 1, TrashCategoryID: 1, Name: 'Carton', imgurl: plasticIcon, IsRecyclingStation: false, Score: 10 },
      //   { TrashID: 2, TrashCategoryID: 2, Name: 'Bottle', imgurl: metalIcon, IsRecyclingStation: false, Score: 20 },
      //   { TrashID: 3, TrashCategoryID: 3, Name: 'Electronic', imgurl: metalIcon, IsRecyclingStation: true, Score: 50 },
      // ],
      iconOptions: [
        { name: 'Plastic', value: plasticIcon },
        { name: 'Pant', value: pantIcon },
        { name: 'Papir', value: paperIcon },
        { name: 'Pap', value: papIcon },
        { name: 'Glas', value: glassIcon },
        { name: 'Metal', value: metalIcon },
        { name: 'Food', value: foodIcon },
        { name: 'Rest Affald', value: restAffaldIcon },
        { name: 'Battery', value: batteriesIcon },
        { name: 'Papir', value: paperIcon },
        { name: 'Advarelse', value: dangerIcon },
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

      // Validate form
      if (!this.validateTrash()) {
        this.errorMessage = 'Error: Ret venligst valideringsfejlene'
        return
      }

      const result = await TrashController.createTrash(this.dataForm)

      if (result.success) {
        this.trashList.push(result.data)

        this.successMessage = 'Nyt type skrald oprettet'

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

      this.dataForm = {
        TrashCategoryID: 0,
        Name: '',
        imgurl: '', // imgurl is image
        IsRecyclingStation: false,
        Score: 0,
      }
    },

    validateTrash() {
      let isValid = true
      // Category validation
      if (!this.dataForm.TrashCategoryID || this.dataForm.TrashCategoryID < 1) {
        this.errors.TrashCategoryID = 'Category påkrævet'
        isValid = false
      }

      // Name validation
      if (!this.dataForm.Name) {
        this.errors.Name = 'Navn påkrævet'
        isValid = false
      } else if (this.dataForm.Name.length < 2) {
        this.errors.Name = 'Navn skal være mindst 2 tegn langt'
        isValid = false
      }

      // imgurl/Image validation
      if (!this.dataForm.imgurl) {
        this.errors.imgurl = 'Billede påkrævet'
        isValid = false
      }

      // Recycling validation - NOT needed

      // Score validation
      if (this.dataForm.Score <= 0) {
        this.errors.Score = 'Point score kan ikke være negativ eller nul'
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
  <div class="trash-list-page">
    <!-- List of all current types of trash -->
    <div class="trash-types">
      <h1>Liste af skrald</h1>
      <v-row>
        <v-col v-for="trash in trashList" :key="trash.TrashID" cols="12">
          <v-card class="pa-4 d-flex align-start item-card" theme="light">
            <img :src="trash.imgurl" :alt="trash.Name" class="category-icon" />

            <div class="card-content">
              <v-card-title>TrashID: {{ trash.TrashID }}</v-card-title>
              <v-card-title>Navn: {{ trash.Name }}</v-card-title>
              <v-card-text>Sorteres som: {{ trash.TrashCategoryID }}</v-card-text>
              <v-card-text>Smides i en Recycling station: {{ trash.IsRecyclingStation }}</v-card-text>
              <v-card-text>Point værdi: {{ trash.Score }}</v-card-text>
              <!--<v-card-text>Description: </v-card-text>-->
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-if="isAdmin">Bruger er admin</div>
    <div v-else>Bruger er ikke admin</div>

    <!-- Creating new trash -->
    <div v-if="isAdmin" class="card-footer-area">
      <!-- Trash form: category ID -->
      <div>
        <label for="category">Category ID: </label>

        <input
          id="category"
          v-model="dataForm.TrashCategoryID"
          type="number"
          placeholder="Insert category ID"
          :class="{ error: errors.TrashCategoryID }"
        />

        <span v-if="errors.TrashCategoryID" class="error-text">
          {{ errors.TrashCategoryID }}
        </span>
      </div>

      <!-- Trash form: name -->
      <div>
        <label for="name">Navn: </label>
        <input
          id="name"
          v-model="dataForm.Name"
          type="text"
          name="Name"
          placeholder="Indsæt navn"
          :class="{ error: errors.Name }"
          required
        />
        <span v-if="errors.Name" class="error-text">{{ errors.Name }}</span>
      </div>

      <!-- Trash form: imgurl/image -->
      <div>
        <label for="image">Vælgde Billede</label>
        <select id="imgurl" v-model="dataForm.imgurl" :class="{ error: errors.imgurl }">
          <option disabled value="">Vælg et Ikon</option>

          <option v-for="icon in iconOptions" :key="icon.name" :value="icon.value">
            {{ icon.name }}
          </option>
        </select>
        <span v-if="errors.imgurl" class="error-text">{{ errors.imgurl }}</span>
      </div>

      <!-- Trash form: recycling station -->
      <div>
        <label>
          Skal bruge Recycling station:
          <input v-model="dataForm.IsRecyclingStation" type="checkbox" />
        </label>
      </div>

      <!-- Trash form: score -->
      <div>
        <label for="score">Score: </label>
        <input
          id="score"
          v-model="dataForm.Score"
          type="number"
          placeholder="Indsæt score værdi"
          :class="{ error: errors.Score }"
        />
        <span v-if="errors.Score" class="error-text">
          {{ errors.Score }}
        </span>
      </div>

      <!-- Button + succes/fail message -->
      <button @click="newTrashType" class="submit-button">Opret nyt skrald</button>

      <div v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-text">
        {{ successMessage }}
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

.trash-types {
  flex: 1;
}

h1 {
  font-family: var(--font-heading);
  margin: 10px 0 10px 10px;
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
  height: 135px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.submit-button {
  margin-top: 20px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #3a5c42;
  color: white;
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
