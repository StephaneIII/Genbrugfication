<template>
  <div class="cart-page">
    <div class="cart-content">
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
    </div>

    <div class="cart-footer-area">
      <v-card class="pa-4 item-card action-card add-item-card">
        <span class="add-icon">+</span>
        Tilføj nyt affald
      </v-card>

      <p class="points-text">
        Optjen <span class="points-number">{{ totalPoints }}</span> point ved denne sortering!
      </p>

      <base-button class="pa-4 action-card register-card" @click="goToThankYouView">
        Registrer affald
      </base-button>
    </div> 
  </div>
</template>

<script>
import plasticIcon from '../Components/Images/RecycleIconPlastic.jpg'
import metalIcon from '../Components/Images/RecycleIconMetal.jpg'
import papIcon from '../Components/Images/RecycleIconPap.jpg'
import foodIcon from '../Components/Images/RecycleIconFood.jpg'
import BaseButton from '@/Components/BaseButton.vue';

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
    goToThankYouView() {
      this.$router.push(`/ThankYou`)
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
