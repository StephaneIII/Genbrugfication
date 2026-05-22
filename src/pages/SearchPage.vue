<script>
export default {
  name: 'SearchPage',

  data() {
    return {
      searchParameter: '',
      categories: [
        { name: 'Metal', image: '/images/icons/metal.jpg', route: '/category/metal' },
        {
          name: 'Restaffald',
          image: '/images/icons/restaffald.jpg',
          route: '/category/restaffald',
        },
        { name: 'Plast', image: '/images/icons/plast.jpg', route: '/category/plast' },
        { name: 'Madaffald', image: '/images/icons/madaffald.jpg', route: '/category/madaffald' },
        { name: 'Pap', image: '/images/icons/pap.jpg', route: '/category/pap' },
        {
          name: 'Farligt affald',
          image: '/images/icons/farligt-affald.jpg',
          route: '/category/farligt-affald',
        },
      ],
      popularSearches: ['Pizzæske', 'Blød plast', 'Kaffeposer', 'Batteri'],
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
  color: var(--color-primary);
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

<!-- gammelkode -->
<!-- <script>
import { purple } from 'vuetify/util/colors'
import ItemComponent from '../Components/SearchComponents/ItemComponent.vue'
import BaseButton from '@/Components/BaseButton.vue';

export default {
  name: 'SearchPage',
  components: {
    ItemComponent,
    BaseButton,
  },
  data() {
    return {
      searchParameter: '',
      sampleItems: [
        {
          TrashID: 1,
          TrashCategoryID: 1,
          Name: 'Æblejuice',
          imgurl: 'https://media.discordapp.net/attachments/1485746402696106017/1485746422501605457/image.png?ex=69c2fcae&is=69c1ab2e&hm=2dc305dd13000f4df93308a1f25726005e7e229ebba64fe2b41da1e02c30e54e&=&format=webp&quality=lossless&width=323&height=426',
          IsRecyclingStation: false,
        },
        {
          TrashID: 2,
          TrashCategoryID: 1,
          Name: 'Plastflaske',
          imgurl: 'https://media.discordapp.net/attachments/1485746402696106017/1485746992595472484/image.png?ex=69c2fd36&is=69c1abb6&hm=f86f36783b300143e2aab56ac41b09295e8fded39e553f657745eb03d9504a65&=&format=webp&quality=lossless&width=189&height=512',
          IsRecyclingStation: false,
        },

        {
          TrashID: 3,
          TrashCategoryID: 2,
          Name: 'Batteri (AA)',
          imgurl: 'https://media.discordapp.net/attachments/1485746402696106017/1485747310104281178/image.png?ex=69c2fd82&is=69c1ac02&hm=96cd3d74fa621a7340b728a28c6134fe722fa9206eca20ed06a0af01af8735e6&=&format=webp&quality=lossless&width=363&height=327',
          IsRecyclingStation: true,
        },
        {
          TrashID: 4,
          TrashCategoryID: 2,
          Name: 'Sparepære',
          imgurl: 'https://media.discordapp.net/attachments/1485746402696106017/1485747653542154241/image.png?ex=69c2fdd4&is=69c1ac54&hm=ce3fb90354e513da9b769a943e8dc0c2a709e8cccdca27db0ff9fa3ee05635dc&=&format=webp&quality=lossless&width=320&height=410',
          IsRecyclingStation: true,
        },

        {
          TrashID: 5,
          TrashCategoryID: 3,
          Name: 'Pizzakarton',
          imgurl: 'https://media.discordapp.net/attachments/1485746402696106017/1485747875983130694/image.png?ex=69c2fe09&is=69c1ac89&hm=e08b3662d05f2bd8ed8261852dc30941379d1d50465123b72014993c57b49f35&=&format=webp&quality=lossless&width=401&height=297',
          IsRecyclingStation: false,
        },
        {
          TrashID: 6,
          TrashCategoryID: 3,
          Name: 'Avis',
          imgurl: 'https://cdn.discordapp.com/attachments/1485746402696106017/1485748098687828099/image.png?ex=69c2fe3e&is=69c1acbe&hm=dce985b7bb160d7b90c091b33b8633d2c1f5c0c48143b56800b87185ebb84880&',
          IsRecyclingStation: false,
        },

        {
          TrashID: 7,
          TrashCategoryID: 4,
          Name: 'Ost',
          imgurl: 'https://media.discordapp.net/attachments/1485746402696106017/1485748307991986346/image.png?ex=69c2fe70&is=69c1acf0&hm=2864c9ec66931a445a1fb6cc0afb2454bad471edd35d37ba879feba2b4194611&=&format=webp&quality=lossless&width=534&height=369',
          IsRecyclingStation: false,
        },
        {
          TrashID: 8,
          TrashCategoryID: 4,
          Name: 'Bananskræl',
          imgurl: 'https://media.discordapp.net/attachments/1485746402696106017/1485748533176041632/image.png?ex=69c2fea6&is=69c1ad26&hm=62549690eb04fe5257c175877acb4da37f0ea44b94556cbb31501bee903bf5dc&=&format=webp&quality=lossless&width=534&height=368',
          IsRecyclingStation: false,
        },
      ],

      sampleTrashCans: [
        {
          TrashCategoryID: 1,
          Color: 'purple',
          Category: 'Plast',
          Description: 'Plastemballage og drikkekartoner',
        },
        {
          TrashCategoryID: 2,
          Color: '#D32F2F',
          Category: 'Rød boks',
          Description: 'Småt farligt affald (fx batterier, pærer m.m.)',
        },
        {
          TrashCategoryID: 3,
          Color: '#FF8C00',
          Category: 'Papir',
          Description: 'Papir og pap',
        },
        {
          TrashCategoryID: 4,
          Color: '#4CAF50',
          Category: 'Organisk',
          Description: 'Madaffald',
        },
      ],
    }
  },
  computed: {
    itemsWithTrashCans() {
      return this.sampleItems
        .filter((item) => item.Name.toLowerCase().includes(this.searchParameter.toLowerCase()))
        .slice(0, 10)
        .map((item) => {
          const trashCan = this.sampleTrashCans.find((tc) => tc.TrashCategoryID === item.TrashCategoryID)
          return {
            item,
            trashCan: trashCan || this.sampleTrashCans[0],
          }
        })
    },
  },
  methods: {
    handleItemClick(item) {
      this.$emit('nav-to-detail', item.TrashID)
    },
    handleSearch() {
      searchResults = this.sampleItems.filter((item) =>
        item.Name.toLowerCase().includes(this.searchParameter.toLowerCase()),
      )
    },
    handleAddToCart(item) {
      console.log(`Tilføjet "${item.Name}" til genbrugs liste!`)
    },
  },
  emits: ['nav-to-detail', 'AddToCart'],
}
</script>

<template>
  <div class="search-page">
    <div class="search-header">
      <h1 style="color: white">
        Små valg. <br />
        stor forskel.
      </h1>
    </div>

    <div class="items-container">
      <form @submit.prevent="handleSearch" class="search-form">
        <input
          type="text"
          v-model="searchParameter"
          placeholder="Søg efter affaldstype..."
          class="search-input"
        />
        <BaseButton @click="addtrash">
        Søg
        </BaseButton>
      </form>

      <div class="items-grid">
        <ItemComponent
          v-for="{ item, trashCan } in itemsWithTrashCans"
          :key="item.TrashID"
          :item="item"
          :trashCan="trashCan"
          @item-clicked="handleItemClick"
          @AddToCart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--secondary-color);
  min-height: 100vh;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.search-header p {
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.items-container {
  background-color: lightgray;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 0 auto;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  justify-items: center;
}

.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  width: 100%;
}

.search-input {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-width: 300px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.search-button {
  padding: 12px 24px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #45a049;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-page {
    padding: 16px;
  }

  .search-header h1 {
    font-size: 2rem;
  }

  .items-container {
    padding: 20px;
    margin: 16px;
  }

  .items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .search-form {
    flex-direction: column;
    gap: 12px;
  }

  .search-input {
    min-width: 100%;
    width: 100%;
  }

  .search-button {
    align-self: center;
    min-width: 120px;
  }
}
</style> -->
