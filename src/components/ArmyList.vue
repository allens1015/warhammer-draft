<script setup>
import { ref } from 'vue'
import { X, Info } from 'lucide-vue-next'

const props = defineProps({
  list: Object,
  overThreshold: Boolean,
})

const emit = defineEmits(['remove'])

const copied = ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(JSON.stringify(props.list, null, 2))
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl text-neutral-900">Army List</h2>
        <div class="text-sm text-muted-foreground mt-1">
          <span :class="overThreshold ? 'text-destructive font-medium' : ''">
            {{ list.pointsTotal }}
          </span>
          / {{ list.pointsCap }} pts
        </div>
      </div>
      <button
        v-if="list.sections.length"
        class="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
        @click="copyToClipboard"
      >
        {{ copied ? 'Copied!' : 'Copy JSON' }}
      </button>
    </div>

    <p v-if="!list.sections.length" class="text-sm text-muted-foreground">
      No units chosen yet. Pick an option above to begin.
    </p>

    <div v-for="section in list.sections" :key="section.label" class="space-y-2">
      <h3 class="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {{ section.label }}
      </h3>

      <template v-if="section.subsections">
        <div v-for="sub in section.subsections" :key="sub.label" class="space-y-1 mb-3">
          <h4 class="text-xs uppercase tracking-wide text-muted-foreground/70 pl-4">
            {{ sub.label }}
          </h4>
          <ul class="space-y-1">
            <li
              v-for="(unit, i) in sub.units"
              :key="i"
              class="group flex items-center gap-2 pl-4 border-l-2 border-border text-neutral-700"
            >
              <span class="relative group/tooltip flex items-center gap-1.5">
                {{ unit.displayName }} — {{ unit.pointsCost }} pts
                <Info v-if="unit.description" class="w-3 h-3 text-muted-foreground shrink-0" />
                <span
                  v-if="unit.description"
                  class="absolute left-0 top-6 w-64 p-3 bg-neutral-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-10 shadow-lg"
                >
                  {{ unit.description }}
                </span>
              </span>
              <button
                class="p-1 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 rounded transition-all shrink-0"
                @click="emit('remove', unit.name)"
              >
                <X class="w-3 h-3" />
              </button>
            </li>
          </ul>
        </div>
      </template>

      <ul v-else class="space-y-1">
        <li
          v-for="(unit, i) in section.units"
          :key="i"
          class="group flex items-center gap-2 pl-4 border-l-2 border-border text-neutral-700"
        >
          <span class="relative group/tooltip flex items-center gap-1.5">
            {{ unit.displayName }} — {{ unit.pointsCost }} pts
            <Info v-if="unit.description" class="w-3 h-3 text-muted-foreground shrink-0" />
            <span
              v-if="unit.description"
              class="absolute left-0 top-6 w-64 p-3 bg-neutral-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-10 shadow-lg"
            >
              {{ unit.description }}
            </span>
          </span>
          <button
            class="p-1 opacity-0 group-hover:opacity-100 hover:bg-neutral-200 rounded transition-all shrink-0"
            @click="emit('remove', unit.name)"
          >
            <X class="w-3 h-3" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>