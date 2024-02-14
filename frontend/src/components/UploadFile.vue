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

const fileData = ref<FormData>()
const hasFileData = computed(() => !!fileData.value)

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
  fileData.value = tempFormData
}

const onSubmit = async () => {
  if (!fileData.value) return

  try {
    const response = await fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: fileData.value
    })
    if (response.ok) window.alert('File uploaded successfully')
    fileData.value = undefined
    if (inputRef.value) inputRef.value.value = ''
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section>
    <h1 class="text-4xl py-5 text-center">Upload meme</h1>
    <div>
      <form class="flex flex-col" enctype="multipart/form-data" @submit.prevent="onSubmit">
        <input
          ref="inputRef"
          class="file-input file-input-ghost file-input-bordered w-full"
          :class="[!hasFileData ? 'text-rose-400' : '']"
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
          type="submit"
          class="btn btn-accent text-end mt-5"
          :class="[!hasFileData ? 'btn-error' : '']"
          :disabled="!hasFileData"
        >
          Submit
        </button>
      </form>
    </div>
  </section>
</template>
