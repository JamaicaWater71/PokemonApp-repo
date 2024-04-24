import { defineStore } from 'pinia'

export const usePokemonStore = defineStore({
  id: 'pokemons',
  state: () => ({
    pokemons: [],
    paginatedPokemons: [],
    loading: false,
    order: [],
    pokemonId: 100,
    pokemonSpecies: [],
    currentPage: 1,
    pageSize: 12,
    typeColors: {
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
      flying: '#a1bbec',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0'
    }
  }),

  actions: {
    async morePokemons() {
      try {
        if(!this.loading){
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=121`)
        const data = await response.json()

        // Iterate over the list of Pokemon and fetch details for each
        for (const pokemon of data.results) {
          const detailsResponse = await fetch(pokemon.url)
          const details = await detailsResponse.json()

          const pokemonData = {
            name: this.capital(details.name),
            sprite: details.sprites.other['official-artwork'].front_default,
            abilities: details.abilities.map((data) => {
              return {
                name: data.ability.name,
                url: data.ability.url,
                is_hidden: data.is_hidden,
                slot: data.slot
              }
            }),
            types: details.types.map((data) => {
              return {
                name: data.type.name,
                url: data.type.url
              }
            }),
            stats: details.stats.map((data) => {
              return {
                base_stat: data.base_stat,
                stat_name: data.stat.name,
                effort: data.effort
              }
            }),
            species: details.species, 
            id: details.id,
            weight: details.weight/10,
            height: details.height/10
          }
          this.pokemons.push(pokemonData)
        }
        this.updatePaginatedPokemons();
        this.loading = true;
      }} catch (error) {
        console.error('Error fetching Pokemon:', error)
      } finally {
        this.loading=true;
      }
    },
    updatePaginatedPokemons() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.paginatedPokemons = this.pokemons.slice(start, end);
    },

    setCurrentPage(page) {
      this.currentPage = page;
      this.updatePaginatedPokemons();
    },

    capital(word){
      return  word.charAt(0).toUpperCase() + word.slice(1);
    },

    setPokemonId(id) {
      this.pokemonId = id
    }
  },

  getters: {

    getPaginatedPokemons() {
      return this.paginatedPokemons;
    },

    getCurrentPage() {
      return this.currentPage;
    },
    getTotalPages() {
      return Math.ceil(this.pokemons.length / this.pageSize);
    },


    getPokemons() {
      return this.pokemons
    },

    getIsLoading() {
      return this.loading
    },

    getPokemonId() {
      return this.pokemonId
    },
    getPokemonSpecies(){
      return this.pokemonSpecies;
    },
    getPageSize(){
      return this.pageSize;
    },
    getTypeColors(){
      return this.typeColors
    }
  }
})
