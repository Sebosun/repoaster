<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { ref } from 'vue'

const props = defineProps<{
  targetChannels: string[]
}>()

const baseURL = 'http://localhost:3000'
const inputRef = ref<HTMLInputElement>()
const previewFile = ref<File>()

const previewLink = computed(() => {
  if (!previewFile.value) return ''
  return window.URL.createObjectURL(previewFile.value)
})

const formData = ref<FormData>()

const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length < 0) {
    console.error('Missing file')
    return
  }
  const tempFormData = new FormData()
  previewFile.value = files[0]
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
    if (inputRef.value) inputRef.value.value = ''
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section>
    <h1 class="text-center text-4xl py-5 px-20 mb-20">Upload meme</h1>
    <div>
      <form class="flex flex-col" enctype="multipart/form-data" @submit.prevent="onSubmit">
        <input
          ref="inputRef"
          class="file-input file-input-ghost file-input-bordered w-full"
          :class="[!formData ? 'text-rose-400' : '']"
          type="file"
          @change="onFileChanged"
          accept="image/*,video/*"
          capture
        />

        <div class="my-4" v-if="previewFile">
          <img class="rounded-md" v-if="previewFile.type.includes('image')" :src="previewLink" />
          <video class="rounded-md" v-else :src="previewLink" controls />
        </div>

        <button
          class="btn btn-accent text-end mt-5"
          :class="[!formData ? 'btn-error' : '']"
          :disabled="!formData"
        >
          Submit
        </button>
      </form>
    </div>
  </section>
</template>
