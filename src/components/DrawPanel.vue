<script setup>
import DrawOption from './DrawOption.vue'

defineProps({
  options: Array,
})

const emit = defineEmits(['pick'])
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <DrawOption
      v-for="option in options"
      :key="option._baseName + option.name"
      :option="option"
      @pick="emit('pick', $event)"
    />
  </div>
</template>