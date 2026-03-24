<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h1>Detail Page for Item ID: {{ $route.params.trashID }}</h1>
          </v-card-title>
          <v-card-text>
            <p>This is the detail page for item: {{ $route.params.trashID }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="$router.push('/SearchPage')"> Back to Search </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DetailPage',
  props: {
    trashID: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
/* Add any specific styles for the detail page here */
</style>
