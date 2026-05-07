<script setup>
defineProps({
  option: Object,
})

const emit = defineEmits(['pick'])
</script>

<template>
  <button
    class="group relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-neutral-200 text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
    @click="emit('pick', option)"
  >
    <div
      v-if="option.image"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${option.image})` }"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
      <div class="text-xs uppercase tracking-wide opacity-70 mb-1">{{ option.category }}</div>
      <div class="font-medium leading-tight">{{ option.count > 1 ? `${option.name} (${option.count})` : option.name }}</div>
      <div class="text-sm opacity-80 mt-0.5">{{ option.pointsCost }} pts</div>
    </div>
  </button>
</template>