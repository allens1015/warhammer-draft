<script setup>
import { ref } from 'vue'

const props = defineProps({
  list: Object,
  overThreshold: Boolean,
})

const copied = ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(JSON.stringify(props.list, null, 2))
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="army-list">
    <div v-if="overThreshold" class="threshold-warning">
      Approaching points limit!
    </div>
    <div class="points-total">{{ list.pointsTotal }} / {{ list.pointsCap }} pts</div>
    <button @click="copyToClipboard">{{ copied ? 'Copied!' : 'Copy List JSON' }}</button>
    <div v-for="section in list.sections" :key="section.label" class="army-section">
      <h3 class="section-header">{{ section.label }}</h3>
      <template v-if="section.subsections">
        <div v-for="sub in section.subsections" :key="sub.label" class="army-subsection">
          <h4 class="subsection-header">{{ sub.label }}</h4>
          <ul>
            <li v-for="(unit, i) in sub.units" :key="i">
              {{ unit.displayName }} — {{ unit.pointsCost }} pts
            </li>
          </ul>
        </div>
      </template>
      <ul v-else>
        <li v-for="(unit, i) in section.units" :key="i">
          {{ unit.displayName }} — {{ unit.pointsCost }} pts
        </li>
      </ul>
    </div>
  </div>
</template>