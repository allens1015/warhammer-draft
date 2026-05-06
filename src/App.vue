<script setup>
import { useDraft } from './composables/useDraft.js'
import DrawPanel from './components/DrawPanel.vue'
import ArmyList from './components/ArmyList.vue'
import SettingsPanel from './components/SettingsPanel.vue'

const {
  pointsCap,
  armyList,
  currentOptions,
  pointsTotal,
  pointsThreshold,
  overThreshold,
  slots,
  composition,
  pick,
  reset,
} = useDraft()
</script>

<template>
  <div class="app">
    <SettingsPanel
      v-model:pointsCap="pointsCap"
      :composition="composition"
      :slots="slots"
      @reset="reset"
    />
    <DrawPanel
      :options="currentOptions"
      @pick="pick"
    />
    <ArmyList
      :army-list="armyList"
      :points-total="pointsTotal"
      :points-cap="pointsCap"
      :points-threshold="pointsThreshold"
      :over-threshold="overThreshold"
    />
  </div>
</template>
