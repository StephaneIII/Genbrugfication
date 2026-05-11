<script>
//import UserController from '../../api/src/controllers/user.controller.js'
import plasticIcon from '../Components/Images/RecycleIconPlastic.jpg'
import metalIcon from '../Components/Images/RecycleIconMetal.jpg'
import papIcon from '../Components/Images/RecycleIconPap.jpg'
import paperIcon from '../Components/Images/RecycleIconPaper.jpg'
import foodIcon from '../Components/Images/RecycleIconFood.jpg'
import glassIcon from '../Components/Images/RecycleIconGlass.jpg'
import restAffaldIcon from '../Components/Images/RecycleIconRestaffald.jpg'

export default {
  name: 'TrashListPage',
  data() {
    return {
       mockTrash: [
        { TrashID: 1, TrashCategoryID: 1, Name: 'Carton', Image: plasticIcon, URL: 'something 1', IsRecyclingStation: false, Score: 10 },
        { TrashID: 2, TrashCategoryID: 2, Name: 'Bottle', Image: metalIcon, URL: 'something 2', IsRecyclingStation: false, Score: 20 },
        { TrashID: 3, TrashCategoryID: 2, Name: 'Electronic', Image: metalIcon, URL: 'something 3', IsRecyclingStation: true, Score: 50 },
      ],
      iconOptions: [
        { name: 'Plastic', value: plasticIcon },
        { name: 'Metal', value: metalIcon },
        { name: 'Pap', value: papIcon },
        { name: 'Papir', value: paperIcon },
        { name: 'Food', value: foodIcon },
        { name: 'Glas', value: glassIcon },
        { name: 'Rest Affald', value: restAffaldIcon },
      ],
      dataForm: {
        TrashCategoryID: 0,
        Name: '',
        Image: '',
        URL: '',
        IsRecyclingStation: false,
        Score: 0,
      },
        errors: {},
        errorMessage: '',
        successMessage: '',
    }
  },
  mounted() {
    // Will be used after testing with mock data
  },
  // computed: {
  //     isAdmin() {
  //         return UserController.isAdmin()
  //     }
  // },
  methods: {
    async newTrashType() {
      this.clearMessages()
      this.errors = {}

      // Validate form
      if (!this.validateTrash()) {
        this.errorMessage = 'Please fix the validation errors'
        return
      }

      const newTrash = {
        TrashID: this.mockTrash.length + 1,
        ...this.dataForm,
      }

      this.mockTrash.push(newTrash)
      this.successMessage = 'Trash type created successfully'

      this.dataForm = {
        TrashCategoryID: 0,
        Name: '',
        Image: '',
        URL: '',
        IsRecyclingStation: false,
        Score: 0,
      }
    },

    validateTrash() {
      let isValid = true
      // Category validation
      if (!this.dataForm.TrashCategoryID || this.dataForm.TrashCategoryID < 1) {
        this.errors.TrashCategoryID = 'Category is required'
        isValid = false
      }
      
      // Name validation
      if (!this.dataForm.Name) {
        this.errors.Name = 'Name is required'
        isValid = false
      } else if (this.dataForm.Name.length < 2) {
        this.errors.Name = 'Username must be at least 2 characters'
        isValid = false
      }

      // Image validation
      if (!this.dataForm.Image) {
        this.errors.Image = 'Image URL is required'
        isValid = false
      }

      // URL validation
      if (!this.dataForm.URL) {
        this.errors.URL = 'URL is required'
        isValid = false
      }

      // Recycling validation - NOT needed

      // Score validation
      if (this.dataForm.Score <= 0) {
        this.errors.Score = 'Score cannot be negative or zero'
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
      <h1>Trash List</h1>
      <v-row>
        <v-col v-for="trash in mockTrash" :key="trash.TrashID" cols="12">
          <v-card class="pa-4 d-flex align-start item-card" theme="light">
            <img :src="trash.Image" :alt="trash.Name" class="category-icon" />

            <div class="card-content">
              <v-card-title>TrashID: {{ trash.TrashID }}</v-card-title>
              <v-card-title>Name: {{ trash.Name }}</v-card-title>
              <v-card-text>Sorteres som: {{ trash.TrashCategoryID }}</v-card-text>
              <v-card-text>Thrown in Recycling station: {{ trash.IsRecyclingStation }}</v-card-text>
              <v-card-text>Point worth: {{ trash.Score }}</v-card-text>
              <v-card-text>Description: </v-card-text>
              <v-card-text>URL: {{ trash.URL }}</v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- <div v-if="isAdmin">
      User is admin
    </div>
    <div v-else>
      User is not a admin
    </div> -->

    <!-- Creating new trash -->
    <div class="card-footer-area">
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
        <label for="name">Name: </label>
        <input
          id="name"
          v-model="dataForm.Name"
          type="text"
          name="Name"
          placeholder="Insert a Name"
          :class="{ error: errors.Name }"
          required
        />
        <span v-if="errors.Name" class="error-text">{{ errors.Name }}</span>
      </div>

      <!-- Trash form: imsge -->
      <div>
        <label for="image">Select Image</label>
        <select
          id="image"
          v-model="dataForm.Image"
          :class="{ error: errors.Image }"
        >
        <option disabled value="">
          Select an icon
        </option>

        <option
          v-for="icon in iconOptions"
          :key="icon.name"
          :value="icon.value"
        >
          {{ icon.name }}
        </option>
      </select>
      <span v-if="errors.Image" class="error-text">{{ errors.Image }}</span>
      </div>

      <!-- Trash form: URL -->
      <div>
        <label for="url">URL: </label>
        <input
          id="url"
          v-model="dataForm.URL"
          type="text"
          name="URL"
          placeholder="Insert a URL"
          :class="{ error: errors.URL }"
          required
          />
        <span v-if="errors.URL" class="error-text">{{ errors.URL }}</span>
      </div>

      <!-- Trash form: recycling station -->
      <div>
        <label>
          Is Recycling Station: 
          <input
            v-model="dataForm.IsRecyclingStation"
            type="checkbox"
          />
        </label>
      </div>

      <!-- Trash form: score -->
      <div>
        <label for="score">Score: </label>
          <input
            id="score"
            v-model="dataForm.Score"
            type="number"
            placeholder="Insert score"
            :class="{ error: errors.Score }"
          />
        <span v-if="errors.Score" class="error-text">
          {{ errors.Score }}
        </span>
      </div>

      <!-- Button + succes/fail message -->
      <button @click="newTrashType" class="submit-button">
        Create Trash Type
      </button>

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