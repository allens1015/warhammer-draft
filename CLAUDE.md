# Warhammer Draft — Project Context

Army drafting tool for Warhammer Fantasy 7th edition. User sets a points target (500–4000), then repeatedly selects 1 of 4 presented options. Picks accumulate into a running army list.

**Tech stack:** Vue 3 Composition API + Vite + Tailwind CSS v4 (`@tailwindcss/vite`, no postcss config). `lucide-vue-next` for icons. No backend — all data from local JSON files.

**Design:** Tailwind design tokens exported from Figma, applied as CSS custom properties in `src/style.css`. Figma exports live in `design/` (gitignored). Category background images in `src/assets/`.

**Keep it simple.** No overengineering. Tune for fun and usability over strict rules enforcement.

---

## File Layout

| File | Role |
|---|---|
| `src/composables/draftConfig.js` | Static config: `TIER_WEIGHTS`, `CATEGORY_ORDER`, `CATEGORY_LABELS`, `MAGIC_TYPE_ORDER`, `MAGIC_TYPE_LABELS` |
| `src/composables/useDraft.js` | Army selection, draw pool, draw algorithm, orchestration. Imports `useArmyList`. |
| `src/composables/useArmyList.js` | `groupedArmyList` and `listJson` computeds. Accepts `armyList`, `pointsCap`, `pointsTotal` as args. |
| `src/App.vue` | Root shell. Calls `useDraft()`, passes state down to components. |
| `src/components/DrawPanel.vue` | `grid-cols-2 md:grid-cols-4` wrapper for `DrawOption` cards. |
| `src/components/DrawOption.vue` | Pickable card: category background image, gradient overlay, hover tooltip. |
| `src/components/SettingsPanel.vue` | Army dropdown, points cap input, composition slot display, Reset button. |
| `src/components/ArmyList.vue` | Renders `listJson` — sections by category, magic subsections by type. Copy JSON button. |
| `src/components/ArmyListItem.vue` | Single army list row: displayName, points, hover tooltip, remove button. |
| `src/data/dark-elves.json` | Unit data — Dark Elves. |
| `src/data/skaven.json` | Unit data — Skaven. |
| `src/data/settings.json` | Composition brackets and default points settings. |

---

## useDraft.js — What It Owns

**Army data** — `ARMY_DATA` map (key → `{ label, units }`). `ARMIES` exported for the dropdown. `selectedArmy` ref, `activeUnits` computed, `switchArmy(key)` resets all state and redraws.

**Draw pool** — `drawPool` ref starts as full copy of `activeUnits`. Non-repeatable picks removed on `pick()`, restored on `remove()` if no instances remain in `armyList`.

**Draw algorithm** — See draw logic section below.

**Returned values:** `selectedArmy`, `pointsCap`, `armyList`, `groupedArmyList`, `listJson`, `currentOptions`, `pointsTotal`, `pointsThreshold`, `overThreshold`, `slots`, `composition`, `pick`, `remove`, `reset`, `switchArmy`.

---

## Unit Data Fields

| Field | Type | Notes |
|---|---|---|
| `name` | string | Base display name, no count suffix |
| `category` | string | `core`, `special`, `rare`, `hero`, `lord`, `magic` |
| `type` | string | `model` for non-magic. Magic subtypes: `magic_weapon`, `magic_armour`, `talisman`, `arcane_item`, `enchanted_item`, `magic_standard`, `gifts_of_khaine` |
| `pointsCost` | number | Cost as drafted |
| `count` | number | Model count per entry. Used in display name when stacked: `"Clanrats (20)"` |
| `description` | string | Flavor/rules text. Rendered as HTML (`v-html`) in tooltips — use `<br>` for line breaks |
| `slotsUsed` | object | Optional. Overrides default slot consumption e.g. `{ "lord": 1, "hero": 1 }` |
| `maxPerSlot` | number | Optional. How many of this unit share 1 rare slot (default: 1) |
| `repeatable` | boolean | Optional. `false` = removed from pool after pick. Magic items are non-repeatable by default |
| `mounts` | array | Lords/heroes only. `[{ name, pointsCost, slotsUsed? }]`. Index 0 = on-foot (2 shares), rest = 1 share |
| `choices` | array | Any unit. `[{ name, pointsCost, repeatable? }]`. Equal probability. Used for named character variants |

---

## Draw Logic

**Tier weights:** Core 35 / Special 25 / Character 20 / Rare 10 / Magic 10. Renormalize when tiers are excluded.

**Per draw (4 unique options):**
1. Build eligible tiers
2. Slots 1–3: unrestricted weighted-random pick across all eligible tiers
3. Slot 4: magic only; falls back to weighted random if magic pool is empty
4. All 4 options must be unique base units within one draw

**Eligibility:**
- Core / Special: always eligible
- Rare: excluded when `rareSlotsUsed >= maxRare`
- Character: excluded when `characterSlotsUsed >= maxCharacters`; lords sub-excluded when `lordSlotsUsed >= maxLords`
- Magic: excluded when pool is empty

**Non-repeatable:** `isNonRepeatable = repeatable === false || (category === 'magic' && repeatable !== true)`

---

## Composition Tracking

`slots` computed returns `{ lord, character, rare }`. Special is display-only (never enforced).

- `lord` = sum of `slotsUsed.lord` across all picks
- `character` = sum of `slotsUsed.lord + slotsUsed.hero` across all picks
- `rare` = `Math.ceil(count / maxPerSlot)` per unique base unit, summed

**Brackets** (from `settings.json`):

| Max Points | Max Special | Max Rare | Max Characters | Max Lords |
|---|---|---|---|---|
| 1999 | 3 | 1 | 3 | 0 |
| 2999 | 4 | 2 | 4 | 1 |
| 3999 | 5 | 3 | 6 | 2 |
| 4999 | 6 | 4 | 8 | 3 |

---

## listJson Structure

```json
{
  "pointsCap": 2000,
  "pointsTotal": 450,
  "sections": [
    { "label": "Core", "units": [{ "displayName": "Clanrats (20)", "name": "Clanrats", "category": "core", "type": "model", "pointsCost": 120, "qty": 2, "totalCount": 20, "description": "" }], "subsections": null },
    { "label": "Magic Items", "units": [], "subsections": [
      { "label": "Magic Weapons", "units": [...] }
    ]}
  ]
}
```

Category order: Lords → Heroes → Core → Special → Rare → Magic Items.
Magic subsection order: Magic Weapons → Magic Armour → Talismans → Arcane Items → Enchanted Items → Magic Standards → Gifts of Khaine.

---

## Future: Save / Load

`listJson` is the intended save format — already serializable. Planned: Supabase (Google OAuth + Postgres) for account-based list persistence. Start with `npx supabase init` + magic-link auth before layering in Google OAuth. Google OAuth on localhost requires a registered redirect URI in Google Cloud Console.