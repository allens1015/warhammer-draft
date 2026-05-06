<script setup>
defineProps({
  option: Object,
})

const emit = defineEmits(['pick'])
</script>

<template>
  <button class="draw-option" @click="emit('pick', option)">
    <div class="option-name">{{ option.count > 1 ? `${option.name} (${option.count})` : option.name }}</div>
    <div class="option-cost">{{ option.pointsCost }} pts</div>
    <div class="option-category">{{ option.category }}</div>
  </button>
</template>