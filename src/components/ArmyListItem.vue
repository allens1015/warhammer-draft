<script setup>
import { Info, X } from 'lucide-vue-next'
defineProps({ unit: Object })
const emit = defineEmits(['remove'])
</script>

<template>
  <li class="group flex items-center gap-2 pl-4 border-l-2 border-border text-neutral-700">
    <span class="relative group/tooltip flex items-center gap-1.5">
      {{ unit.displayName }} — {{ unit.pointsCost }} pts
      <Info v-if="unit.description" class="w-3 h-3 text-muted-foreground shrink-0" />
      <span
        v-if="unit.description"
        class="absolute left-0 top-6 w-64 p-3 bg-neutral-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-10 shadow-lg"
        v-html="unit.description"
      />
    </span>
    <button
      class="p-1 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 rounded transition-all shrink-0"
      @click="emit('remove', unit.name)"
    >
      <X class="w-3 h-3" />
    </button>
  </li>
</template>