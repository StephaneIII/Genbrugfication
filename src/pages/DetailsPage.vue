<script>
import appleJuice from '@/Components/Images/applejuice.png'
export default {
  data() {
    return {
      trashCount: 0,
      trash: {
        name: 'Æblejuice',
        image: appleJuice,
        home: 'Æblejuice flasker skal smides i plastik',
        station: 'Æblejuice flasker skal smides i plastik',
      },
    }
  },

  methods: {
    addtrash() {
      this.trashCount++
    },

    goToMap() {
      alert('kort')
    },

    goToCheckout() {
      alert('checkout')
    },
  },
}
</script>

<template>
  <div class="page">
    <div class="image-card">
      <img :src="trash.image" class="trash-img" />
      <button class="floating-btn" @click="goToCheckout"><img src="@/Components/Images/TrashCanIcon.png" alt="Checkout" /></button>
      <p class="trashcount">{{ trashCount }}</p>
    </div>

    <h1>{{ trash.name }}</h1>

    <div class="info-box">
      <h3>Hjemme</h3>
      <p>{{ trash.home }}</p>

      <h3>Genbrugsstation</h3>
      <p>{{ trash.station }}</p>
    </div>

    <div class="buttons">
      <button @click="addtrash">Tilføj affald</button>
      <button @click="goToMap">Kort</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  background: var(--primary-bg-color);
  color: white;
  padding: 10px;
  width: 100%;
}

.image-card {
  background: var(--secondary-color);
  padding: 10px;
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 450px;
}

.trash-img {
  width: 100%;
  height: 420px;
}

.floating-btn {
  position: absolute;
  top: 30px;
  right: 5px;
  border-radius: 50%;
  box-shadow: var(--shadow);
  font-family: var(--font-body);
}

h1 {
  text-align: center;
  font-family: var(--font-heading);
}

.info-box {
  background: var(--secondary-color);
  color: black;
  padding: 10px;
  margin-top: 10px;
  font-family: var(--font-body);
}

.buttons {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

button {
  flex: 1;
  background: var(--accent-color);
  border: none;
  padding: 8px;
  font-family: var(--font-body);
}

.trashcount {
  position: absolute;
  top: 5px;
  right: 10px;
  font-family: var(--font-body);
}
</style>
