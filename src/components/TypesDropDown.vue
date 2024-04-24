<template>
  <div class="dropdown" style="float: left">
    <button class="dropbtn" :style="{ backgroundColor: typeColor(selectedType) }">
      {{ selectedType }}
    </button>
    <div class="dropdown-content" style="left: 0">
      <a @click="typeSelected('')" class="type-link">All</a>
      <div v-for="type in types" :key="type">
        <a @click="typeSelected(type)" class="type-link" onMouseOver="style.color= red">{{
          type
        }}</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
// const isHovered = ref(false)
import { usePokemonStore } from '../stores/pokemons'
const pokemonStore = usePokemonStore()
const selectedType = ref('All')
const typeColors = pokemonStore.getTypeColors
const types = [
  'grass',
  'fire',
  'water',
  'normal',
  'electric',
  'dark',
  'ice',
  'bug',
  'ground',
  'dragon',
  'flying',
  'fairy',
  'ghost',
  'steel'
]
const emits = defineEmits(['selectType'])

const typeColor = (type) => {
  if (type === '') {
    return 'white'
  }
  const color = typeColors[type]
  return color
}
const typeSelected = (type) => {
  if (type === '') {
    selectedType.value = 'All'
  } else {
    selectedType.value = type
  }

  emits('selectType', type)
}
</script>
<style scoped>
.dropbtn {
  background-color: white;
  color: black;
  padding: 10px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 25px;
  cursor: pointer;
  height: 45px;
  width: 100px;
  margin-left: 20px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  margin-left: 20px;
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 110px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
}
.type-link:hover {
  cursor: pointer;
}
</style>
