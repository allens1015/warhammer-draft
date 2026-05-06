<script setup>
import { computed } from 'vue'

const props = defineProps({
  armyList: Array,
  pointsTotal: Number,
  pointsCap: Number,
  pointsThreshold: Number,
  overThreshold: Boolean,
})

const CATEGORY_ORDER = ['lord', 'hero', 'core', 'special', 'rare', 'magic']
const CATEGORY_LABELS = {
  lord: 'Lords',
  hero: 'Heroes',
  core: 'Core',
  special: 'Special',
  rare: 'Rare',
  magic: 'Magic Items',
}

const MAGIC_TYPE_ORDER = ['magic_weapon', 'magic_armour', 'talisman', 'arcane_item', 'enchanted_item', 'magic_standard', 'gifts_of_khaine']
const MAGIC_TYPE_LABELS = {
  magic_weapon: 'Magic Weapons',
  magic_armour: 'Magic Armour',
  talisman: 'Talismans',
  arcane_item: 'Arcane Items',
  enchanted_item: 'Enchanted Items',
  magic_standard: 'Magic Standards',
  gifts_of_khaine: 'Gifts of Khaine',
}

const sections = computed(() =>
  CATEGORY_ORDER
    .map(cat => {
      const units = props.armyList.filter(u => u.category === cat)
      const subsections = cat === 'magic'
        ? MAGIC_TYPE_ORDER
            .map(type => ({
              label: MAGIC_TYPE_LABELS[type],
              units: units.filter(u => u.type === type),
            }))
            .filter(s => s.units.length > 0)
        : null
      return { label: CATEGORY_LABELS[cat], units, subsections }
    })
    .filter(s => s.units.length > 0)
)
</script>

<template>
  <div class="army-list">
    <div v-if="overThreshold" class="threshold-warning">
      Approaching points limit!
    </div>
    <div class="points-total">{{ pointsTotal }} / {{ pointsCap }} pts</div>
    <div v-for="section in sections" :key="section.label" class="army-section">
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