<template>
  <div class="container">
    <div v-for="ability in abilitiesData" :key="ability.name" class="abilities-loop">
      <div v-if="ability.hidden" class="isHidden">Hidden Ability</div>
      <div class="info">
        <!-- <div v-if="ability.hidden" class="isHidden">Hidden Ability</div> -->
        <div
          class="ability-name"
          :style="{ backgroundColor: typeColor(type) }"
          @click="showPopup(ability)"
        >
          {{ ability.name }}
        </div>
        <div class="short-description">
          <!-- {{ ability.flavor_text }} -->
        </div>
      </div>
      <!-- POPUP CONTENT -->
      <div v-if="ability.showPopup" class="popup">
        <div class="popup-content">
          <h3>{{ ability.name }}</h3>
          <p>{{ ability.flavor_text }}</p>
          <p>{{ ability.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { usePokemonStore } from '../stores/pokemons'
const pokemonStore = usePokemonStore()
const typeColors = pokemonStore.getTypeColors
const { abilitiesData } = defineProps(['abilitiesData'])
const type = abilitiesData[0].types

const typeColor = (type) => {
  const color = typeColors[type]
  return color
}

// Toggle the showPopup property to display/hide the popup
const showPopup = (ability) => {
  ability.showPopup = !ability.showPopup
}
</script>

<style scoped>
.container {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: auto;
  width: 90%;
}
.isHidden {
  font-weight: 600;
  position: absolute;
  top: -20px;
}
.abilities-loop {
  margin: 15px 4px 20px;
  position: relative;
}
.ability-name {
  align-items: center;
  border-radius: 15px;
  border: 2px solid clear;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 17px;
  font-weight: 500;
  height: 55px;
  justify-content: center;
  width: 105px;
  z-index: -1;
  box-shadow: 0px 1px 14px -3px rgba(0, 0, 0, 0.71);
  -webkit-box-shadow: 0px 1px 14px -3px rgba(0, 0, 0, 0.71);
  -moz-box-shadow: 0px 1px 14px -3px rgba(0, 0, 0, 0.71);
}

/* .info {
  display: flex;
} */
/* .short-description {
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
  width: 105px;
} */
</style>
