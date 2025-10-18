<script setup lang="ts">
import { ref, computed } from 'vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import { repostYtdlp } from '@/api/sendCommands'

const props = defineProps<{
  targetChannels: string[]
}>()

const isLoading = ref<boolean>(false)
const link = ref<string>()
const uploadSuccess = ref<boolean>(false)
const uploadError = ref<boolean>(false)

const canSubmit = computed(() => Boolean(link.value))

const submit = async () => {
  uploadSuccess.value = false
  uploadError.value = false
  if (!link.value) return
  try {
    isLoading.value = true
    const response = await repostYtdlp(link.value, props.targetChannels)
    if (response.ok) {
      uploadSuccess.value = true
    } else {
      uploadError.value = true
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="flex flex-col" @submit.prevent="submit">
    <input
      v-model="link"
      type="text"
      class="input input-bordered w-full mb-4"
      placeholder="Your link"
    />
    <AlertSuccess v-if="uploadSuccess" class="mb-4" message="Succesfully uploaded instagram vid" />
    <AlertError v-if="uploadError" class="mb-4" message="Error, likely link is not valid" />

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
</template>
