# warhammer-draft
A list drafting tool for tabletop warhammer of varying flavors

{
    name: "Dark Elf Warriors",
    category: "core",
    image: "image-url",
    description: "optional",
    type: "model",
    count: 5
}

2 magic
2 rare
3 character
4 special
6 core

maps to

10 magic
10 rare
20 character
25 special
35 core

what to do with lord/hero mounts?

// Standard core/special/rare unit
{ "name": "", "category": "core", "type": "model", "pointsCost": 0, "count": 0, "image": "", "description": "" }

// Hero
{ "name": "", "category": "hero", "type": "model", "pointsCost": 0, "count": 1, "image": "", "description": "" }

// Lord
{ "name": "", "category": "lord", "type": "model", "pointsCost": 0, "count": 1, "image": "", "description": "" }

// Lord or hero on a monster (costs extra hero slot)
{ "name": "", "category": "lord", "type": "model", "pointsCost": 0, "count": 1, "image": "", "description": "", "slotsUsed": { "lord": 1, "hero": 1 } }

// Hero on a monster (costs 2 hero slots)
{ "name": "", "category": "hero", "type": "model", "pointsCost": 0, "count": 1, "image": "", "description": "", "slotsUsed": { "hero": 2 } }

// War machine that pairs into 1 rare slot
{ "name": "", "category": "rare", "type": "model", "pointsCost": 0, "count": 1, "image": "", "description": "", "maxPerSlot": 2 }

// Unique magic item (removed from pool once picked)
{ "name": "", "category": "magic", "type": "meta", "pointsCost": 0, "image": "", "description": "" }

// Repeatable magic item (stays in pool)
{ "name": "", "category": "magic", "type": "meta", "pointsCost": 0, "image": "", "description": "", "repeatable": true }

{ "name": "Dreadlord", "category": "lord", "type": "model", "pointsCost": 140, "count": 1, "image": "", "description": "", "mounts": [
  { "name": "Dreadlord on Foot", "pointsCost": 140 },
  { "name": "Dreadlord on Cold One", "pointsCost": 170 },
  { "name": "Dreadlord on Dark Steed", "pointsCost": 158 }
] },