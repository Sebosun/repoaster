<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const isLoading = ref(false)
const props = defineProps<{
  targetChannels: string[]
}>()

const postMessage = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://localhost:3000/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message.value, channels: props.targetChannels })
    })
    if (response.ok) {
      message.value = ''
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section>
    <h1 class="text-4xl text-center">Post a message</h1>
    <form @submit.prevent="postMessage">
      <div class="my-4">
        <input
          v-model="message"
          type="text"
          class="input input-bordered w-full"
          placeholder="Your message"
        />
        <br />
        <button
          type="submit"
          class="btn btn-accent text-end mt-5 w-full"
          :class="[!message ? 'btn-error' : '']"
          :disabled="!message || isLoading"
        >
          Submit
          <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
        </button>
      </div>
    </form>
  </section>
</template>
