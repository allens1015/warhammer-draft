import { computed } from 'vue'
import { CATEGORY_ORDER, CATEGORY_LABELS, MAGIC_TYPE_ORDER, MAGIC_TYPE_LABELS } from './draftConfig.js'

export function useArmyList(armyList, pointsCap, pointsTotal) {
  const groupedArmyList = computed(() => {
    const groups = new Map()
    for (const unit of armyList.value) {
      if (groups.has(unit.name)) {
        const g = groups.get(unit.name)
        g.pointsCost += unit.pointsCost
        g.totalCount += unit.count ?? 1
        g.qty++
      } else {
        groups.set(unit.name, { ...unit, totalCount: unit.count ?? 1, qty: 1 })
      }
    }
    return Array.from(groups.values()).map(g => ({
      ...g,
      displayName: g.count > 1
        ? `${g.name} (${g.totalCount})`
        : g.qty > 1
          ? `${g.name} (${g.qty})`
          : g.name,
    }))
  })

  const listJson = computed(() => ({
    pointsCap: pointsCap.value,
    pointsTotal: pointsTotal.value,
    sections: CATEGORY_ORDER
      .map(cat => {
        const units = groupedArmyList.value
          .filter(u => u.category === cat)
          .map(({ displayName, name, category, type, pointsCost, qty, totalCount, description }) =>
            ({ displayName, name, category, type, pointsCost, qty, totalCount, description })
          )
        if (!units.length) return null
        const subsections = cat === 'magic'
          ? MAGIC_TYPE_ORDER
              .map(t => ({ label: MAGIC_TYPE_LABELS[t], units: units.filter(u => u.type === t) }))
              .filter(s => s.units.length > 0)
          : null
        return { label: CATEGORY_LABELS[cat], units: subsections ? [] : units, subsections }
      })
      .filter(Boolean),
  }))

  return { groupedArmyList, listJson }
}