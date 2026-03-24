<template>
  <div>
    <h1>Cart</h1>
    <v-row>
      <v-col v-for="item in items" :key="item.name" cols="12">
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

    <v-card class="pa-4 item-card action-card add-item-card mt-4">
      <span class="add-icon">+</span>
      Tilføj nyt affald
    </v-card>

    <p class="points-text mt-4">
      Optjen <span class="points-number">{{ totalPoints }}</span> point ved denne sortering!
    </p>

    <v-card class="pa-4 action-card register-card mt-4"> Registrer sortering </v-card>
  </div>
</template>

<script>
import plasticIcon from '../Components/Images/RecycleIconPlastic.jpg'
import metalIcon from '../Components/Images/RecycleIconMetal.jpg'
import papIcon from '../Components/Images/RecycleIconPap.jpg'
import foodIcon from '../Components/Images/RecycleIconFood.jpg'

export default {
  name: 'Cart',

  data() {
    return {
      items: [
        { name: 'Æblejuice', category: 'Plast', amount: 1, image: plasticIcon },
        { name: 'Tomatdåse', category: 'Metal', amount: 1, image: metalIcon },
        { name: 'Pizzabakke', category: 'Pap', amount: 1, image: papIcon },
        { name: 'Ost', category: 'Madaffald', amount: 1, image: foodIcon },
      ],
    }
  },
  computed: {
    totalPoints() {
      return this.items.reduce((sum, item) => sum + item.amount * 10, 0)
    },
  },
  methods: {
    increase(item) {
      item.amount++
    },
    decrease(item) {
      if (item.amount > 1) {
        item.amount--
      } else {
        const index = this.items.indexOf(item)
        this.items.splice(index, 1)
      }
    },
  },
}
</script>

<style scoped>
div {
  font-family: var(--font-body);
}

h1 {
  font-family: var(--font-heading);
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

.action-card {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  color: var(--dark-text);
}

.add-item-card {
  margin-top: 100px;
}

.add-icon {
  font-size: 28px;
  font-weight: bold;
  margin-right: 8px;
}

.register-card {
  background-color: var(--accent-color);
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
}

.points-number {
  color: var(--accent-color);
  font-weight: bold;
}
</style>
