<template>
  <div class="page">
    <div v-if="isLoading">
      <div class="nav-bar">
        <DetailsNavbar :selectedPokemon="selectedPokemon" @gotoPage="scrollToSection" />
      </div>
      <h2 class="pokemon-id" style="margin-bottom: 3px">
        #{{ selectedPokemon.id }} {{ selectedPokemon.name }}
      </h2>
      <div class="types-wrapper">
        <div v-for="type in selectedPokemon.types" :key="type" class="types-loop">
          <div class="type" :style="{ backgroundColor: typeColor(type.name) }">{{ type.name }}</div>
        </div>
      </div>
      <div class="pokemon-img">
        <div class="description">
          {{ pokemonDescription }}
        </div>
        <img :src="selectedPokemon.sprite" alt="" />
      </div>

      <div class="pokemon-dimensions area">
        <div class="height">height:<br />{{ selectedPokemon.height }} m</div>
        <div class="vl"></div>
        <div class="weight">
          weight:<br />
          {{ selectedPokemon.weight }} kg
        </div>
        <div class="vl"></div>
        <div class="egg-group">
          egg-group:<br />
          {{ eggGroup }}
        </div>
      </div>
      <!-- ABILITIES SECTION -->
      <div class="abilities-section area">
        <div class="section-title">Abilities</div>
        <AbilitiesSection :abilitiesData="abilitiesData" />
      </div>
      <div ref="statsSection" class="stat-wrapper area">
        <div class="section-title">Base Stats</div>
        <div v-for="s in selectedPokemon.stats" :key="s.stat_name">
          <div class="stat-name">{{ s.stat_name }} | {{ s.base_stat }}</div>
          <div class="graph-container">
            <div
              class="graph-fill"
              :style="{
                width: `${(s.base_stat / 100) * 100}%`,
                backgroundColor: setColor(selectedPokemon)
              }"
            ></div>
          </div>
        </div>
        <div class="stat-name">Total stats: {{ totalStats }}</div>
      </div>
      <!-- EVOLUTION SECTION -->
      <div ref="evolutionsSection" class="evolution-wrapper area">
        <div class="section-title">Evolution Chain</div>
        <div class="evolution">
          <div v-for="(evo, index) in evoChain" :key="index">
            <div class="img-container">
              <div class="evolution-info">
                {{ evo.trigger_name }}
                <span v-if="evo.min_level > 1">{{ evo.min_level }}</span>
              </div>
              <img :src="evo.sprite" alt="" class="pokemonImg" />
              {{ evo.species_name }}
            </div>
            <div v-if="index < evoChain.length - 1" class="arrow"></div>
            <!-- <span v-if="index < evoChain.length - 1" class="arrow"> ➔ </span> -->
          </div>
        </div>
      </div>
    </div>
    <div class="loading" v-else><LoadingAnimation /></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { usePokemonStore } from '../stores/pokemons'
import DetailsNavbar from '../components/DetailsNavbar.vue'
import LoadingAnimation from '../components/LoadingAnimation.vue'
import AbilitiesSection from '../components/AbilitiesSection.vue'

const pokemonStore = usePokemonStore()
const selectedPokemon = ref(null)
const eggGroup = ref('')
const pokemons = ref([])
const evoChain = ref([])
const totalStats = ref(0)
const evoPokemonsInfo = ref([])
const isLoading = ref(false)
const evolutionsSection = ref(null)
const statsSection = ref(null)
const pokemonDescription = ref(null)
const abilitiesData = ref([])

const typeColors = pokemonStore.getTypeColors
const setColor = (pokemon) => {
  const mainType = pokemon.types[0].name
  const color = typeColors[mainType]

  return color
}
const typeColor = (type) => {
  const color = typeColors[type]
  return color
}
onMounted(async () => {
  const pokemonStore = usePokemonStore() // Access the store
  pokemons.value = pokemonStore.getPokemons
  const pokemonId = pokemonStore.getPokemonId // Get the value directly from the ref
  selectedPokemon.value = pokemons.value.find((pokemon) => pokemon.id === pokemonId)

  // fetching ability information
  for (let ability of selectedPokemon.value.abilities) {
    const data = await fetch(ability.url)
    console.log(ability)
    const info = await data.json()
    console.log('info', info)
    const abilityInfo = {
      types: selectedPokemon.value.types[0].name,
      name: ability.name,
      hidden: ability.is_hidden,
      description: info.effect_entries.find((entry) => entry.language.name === 'en').effect,
      flavor_text: info.flavor_text_entries.find((entry) => entry.language.name === 'en')
        .flavor_text
    }
    console.log(info.effect_entries.effect)
    abilitiesData.value.push(abilityInfo)
  }

  selectedPokemon.value.stats.forEach((element) => {
    totalStats.value += element.base_stat
  })

  if (pokemonId) {
    await fetchAdditionalDetails(pokemonId)
  }
  console.log(evoChain.value)
  evoPokemonsInfo.value = evoChain.value.map((element) => {
    console.log(pokemons.value)
    return pokemons.value.find(
      (pokemon) => pokemon.name.toLowerCase() === element.species_name.toLowerCase()
    )
  })
  console.log(evoPokemonsInfo.value)
  // isLoading.value = true
})
const scrollToSection = (sectionId) => {
  const sectionRef =
    sectionId === 'section1' ? statsSection : sectionId === 'section2' ? evolutionsSection : null
  if (sectionRef) {
    sectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
const fetchAdditionalDetails = async (pokemonId) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
    const data = await response.json()

    const eggGroupNames = data.egg_groups.map((group) => group.name)
    eggGroup.value = eggGroupNames.join(', ')
    pokemonDescription.value = data.flavor_text_entries[8].flavor_text

    const evolutionChainResponse = await fetch(data.evolution_chain.url)
    const evolutionChainData = await evolutionChainResponse.json()

    parseEvolutionChain(evolutionChainData.chain)

    // For the evolution chain, you would need to make another API call or parse the response accordingly.
  } catch (error) {
    console.error('Error fetching additional details:', error)
  }
}

