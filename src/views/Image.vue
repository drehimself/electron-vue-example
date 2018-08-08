<template>
  <div>
    <img :src="imageUrl" alt="image">
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  created() {
    ipcRenderer.on('image', (event, arg) => {
      this.imageUrl = arg
    })
  },
  data() {
    return {
      imageUrl: ''
    }
  }
}
</script>

<style scoped>
  img {
    max-width: 100%;
  }
</style>


