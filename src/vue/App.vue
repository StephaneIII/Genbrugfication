<script>
export default {
  name: 'App',
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
    <router-view @nav-to-detail="handleNavToDetail" />
  </v-app>
</template>

<style scoped></style>
