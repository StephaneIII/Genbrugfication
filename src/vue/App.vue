<script setup lang="ts"></script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h3 mb-4">You did it!</h1>
            <v-card class="pa-6" elevation="2">
              <v-card-text>
                <p class="text-h6 mb-4">Your Vue.js application with Vuetify is now ready!</p>
                <v-btn
                  href="https://vuejs.org/"
                  target="_blank"
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-vuejs"
                  class="ma-2"
                >
                  Vue.js Documentation
                </v-btn>
                <v-btn
                  href="https://vuetifyjs.com/"
                  target="_blank"
                  color="secondary"
                  variant="elevated"
                  prepend-icon="mdi-vuetify"
                  class="ma-2"
                >
                  Vuetify Documentation
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
