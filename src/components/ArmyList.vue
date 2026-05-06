<script setup>
defineProps({
  armyList: Array,
  pointsTotal: Number,
  pointsCap: Number,
  pointsThreshold: Number,
  overThreshold: Boolean,
})
</script>

<template>
  <div class="army-list">
    <div v-if="overThreshold" class="threshold-warning">
      Approaching points limit!
    </div>
    <div class="points-total">{{ pointsTotal }} / {{ pointsCap }} pts</div>
    <ul>
      <li v-for="(unit, i) in armyList" :key="i">
        {{ unit.name }} — {{ unit.pointsCost }} pts
      </li>
    </ul>
  </div>
</template>