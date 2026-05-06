<script setup>
defineProps({
  pointsCap: Number,
  composition: Object,
  slots: Object,
})

const emit = defineEmits(['update:pointsCap', 'reset'])
</script>

<template>
  <div class="settings-panel">
    <label>
      Points Cap
      <input
        type="number"
        :value="pointsCap"
        min="500"
        max="4000"
        step="500"
        @change="emit('update:pointsCap', Number($event.target.value))"
      />
    </label>
    <div class="composition-info">
      <span>Lords: {{ slots.lord }} / {{ composition.maxLords }}</span>
      <span>Characters: {{ slots.character }} / {{ composition.maxCharacters }}</span>
      <span>Special: {{ slots.special }} / {{ composition.maxSpecial }}</span>
      <span>Rare: {{ slots.rare }} / {{ composition.maxRare }}</span>
    </div>
    <button @click="emit('reset')">Reset Draft</button>
  </div>
</template>