<template>
  <div class="h-full w-full">
    <div class="fixed right-0 bottom-0 m-5 z-100 flex font-sans select-none leading-1em items-center justify-center">
      <div
        class="flex shadow cursor-pointer"
        bg="teal-600 hover:teal-700 w-10 h-10 rounded-full"
        transition="all 0.4s ease"
        @click="toggle()"
      >
        <mdi-youtube-gaming class="text-white text-lg" />
      </div>
    </div>
    <div
      v-show="show"
      style="height: 50vh; width: 50vw; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 3000"
      transition="opacity ease"
      class="fixed bg-base-100"
      :class="{ 'opacity-0': !show, 'opacity-100': show }"
    >
      <form class="flex flex-col gap-4 h-full w-full items-center justify-center">
        <div class="p-10 card bg-base-200 form-control">
          <label class="label">
            <span class="label-text">Twitch Username</span>
          </label>
          <input type="text" class="input" placeholder="Search" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from "@vueuse/core"
import "virtual:windi.css"

const [show, toggle] = useToggle(false)
</script>
