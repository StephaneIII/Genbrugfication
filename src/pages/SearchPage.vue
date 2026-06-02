<script>
export default {
  name: 'SearchPage',

  data() {
    return {
      searchParameter: '',
      categories: [
        { name: 'Metal', image: '/images/icons/metal.jpg', route: '/ListOfTrash/1/' },
        {
          name: 'Restaffald',
          image: '/images/icons/restaffald.jpg',
          route: '/ListOfTrash/2/',
        },
        { name: 'Plast', image: '/images/icons/plast.jpg', route: '/ListOfTrash/3/' },
        { name: 'Madaffald', image: '/images/icons/madaffald.jpg', route: '/ListOfTrash/4/' },
        { name: 'Pap', image: '/images/icons/pap.jpg', route: '/ListOfTrash/5/' },
        {
          name: 'Farligt affald',
          image: '/images/icons/farligt-affald.jpg',
          route: '/ListOfTrash/6/',
        },
      ],
      popularSearches: ['Pizzaæske', 'Blød plast', 'Kaffeposer', 'Batteri'],
    }
  },

  computed: {
    filteredCategories() {
      return this.categories.filter((category) =>
        category.name.toLowerCase().includes(this.searchParameter.toLowerCase()),
      )
    },
  },

  methods: {
    goToCategory(route) {
      this.$router.push(route)
    },

    searchPopular(search) {
      this.searchParameter = search
    },
  },
}
</script>

<template>
  <main class="search-page">
    <div class="search-content">
      <section class="search-hero">
        <h1>Sortering</h1>

        <form class="search-form" @submit.prevent>
          <input
            v-model="searchParameter"
            type="text"
            placeholder="Søg efter skrald"
            class="search-input"
          />

          <button class="search-button" type="submit">Søg</button>
        </form>
      </section>

      <section class="category-section">
        <h2>Vælg kategori</h2>

        <div class="category-grid">
          <button
            v-for="category in filteredCategories"
            :key="category.name"
            class="category-card"
            type="button"
            @click="goToCategory(category.route)"
          >
            <img :src="category.image" :alt="category.name" class="category-icon" />
          </button>
        </div>
      </section>

      <section class="popular-section mobile-popular">
        <h2>Mest søgte lige nu</h2>

        <button
          v-for="search in popularSearches"
          :key="search"
          class="popular-item"
          type="button"
          @click="searchPopular(search)"
        >
          <span>{{ search }}</span>
          <span class="popular-arrow">›</span>
        </button>
      </section>
    </div>

    <section class="desktop-info">
      <img src="/images/logo/logo.png" alt="Zealand logo" class="desktop-logo" />

      <h2>Små valg gør en stor forskel</h2>

      <p>
        Ved at sortere affald korrekt hjælper du med at genanvende ressourcer og passe på miljøet.
      </p>

      <section class="popular-section desktop-popular">
        <h2>Mest søgte lige nu</h2>

        <button
          v-for="search in popularSearches"
          :key="search"
          class="popular-item"
          type="button"
          @click="searchPopular(search)"
        >
          <span>{{ search }}</span>
          <span class="popular-arrow">›</span>
        </button>
      </section>
    </section>
  </main>
</template>

<style scoped>
.search-page {
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background-color: var(--color-bg);
  padding: var(--gap-med);
  font-family: var(--font-body);
  color: var(--color-text);
}

.search-hero {
  text-align: center;
  margin-bottom: var(--gap-large);
}

.search-hero h1 {
  font-family: var(--font-heading);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--gap-small);
}

.search-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-small);
}

.search-input {
  width: 100%;
  max-width: 320px;
  height: 44px;
  padding: 0 var(--gap-med);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-med);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  outline: none;
}

.search-input:focus {
  border-color: var(--color-primary);
}

.search-button {
  min-width: 120px;
  height: 40px;
  border: none;
  border-radius: var(--border-radius-med);
  background-color: var(--color-accent);
  color: var(--color-text-light);
  font-family: var(--font-heading);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: var(--shadow);
}

.category-section {
  background-color: var(--color-surface-muted);
  border-radius: var(--border-radius-large);
  padding: var(--gap-large) var(--gap-med);
  margin-bottom: var(--gap-large);
}

.category-section h2,
.popular-section h2 {
  font-family: var(--font-heading);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--gap-med);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-med);
}

.category-card {
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 0;
  border: none;
  border-radius: var(--border-radius-small);
  background: transparent;
  overflow: hidden;
  cursor: pointer;
}

.category-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.popular-section {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-large);
  padding: var(--gap-med);
  box-shadow: var(--shadow);
}

.popular-item {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: var(--gap-med) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  cursor: pointer;
}

.popular-item:last-child {
  border-bottom: none;
}

.popular-arrow {
  font-size: 1.8rem;
  color: var(--color-text-muted);
}

.desktop-info {
  display: none;
}

@media (min-width: 768px) {
  .search-page {
    max-width: 700px;
    margin: 0 auto;
    padding: var(--gap-large);
  }

  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .search-form {
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .search-page {
    max-width: var(--max-width);
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    padding: var(--gap-xl);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: var(--gap-xl);
    align-items: start;
  }

  .search-page::after {
    content: '';
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    grid-column: 2;
    grid-row: 1;
  }

  .search-content {
    grid-column: 1;
  }

  .desktop-info {
    grid-column: 3;
    display: block;
    padding-top: var(--gap-med);
  }

  .desktop-logo {
    width: 88px;
    height: 88px;
    margin-bottom: var(--gap-large);
  }

  .desktop-info > h2 {
    font-family: var(--font-heading);
    font-size: var(--font-size-h2);
    color: var(--color-primary);
    margin-bottom: var(--gap-small);
  }

  .desktop-info > p {
    max-width: 420px;
    font-size: var(--font-size-body);
    color: var(--color-text);
    margin-bottom: var(--gap-large);
  }

  .mobile-popular {
    display: none;
  }

  .desktop-popular {
    display: block;
    max-width: 480px;
  }

  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
