<template>
  <div class="container" v-if="loading">
    <HeaderCard />
    <div class="input-container">
      <input
        type="text"
        placeholder="search by name or id"
        name="search"
        class="search-bar"
        v-model.trim="search"
      />
      <TypesDropDown @select-type="selectType" />
    </div>
    <div class="card-wrapper">
      <PokemonCard
        v-for="pokemon in paginatedPokemons"
        :key="pokemon.id"
        :pokemon="pokemon"
        class="card"
      />
      <div v-if="paginatedPokemons.length === 0" class="no-matches-message">No matches found.</div>
    </div>
    <div v-if="!search" class="pagination">
      <button @click="changePage(-1)" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
  <div class="loading" v-else><LoadingAnimation /></div>
</template>

<script setup>
import { usePokemonStore } from '../stores/pokemons'
import HeaderCard from '../components/HeaderCard.vue'
import LoadingAnimation from '../components/LoadingAnimation.vue'
import PokemonCard from '../components/PokemonCard.vue'
import TypesDropDown from '../components/TypesDropDown.vue'

import { ref, watch, onMounted } from 'vue'

const store = usePokemonStore()

const search = ref('')
const pokemons = ref([])
const loading = ref(null)
const currentPage = ref()
const totalPages = ref()
const paginatedPokemons = ref()
const selectedType = ref(null)
const pokemonTypes = ref([])

// const filteredPokemons = ref([])
const pSize = 12
onMounted(async () => {
  await store.morePokemons()
  pokemons.value = store.getPokemons
  updatePageData()
})

const updatePageData = () => {
  // pokemons.value = store.getPokemons
  currentPage.value = store.getCurrentPage
  loading.value = store.getIsLoading

  // Apply pagination to the filteredPokemons array
  const startIdx = (currentPage.value - 1) * pSize
  const endIdx = startIdx + pSize
  paginatedPokemons.value = filterAndPaginatePokemons(
    pokemons.value,
    search.value,
    selectedType.value,
    startIdx,
    endIdx
  )
  console.log(paginatedPokemons.value)
  if (!selectedType.value) {
    totalPages.value = amountPages(pokemons.value, pSize)
  } else {
    totalPages.value = amountPages(pokemonTypes.value, pSize)
    console.log(pokemonTypes.value)
  }
}
// Start of changePage section
const changePage = (delta) => {
  const newPage = currentPage.value + delta
  if (newPage >= 1 && newPage <= totalPages.value) {
    store.setCurrentPage(newPage)
  }
  updatePageData()
}
const howMany = (arr, types) => {
  const filteredPokemons = arr.filter((pokemon) => {
    const matchesType = pokemon.types.some(
      (type) => type.name.toLowerCase() === types.toLowerCase()
    )

    return matchesType
  })

  return filteredPokemons
}
// Watch search and update filteredPokemons
watch(search, () => {
  updatePageData()
  // Reset to the first page when the search term changes
  store.setCurrentPage(1)
})

const filterAndPaginatePokemons = (pokemons, searchTerm, selectedType, startIdx, endIdx) => {
  const filteredPokemons = pokemons
    .filter((pokemon) => {
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) || pokemon.id == searchTerm

      const matchesType =
        !selectedType ||
        pokemon.types.some((type) => type.name.toLowerCase() === selectedType.toLowerCase())

      return matchesSearch && matchesType
    })
    .slice(startIdx, endIdx)

  return filteredPokemons
}

const selectType = (type) => {
  pokemonTypes.value = howMany(pokemons.value, type)
  store.setCurrentPage(1)
  selectedType.value = type
  updatePageData()
}

// total pages
const amountPages = (arr, size) => {
  return Math.ceil(arr.length / size)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
}
.input-container {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.input-container input {
  height: 45px;
  width: 40%;
  border: 2px solid black;
  border-radius: 25px;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 600;
}
.card-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(230px, 230px));
  gap: 15px;
}
.pagination button {
  width: 100px;
  height: 40px;
  font-weight: 600;
  margin: 0px 40px;
}
.pagination button:hover {
  cursor: pointer;
}
.pagination span {
  display: flex;
  align-items: center;
}

@media screen and (min-width: 250px) and (max-width: 500px) {
  .input-container input {
    font-size: 11px;
  }
}
</style>
