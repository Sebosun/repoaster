<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  targetChannels: string[]
}>()
const baseURL = 'http://localhost:3000'

const formData = ref<FormData>()

const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length < 0) {
    console.error('Missing file')
    return
  }
  const tempFormData = new FormData()
  tempFormData.append('image', files[0])
  tempFormData.append('channels', JSON.stringify(props.targetChannels))
  formData.value = tempFormData
}

const onSubmit = async () => {
  if (!formData.value) return

  try {
    const response = await fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: formData.value
    })
    if (response.ok) window.alert('File uploaded successfully')
    formData.value = undefined
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <main>
    <h1 class="text-center text-4xl py-5 px-20 mb-20">Upload meme</h1>
    <div class="flex items-center justify-center gap-8">
      <input
        class="file-input file-input-ghost file-input-bordered w-full max-w-xs"
        :class="[!formData ? 'text-rose-400' : '']"
        type="file"
        @change="onFileChanged"
        accept="image/*"
        capture
      />
      <button
        class="btn btn-accent"
        :class="[!formData ? 'btn-error' : '']"
        :disabled="!formData"
        @click="onSubmit"
      >
        Submit
      </button>
    </div>
  </main>
</template>
