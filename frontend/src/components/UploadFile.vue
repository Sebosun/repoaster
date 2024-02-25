<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { ref, watch } from 'vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'

const props = defineProps<{
  targetChannels: string[]
}>()

const baseURL = 'http://localhost:3000'
const inputRef = ref<HTMLInputElement>()
const previewFile = ref<File>()
const isLoading = ref(false)
const uploadSuccess = ref(false)
const message = ref('')

const previewLink = computed(() => {
  if (!previewFile.value) return ''
  console.log(previewFile.value)
  return window.URL.createObjectURL(previewFile.value)
})

const fileData = ref<FormData>()
const hasFileData = computed(() => !!fileData.value)

const canSubmit = computed(() => Boolean(hasFileData.value || message.value))

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
  if (!message.value || !fileData.value) return
  if (fileData.value && message.value) {
    fileData.value.append('message', JSON.stringify(message.value))
  } else if (!fileData.value && message.value) {
    const tempFormData = new FormData()
    tempFormData.append('message', JSON.stringify(message.value))
    tempFormData.append('channels', JSON.stringify(props.targetChannels))
    fileData.value = tempFormData
  }

  isLoading.value = true

  try {
    const response = await fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: fileData.value
    })
    if (!response.ok) throw new Error('Failed to upload')
    fileData.value = undefined
    if (inputRef.value) inputRef.value.value = ''
    uploadSuccess.value = true
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

watch([() => message.value, () => fileData.value], ([messageValue, fileDataValue]) => {
  if (messageValue || fileDataValue) {
    uploadSuccess.value = false
  }
})
</script>

<template>
  <section>
    <h1 class="text-4xl py-5 text-center">Repoast content</h1>
    <AlertSuccess v-if="uploadSuccess" class="mb-4" message="Succesfully uploaded image" />
    <div>
      <form class="flex flex-col" enctype="multipart/form-data" @submit.prevent="onSubmit">
        <input
          v-model="message"
          type="text"
          class="input input-bordered w-full mb-4"
          placeholder="Your message"
        />

        <input
          ref="inputRef"
          class="file-input file-input-ghost file-input-bordered w-full"
          :class="[!hasFileData ? 'text-rose-400' : '']"
          type="file"
          @change="onFileChanged"
          accept="image/*,video/*"
          capture
        />

        <Transition>
          <div class="my-4" v-if="previewFile">
            <img
              class="rounded-md max-h-96 w-auto mx-auto"
              v-if="previewFile.type.includes('image')"
              :src="previewLink"
            />
            <video
              class="rounded-md max-h-96 w-auto mx-auto"
              v-else
              :src="previewLink"
              controls
            /></div
        ></Transition>

        <button
          type="submit"
          class="btn btn-accent text-end mt-5"
          :class="[!canSubmit ? 'btn-error' : '']"
          :disabled="!canSubmit"
        >
          Submit
          <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
        </button>
      </form>
    </div>
  </section>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
