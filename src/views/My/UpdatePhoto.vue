<template>
  <div>
    <img :src="photo" alt="" ref="img" />
    <button class="btn" @click="confirm">完成</button>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { uploadPhoto } from '@/api'
export default {
  props: ['photo'],
  mounted() {
    const img = this.$refs.img
    this.myCropper = new Cropper(img)
  },
  methods: {
    confirm() {
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        fm.append('photo', blob)
        const { data } = await uploadPhoto(fm)
        // console.log(data.data.photo)
        this.$emit('confirmClickFn', data.data.photo)
      })
    }
  }
}
</script>

<style scoped>
.btn {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
