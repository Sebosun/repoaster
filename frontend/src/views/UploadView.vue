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
  <main>
    <h1 class="text-center text-8xl mb-20">Image upload app</h1>
    <div class="text-center">
      <input type="file" @change="onFileChanged" accept="image/*" capture />
    </div>
  </main>
</template>
