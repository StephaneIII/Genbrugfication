<script>
export default {
  name: 'ItemComponent',
  components: {},
  data() {
    return {}
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    trashCan: {
      type: Object,
      required: true,
    },
  },
  computed: {
    iconColor() {
      return this.trashCan.Color || '#FF8C00'
    },
  },
  methods: {
    handleItemClick() {
      this.$emit('item-clicked', this.item)
    },
  },
  watch: {},
  emits: ['item-clicked', 'AddToCart'],
}
</script>

<template>
  <div class="item-card" @click="handleItemClick">
    <div class="item-image-container">
      <img v-if="item.Url" :src="item.Url" :alt="item.Name" class="item-image" />
      <div v-else class="item-placeholder"></div>

      <button class="recycling-icon" @click.stop="$emit('AddToCart', item)">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 4V2C7 1.45 6.55 1 6 1S5 1.45 5 2V4H2C1.45 4 1 4.45 1 5S1.45 6 2 6H3.05L4.83 15.17C5.12 16.73 6.46 18 8.05 18H16C17.59 18 18.93 16.73 19.22 15.17L21 6H22C22.55 6 23 5.55 23 5S22.55 4 22 4H19V2C19 1.45 18.55 1 18 1S17 1.45 17 2V4H7ZM7.19 16L5.8 8H18.2L16.81 16H7.19Z"
            fill="white"
          />
          <circle cx="9" cy="20" r="1" fill="white" />
          <circle cx="15" cy="20" r="1" fill="white" />
        </svg>
      </button>
    </div>

    <div class="item-name">
      {{ item.Name }}
    </div>

    <div v-if="trashCan.Category" class="item-category">
      {{ trashCan.Category }}
    </div>
  </div>
</template>

<style scoped>
.item-card {
  width: 160px;
  height: 200px;
  background: v-bind('`${iconColor}80`');
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.item-image-container {
  position: relative;
  flex: 1;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-placeholder {
  width: 100px;
  height: 100px;
  background: #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recycling-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #ff8c00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-name {
  padding: 8px 12px 4px;
  font-weight: 600;
  font-size: 16px;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

.item-category {
  padding: 0 12px 12px;
  font-size: 12px;
  color: #666;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .item-card {
    width: 140px;
    height: 180px;
    background: v-bind('`${iconColor}80`');
  }

  .item-name {
    font-size: 14px;
  }

  .recycling-icon {
    width: 28px;
    height: 28px;
  }
}
</style>
