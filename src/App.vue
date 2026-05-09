<script setup>
import { useDraft } from './composables/useDraft.js'
import DrawPanel from './components/DrawPanel.vue'
import ArmyList from './components/ArmyList.vue'
import SettingsPanel from './components/SettingsPanel.vue'

const {
  selectedArmy,
  pointsCap,
  armyList,
  listJson,
  currentOptions,
  pointsTotal,
  pointsThreshold,
  overThreshold,
  slots,
  composition,
  pick,
  remove,
  reset,
  switchArmy,
} = useDraft()
</script>

<template>
  <div class="min-h-screen bg-neutral-50 p-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <DrawPanel
        :options="currentOptions"
        @pick="pick"
      />
      <SettingsPanel
        v-model:pointsCap="pointsCap"
        :selected-army="selectedArmy"
        :composition="composition"
        :slots="slots"
        @reset="reset"
        @army-change="switchArmy"
      />
      <ArmyList
        :list="listJson"
        :over-threshold="overThreshold"
        @remove="remove"
      />
    </div>
  </div>
</template>