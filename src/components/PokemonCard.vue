<template>
  <div
    class="card"
    @mouseover="expandCard"
    @mouseleave="resetCard"
    :style="{ backgroundColor: setColor(pokemon) }"
  >
    <div class="top-wrapper">
      <div class="pokemon-id">#{{ pokemon.id }}</div>
      <div class="type-container">
        <div class="icon" v-for="type in pokemon.types" :key="type.name" :class="type.name">
          <img :src="`/icons/${type.name}.svg`" />
        </div>
      </div>
    </div>
    <div class="img-container">
      <img :src="pokemon.sprite" alt="" class="pokemonImg" />
    </div>
    <div class="stat-wrapper" v-if="expanded">
      <div class="pokemon-info" v-for="stat in pokemon.stats" :key="stat.stat_name">
        <div>{{ stat.stat_name }} | {{ stat.base_stat }}</div>
        <div class="graph-container">
          <div
            class="graph-fill"
            :style="{
              width: `${(stat.base_stat / 100) * 100}%`,
              backgroundColor: setColor(pokemon)
            }"
          ></div>
        </div>
      </div>
      <button
        class="btn-info"
        @click="toMoreDetails(pokemon.id)"
        :style="buttonStyle"
        @mouseover="setHover(true)"
        @mouseout="setHover(false)"
      >
        More Info
      </button>
    </div>

    <div class="ability-container">
      <strong>Abilities:</strong>
      <ul class="ability-list">
        <li v-for="ability in pokemon.abilities" :key="ability.name">
          {{ ability.name }}
        </li>
      </ul>
    </div>
    <h1 class="pokemon-name">{{ pokemon.name }}</h1>
    <div class="grey-bg">
      <div class="loading-container">
        <div class="pokeball"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const { pokemon } = defineProps(['pokemon'])
import { useRouter } from 'vue-router'
import { usePokemonStore } from '../stores/pokemons'
import { computed } from 'vue'

const pokemondata = usePokemonStore()
const router = useRouter()
const expanded = ref(false)
const toMoreDetails = (id) => {
  pokemondata.setPokemonId(id)
  router.push(`/moreInfo/${id}`)
}

const isHovered = ref(false)

const buttonStyle = computed(() => {
  return {
    border: `2px solid ${setColor(pokemon)}`,
    // Add other styles as needed
    backgroundColor: isHovered.value ? setColor(pokemon) : 'white' // Adjust hover background color
  }
})

const setHover = (hovered) => {
  isHovered.value = hovered
}

const expandCard = () => {
  expanded.value = true
}
const resetCard = () => {
  expanded.value = false
}

const setColor = (pokemon) => {
  const mainType = pokemon.types[0].name
  const color = typeColors[mainType]
  return color
}

const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  fairy: 'pink',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0'
}

// const buttonStyle = computed(() => {
//   return {
//     border: `2px solid ${setColor(pokemon.value)}`

//   }
// })
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.grey-bg {
  width: 90%;
  height: 45%;
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
}
.pokeball {
  display: block;
  width: 150px; /* Modify the width value */
  height: 150px; /* Modify the height value */
  background: radial-gradient(
      gray 12px,
      gray 13px 14px,
      white 15px 18px,
      gray 19px 24px,
      transparent 25px
    ),
    linear-gradient(
      to bottom,
      rgb(193, 175, 175) 0 60px,
      gray 61px 75px,
      rgb(201, 196, 196) 76px 100%
    );
  border-radius: 50%;
  border: 6px solid gray; /* Modify the border value */
}

.graph-container {
  width: 100%;
  height: 5px;
  background-color: white;
}
.graph-fill {
  max-width: 100%;
  height: 100%;
  /* background-color: rgb(0, 255, 98); */
}
.ability-list {
  margin-top: 5px;
  margin-bottom: 20px;
}
.ability-container {
  text-align: left;
  padding-left: 20px;
  height: 30%;
}
.stat-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(34, 48, 48);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  text-align: left;
  z-index: 2; /* Ensure the info box appears above the image */
}

.pokemon-info {
  width: 100%;
  margin-bottom: 8px;
}

.pokemon-info div {
  color: white;
  font-weight: 400;
}
.btn-info {
  width: 90%;
  margin-top: 10px;
  padding: 10px;

  font-weight: 600;
}
.type-container {
  position: absolute;
  top: 4px;
  right: 3px;
}

.btn-info:hover {
  cursor: pointer;
}
.img-container {
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 1;
}

.pokemonImg {
  width: 125px;
  height: 110px;
  z-index: 1;
}

.top-wrapper {
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.pokemon-id {
  font-size: 25px;
  font-weight: 600;
  margin-left: 4px;
}
.pokemon-name {
  font-size: 25px;
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: center;
}

.card {
  width: 100%;
  height: 300px;
  position: relative;
  box-shadow: 0px 1px 2px 1px rgba(20, 0, 0, 0.48);
}

.icon {
  border-radius: 100%;
  height: 30px;
  width: 30px;
  margin-top: 5px;
  transition: 200ms all;
  z-index: 1;
}

.icon img {
  height: 60%;
  width: 60%;
  margin: 20%;
}

ul > li {
  list-style: none;
}

/* Pokemon Types */
.bug {
  background: #92bc2c;
  box-shadow: 0 0 6px #92bc2c;
}

.dark {
  background: #595761;
  box-shadow: 0 0 6px #595761;
}

.dragon {
  background: #0c69c8;
  box-shadow: 0 0 6px #0c69c8;
}

.electric {
  background: #f2d94e;
  box-shadow: 0 0 6px #f2d94e;
}

.fire {
  background: #fba54c;
  box-shadow: 0 0 6px #fba54c;
}

.fairy {
  background: #ee90e6;
  box-shadow: 0 0 6px #ee90e6;
}

.fighting {
  background: #d3425f;
  box-shadow: 0 0 6px #d3425f;
}

.flying {
  background: #a1bbec;
  box-shadow: 0 0 6px #a1bbec;
}

.ghost {
  background: #5f6dbc;
  box-shadow: 0 0 6px #5f6dbc;
}

.grass {
  background: #5fbd58;
  box-shadow: 0 0 5px #5fbd58;
}

.ground {
  background: #da7c4d;
  box-shadow: 0 0 6px #da7c4d;
}

.ice {
  background: #75d0c1;
  box-shadow: 0 0 6px #75d0c1;
}

.normal {
  background: #a0a29f;
  box-shadow: 0 0 6px #a0a29f;
}

.poison {
  background: #b763cf;
  box-shadow: 0 0 6px #b763cf;
}

.psychic {
  background: #fa8581;
  box-shadow: 0 0 6px #fa8581;
}

.rock {
  background: #c9bb8a;
  box-shadow: 0 0 10px #c9bb8a;
}

.steel {
  background: #5695a3;
  box-shadow: 0 0 10px #5695a3;
}

.water {
  background: #539ddf;
  box-shadow: 0 0 6px #539ddf;
}
</style>
