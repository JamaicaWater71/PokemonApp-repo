<template>
  <div class="loading-container">
    <div class="pokeball"></div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
/* .loading-container {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: white;
} */

.loading-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pokeball {
  display: block;
  width: 120px; /* Modify the width value */
  height: 120px; /* Modify the height value */
  background: radial-gradient(
      white 12px,
      black 13px 14px,
      white 15px 18px,
      black 19px 24px,
      transparent 25px
    ),
    linear-gradient(to bottom, red 0 50px, black 51px 60px, white 61px 100%);
  border-radius: 50%;
  border: 6px solid black; /* Modify the border value */

  animation: spin 2s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