const parseEvolutionChain = async (chain) => {
  do {
    let numberOfEvolutions = chain['evolves_to'].length
    console.log(numberOfEvolutions)
    console.log(chain.species_name)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}`)
    const data = await response.json()

    evoChain.value.push({
      species_name: chain.species.name,
      sprite: data.sprites.other['official-artwork'].front_default,
      min_level: chain.evolution_details.length > 0 ? chain.evolution_details[0].min_level : 1,
      trigger_name:
        chain.evolution_details.length > 0 ? chain.evolution_details[0].trigger.name : null,
      item: chain.evolution_details.length > 0 ? chain.evolution_details[0].item : null
    })
    console.log(chain)

    if (numberOfEvolutions > 1) {
      for (let i = 2; i < numberOfEvolutions; i++) {
        evoChain.value.push({
          species_name: chain.evolves_to[i].species.name,

          // min_level: chain.evolves_to[i].evolution_details.min_level
          trigger_name: !chain.evolves_to[i] ? null : chain.evolves_to[i].trigger.name
          //   ? null
          //   : chain.evolves_to[i].evolution_details.trigger.name,
          // item: !chain.evolves_to[i] ? null : chain.evolves_to[i].item
        })
        console.log(evoChain.value)
      }
    }

    chain = chain['evolves_to'][0]
    console.log(chain)
  } while (chain !== undefined && chain.hasOwnProperty('evolves_to'))
  isLoading.value = true
}
</script>

<style scoped>
/* .page {
  width: 80%;
  margin: auto;
} */
.nav-bar {
  position: sticky;
  top: 0;
  height: 60px;
  z-index: 99;
}
.types-wrapper {
  display: flex;
  justify-content: flex-end;
}
.types-loop {
  margin: 0px 10px;
}
.type {
  font-size: 20px;
  font-weight: 600;
  width: 90px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  color: white;
}
.pokemon-img {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pokemon-img img {
  height: auto;
  width: 170px;
}
.pokemon-dimensions {
  margin-top: 10px;
  display: flex;
  justify-content: space-evenly;
}
.description {
  width: 40%;
}
.vl {
  border-left: 2px solid black;
  height: 40px;
}
.height,
.weight,
.egg-group {
  font-size: 20px;
  font-weight: 500;
}
.stat-wrapper {
  width: 100%;
}
.stat-wrapper div {
  margin: 5px 0px;
}
.area {
  margin: 20px 0px;
}
.section-title {
  font-size: 24px;
  font-weight: 600;
  padding: 30px 0px;
}
.stat-name {
  font-size: 20px;
  font-weight: 500;
  padding-top: 8px;
}
.graph-container {
  width: 90%;
  height: 8px;
  background-color: rgb(219, 214, 214);
  border-radius: 20px;
}
.graph-fill {
  height: 100%;
  border-radius: 20px;
  /* background-color: rgb(0, 255, 98); */
}

.evolution {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.evolution div {
  margin: 2px 5px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}

.img-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.img-container img {
  height: auto;
  width: 80px;
}
.evolution-info span {
  padding-left: 7px;
}
.arrow {
  position: absolute;
  width: 20px;
  margin: 50px auto;
  height: 0;
  top: -50%;
  border-bottom: 10px solid black;
}

.arrow::after {
  content: '';
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 15px solid black;
  position: absolute;
  right: -10px;
  top: -10px;
}

@media screen and (min-width: 700px) {
  .img-container img {
    height: auto;
    width: 120px;
  }
  .pokemon-img img {
    height: auto;
    width: 230px;
  }
  .description {
    width: 30%;
    font-size: 18px;
    line-height: 1.6rem;
  }
}
@media screen and (max-width: 999.99px) {
  .page {
    width: 95%;
    margin: auto;
  }
}
</style>
