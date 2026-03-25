<script>
import appleJuice from '@/Components/Images/applejuice.png'
import BaseButton from '@/Components/BaseButton.vue';
export default {
  components: {
    BaseButton,
  },
  data() {
    return {
      trashCount: 0,
      trash: {
        name: 'Æblejuice',
        id: 1,
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
      this.$router.push(`/PostcodePage`)
    },

    goToCheckout() {
      this.$router.push(`/Cart`)
    },
  },
}
</script>

<template>
  <div class="page">
    <div class="image-card">
      <img :src="trash.image" class="trash-img" />
      <button class="floating-btn" @click="goToCheckout"><img src="@/Components/Images/TrashCanIcon.png" alt="Checkout" style="width: 40px; height: 40px;" /></button>
      <p class="trashcount">{{ trashCount }}</p>
    </div>

    <h1>{{ trash.name }}</h1>

    <div class="info-box">
      <div class="info-wrapper">
        <h3>Hjemme</h3>
        <p>{{ trash.home }}</p>
      </div>

      <div class="info-wrapper">
        <h3>Genbrugsstation</h3>
        <p>{{ trash.station }}</p>
      </div>
    </div>

    <div class="buttons">
      <BaseButton @click="addtrash">
        Tilføj Affald
      </BaseButton>
      <BaseButton @click="goToMap">
        Vis kort
      </BaseButton>
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
  height: 300px;
  overflow: hidden;
  border-radius: 15px;
}

.trash-img {
  width: 30%;
  height: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  padding: 10px;
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
  margin-top: 10px;
  /* margin-top: 1rem; */
}

.info-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--secondary-color);
  color: white;
  padding: 10px;
  margin-top: 10px;
  height: 250px;
  font-family: var(--font-body);
  border-radius: 15px;
}

.info-wrapper > h3{
  margin-bottom: 0.4rem;
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
  top: 20px;
  right: 10px;
  font-family: var(--font-body);
}

@media (max-height: 700px) {
  .image-card {
background: var(--secondary-color);
  padding: 10px;
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 15px;
  }
}


@media (min-height: 840px) {
  .image-card {
  background: var(--secondary-color);
  padding: 10px;
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 15px;
}

.info-box {
  background: var(--secondary-color);
  color: white;
  padding: 10px;
  margin-top: 10px;
  height: 320px;
  font-family: var(--font-body);
  border-radius: 15px;
}
}
@media (min-height: 900px) {
  .image-card {
  background: var(--secondary-color);
  padding: 10px;
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 15px;
}

.info-box {
  background: var(--secondary-color);
  color: white;
  padding: 10px;
  margin-top: 10px;
  height: 300px;
  font-family: var(--font-body);
  border-radius: 15px;
}
}
</style>
