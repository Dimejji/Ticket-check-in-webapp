<script setup>
import { ref, computed, watch } from 'vue'
import { useEventStore } from '@/composables/useEventStore'

const store = useEventStore()
const reasons = [
  'Security concern', 'Disruptive behavior', 'Violation of event rules',
  'Unauthorized access', 'Health/safety concern', 'Other',
]
const reason = ref(reasons[0])
const notes = ref('')

const open = computed({
  get: () => !!store.removeTargetId.value,
  set: (v) => { if (!v) store.closeRemoveDialog() },
})
const name = computed(() => {
  const id = store.removeTargetId.value
  return store.tickets[id]?.name ?? id
})

watch(open, (v) => { if (v) { reason.value = reasons[0]; notes.value = '' } })
</script>

<template>
  <v-dialog v-model="open" max-width="420">
    <v-card class="p-2">
      <v-card-title class="!text-lg !font-bold">Remove Attendee?</v-card-title>
      <v-card-subtitle class="!opacity-100 text-eg-muted">{{ name }}</v-card-subtitle>
      <v-card-text>
        <div class="mb-1 text-xs text-eg-muted">Reason</div>
        <v-radio-group v-model="reason" hide-details density="compact">
          <v-radio v-for="r in reasons" :key="r" :label="r" :value="r" color="primary" />
        </v-radio-group>
        <div class="mb-1 mt-4 text-xs text-eg-muted">Additional notes</div>
        <v-textarea v-model="notes" placeholder="Optional details..." rows="3" auto-grow />
      </v-card-text>
      <v-card-actions class="!px-4 !pb-3">
        <v-spacer />
        <v-btn variant="outlined" @click="store.closeRemoveDialog()">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="store.confirmRemove(reason, notes)">Confirm Removal</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
