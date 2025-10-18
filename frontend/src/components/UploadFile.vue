<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { repostFile, repostMessage } from '@/api/sendCommands'

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

const clearData = () => {
  isLoading.value = false
  message.value = ''
  previewFile.value = undefined
  if (inputRef.value) inputRef.value.value = ''
}

const applyNewFile = (newFile: File): void => {
  const tempFormData = new FormData()
  previewFile.value = newFile
  tempFormData.append('image', newFile)
  tempFormData.append('channels', JSON.stringify(props.targetChannels))
  fileData.value = tempFormData
}

const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length < 0) {
    console.error('Missing file')
    return
  }
  applyNewFile(files[0])
}

const submit = async () => {
  if (!message.value && !fileData.value) return

  const sendOnlyMessage = Boolean(message.value) && Boolean(!fileData.value)
  if (sendOnlyMessage) {
    await repostMessage(message.value, props.targetChannels)
    return
  }

  sendFile()
}

const sendFile = async () => {
  if (fileData.value && message.value) {
    fileData.value.append('message', JSON.stringify(message.value))
  } else if (!fileData.value && message.value) {
    const tempFormData = new FormData()
    tempFormData.append('message', message.value)
    tempFormData.append('channels', JSON.stringify(props.targetChannels))
    fileData.value = tempFormData
  }

  if (!fileData.value) return

  try {
    isLoading.value = true
    const response = await repostFile(fileData.value)
    if (!response.ok) throw new Error('Failed to upload')
    clearData()
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

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return
  const file = items[0].getAsFile()
  if (!file) return

  applyNewFile(file)
}
</script>

<template>
  <section @paste="handlePaste">
    <AlertSuccess v-if="uploadSuccess" class="mb-4" message="Succesfully uploaded image" />
    <div>
      <form class="flex flex-col" enctype="multipart/form-data" @submit.prevent="submit">
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
            <video class="rounded-md max-h-96 w-auto mx-auto" v-else :src="previewLink" controls />
          </div>
        </Transition>

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
