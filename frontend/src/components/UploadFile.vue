<script setup lang="ts">
const baseURL = 'http://localhost:3000'
const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length < 0) {
    console.error('Missing file')
    return
  }
  const formData = new FormData()
  formData.append('image', files[0])
  try {
    await fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: formData
    })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="text-center">
    <input type="file" @change="onFileChanged" accept="image/*" capture />
  </div>
</template>
