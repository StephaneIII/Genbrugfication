<script>
import AppFooter from '@/Components/AppFooter.vue';
import AppHeader from '@/Components/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
  methods: {
    handleNavToDetail(trashID) {
      // Navigate to a detail route - you'll need to create this route
      this.$router.push(`/DetailsPage/${trashID}`)
    },
  },
}
</script>

<template>
  <v-app>
    <AppHeader />
    <router-view @nav-to-detail="handleNavToDetail" />
    <AppFooter />
  </v-app>
</template>

<style scoped></style>
