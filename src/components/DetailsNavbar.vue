<template>
  <nav class="navbar" :style="{ backgroundColor: setColor(selectedPokemon) }">
    <ul>
      <li><a @click="homePage">Home</a></li>
      <li><a @click.prevent="goToPage('section1')">Pokemon Stats</a></li>
      <li>
        <a @click.prevent="goToPage('section2')">Pokemon Evolutions</a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
const { selectedPokemon } = defineProps(['selectedPokemon'])
import { usePokemonStore } from '../stores/pokemons'
import { useRouter } from 'vue-router'
const pokemonStore = usePokemonStore()
const router = useRouter()
const homePage = () => {
  router.push('/')
}

const typeColors = pokemonStore.getTypeColors

const setColor = (pokemon) => {
  const mainType = pokemon.types[0].name
  const color = typeColors[mainType]

  return color
}

const emits = defineEmits(['gotoPage'])

const goToPage = (sectionId) => {
  emits('gotoPage', sectionId)
}
</script>

<style scoped>
.navbar {
  background-color: #333;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 100;
}

.navbar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.navbar li {
  margin-right: 10px;
}

.navbar a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 15px;
  padding: 10px 5px;
  margin-left: 5px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.navbar a:hover {
  cursor: pointer;
  background-color: #555555;
}
@media screen and (min-width: 700px) {
  .navbar a {
    font-size: 20px;
  }
}
</style>
