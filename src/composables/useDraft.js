import { ref, computed } from 'vue'
import darkElvesUnits from '../data/dark-elves.json'
import skavenUnits from '../data/skaven.json'
import settings from '../data/settings.json'
import { TIER_WEIGHTS } from './draftConfig.js'
import { useArmyList } from './useArmyList.js'

const ARMY_DATA = {
  'dark-elves': { label: 'Dark Elves', units: darkElvesUnits },
  'skaven': { label: 'Skaven', units: skavenUnits },
}

export const ARMIES = Object.entries(ARMY_DATA).map(([key, { label }]) => ({ key, label }))

export function useDraft() {
  const selectedArmy = ref('dark-elves')
  const activeUnits = computed(() => ARMY_DATA[selectedArmy.value].units)

  const pointsCap = ref(settings.pointsCapDefault)
  const armyList = ref([])
  const drawPool = ref([...activeUnits.value])
  const currentOptions = ref([])

  const composition = computed(() =>
    settings.compositions.find(c => pointsCap.value <= c.maxPoints) ??
    settings.compositions[settings.compositions.length - 1]
  )

  const pointsTotal = computed(() =>
    armyList.value.reduce((sum, u) => sum + u.pointsCost, 0)
  )

  const { groupedArmyList, listJson } = useArmyList(armyList, pointsCap, pointsTotal)

  const pointsThreshold = computed(() =>
    pointsCap.value - settings.pointsThresholdOffset
  )

  const overThreshold = computed(() => pointsTotal.value >= pointsThreshold.value)

  const slots = computed(() => {
    let lord = 0, hero = 0
    const rareCounts = {}

    for (const pick of armyList.value) {
      const su = pick.slotsUsed ?? { [pick.category]: 1 }
      lord += su.lord ?? 0
      hero += su.hero ?? 0
      if (pick.category === 'rare') {
        rareCounts[pick._baseName] = (rareCounts[pick._baseName] ?? 0) + 1
      }
    }

    let rare = 0
    for (const [baseName, count] of Object.entries(rareCounts)) {
      const unit = activeUnits.value.find(u => u.name === baseName)
      rare += Math.ceil(count / (unit?.maxPerSlot ?? 1))
    }

    return { lord, character: lord + hero, rare }
  })

  function resolveUnit(unit) {
    const resolved = { ...unit, _baseName: unit.name }

    if (unit.mounts?.length) {
      // mounts[0] gets 2 shares, all others get 1
      const pool = unit.mounts.flatMap((m, i) => i === 0 ? [m, m] : [m])
      const selected = pool[Math.floor(Math.random() * pool.length)]
      resolved.name = selected.name
      resolved.pointsCost = selected.pointsCost
      if (selected.slotsUsed) resolved.slotsUsed = selected.slotsUsed
    }

    if (unit.choices?.length) {
      const selected = unit.choices[Math.floor(Math.random() * unit.choices.length)]
      resolved.name = selected.name
      resolved.pointsCost = selected.pointsCost
      if (selected.repeatable !== undefined) resolved.repeatable = selected.repeatable
    }

    return resolved
  }

  function eligibleUnitsInTier(tier) {
    const comp = composition.value
    const s = slots.value

    return drawPool.value.filter(unit => {
      if (tier === 'character') {
        if (unit.category !== 'hero' && unit.category !== 'lord') return false
        if (unit.category === 'lord' && s.lord >= comp.maxLords) return false
      } else {
        if (unit.category !== tier) return false
      }

      // Exclude if slotsUsed would push composition over cap
      const su = unit.slotsUsed ?? { [unit.category]: 1 }
      const addedLord = su.lord ?? 0
      const addedHero = su.hero ?? 0
      if (s.lord + addedLord > comp.maxLords) return false
      if (s.character + addedLord + addedHero > comp.maxCharacters) return false

      return true
    })
  }

  function getEligibleTiers() {
    const comp = composition.value
    const s = slots.value
    const tiers = []

    if (eligibleUnitsInTier('core').length > 0) tiers.push('core')
    if (eligibleUnitsInTier('special').length > 0) tiers.push('special')
    if (s.rare < comp.maxRare && eligibleUnitsInTier('rare').length > 0) tiers.push('rare')
    if (s.character < comp.maxCharacters && eligibleUnitsInTier('character').length > 0) tiers.push('character')
    if (eligibleUnitsInTier('magic').length > 0) tiers.push('magic')

    return tiers
  }

  function weightedTierPick(eligibleTiers) {
    const total = eligibleTiers.reduce((sum, t) => sum + TIER_WEIGHTS[t], 0)
    let rand = Math.random() * total
    for (const tier of eligibleTiers) {
      rand -= TIER_WEIGHTS[tier]
      if (rand <= 0) return tier
    }
    return eligibleTiers[eligibleTiers.length - 1]
  }

  function pickFromTier(tier, usedBaseNames) {
    const pool = eligibleUnitsInTier(tier).filter(u => !usedBaseNames.has(u.name))
    if (!pool.length) return null
    return resolveUnit(pool[Math.floor(Math.random() * pool.length)])
  }

  function tiersWithAvailable(eligibleTiers, usedBaseNames) {
    return eligibleTiers.filter(t =>
      eligibleUnitsInTier(t).some(u => !usedBaseNames.has(u.name))
    )
  }

  function draw() {
    const options = []
    const used = new Set()
    const eligibleTiers = getEligibleTiers()

    function addOption(unit) {
      if (!unit) return
      options.push(unit)
      used.add(unit._baseName)
    }

    // Slots 1-3: unrestricted weighted random
    for (let i = 0; i < 3; i++) {
      const available = tiersWithAvailable(eligibleTiers, used)
      if (!available.length) break
      addOption(pickFromTier(weightedTierPick(available), used))
    }

    // Slot 4: magic, fallback to weighted random
    {
      const magicPool = eligibleUnitsInTier('magic').filter(u => !used.has(u.name))

      if (magicPool.length) {
        addOption(resolveUnit(magicPool[Math.floor(Math.random() * magicPool.length)]))
      } else {
        const available = tiersWithAvailable(eligibleTiers, used)
        if (available.length) addOption(pickFromTier(weightedTierPick(available), used))
      }
    }

    currentOptions.value = options
  }

  function pick(option) {
    armyList.value.push(option)

    const isNonRepeatable =
      option.repeatable === false ||
      (option.category === 'magic' && option.repeatable !== true)

    if (isNonRepeatable) {
      drawPool.value = drawPool.value.filter(u => u.name !== option._baseName)
    }

    draw()
  }

  function remove(unitName) {
    const idx = armyList.value.map(u => u.name).lastIndexOf(unitName)
    if (idx === -1) return

    const removed = armyList.value[idx]
    armyList.value.splice(idx, 1)

    const isNonRepeatable =
      removed.repeatable === false ||
      (removed.category === 'magic' && removed.repeatable !== true)

    if (isNonRepeatable) {
      const stillInList = armyList.value.some(u => u._baseName === removed._baseName)
      if (!stillInList) {
        const original = activeUnits.value.find(u => u.name === removed._baseName)
        if (original && !drawPool.value.some(u => u.name === removed._baseName)) {
          drawPool.value.push(original)
        }
      }
    }

    draw()
  }

  function switchArmy(key) {
    selectedArmy.value = key
    armyList.value = []
    drawPool.value = [...activeUnits.value]
    draw()
  }

  function reset() {
    armyList.value = []
    drawPool.value = [...activeUnits.value]
    draw()
  }

  draw()

  return {
    selectedArmy,
    pointsCap,
    armyList,
    groupedArmyList,
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
  }
}
