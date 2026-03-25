<script>
import profilePageIcon from '@/Components/Images/profileIcon.jpg'
import recyclePageIcon from '@/Components/Images/TrashCanIcon.png'
import mapPageIcon from '@/Components/Images/MapIcon.jpg'
import recycleIconMetal from '@/Components/Images/RecycleIconMetal.jpg'

export default {
  data() {
    return {
      profileIcon: profilePageIcon,
      recycleIcon: recyclePageIcon,
      mapIcon: mapPageIcon,
      placeholder: recycleIconMetal,
    }
  },
}
</script>

<template>
  <v-main class="landing-page">
    <div>
      <p>Små valg. Stor forskel.</p>
      <input
        type="search"
        id="placeholder"
        name="q"
        aria-label="Søg efter info om skrald"
      />
    </div>

    <div class="container">
      <div>
        <RouterLink to="/Cart">
          <img :src="profileIcon" alt="Profile" class="icon" />
        </RouterLink>

        <RouterLink to="/Cart">
          <img :src="recycleIcon" alt="Sorter affald" class="icon" />
        </RouterLink>
      </div>

      <div>
        <RouterLink to="/MapPage">
          <img :src="mapIcon" alt="Kort" class="icon" />
        </RouterLink>

        <RouterLink to="/RoutePage">
          <img :src="placeholder" alt="Book car" class="icon" />
        </RouterLink>
      </div>
    </div>
  </v-main>
</template>

<style scoped>
.icon {
  height: 80px;
  width: 80px;
}

.container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 20px;
}
</style>