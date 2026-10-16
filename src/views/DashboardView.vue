
<script setup>
import { computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import InfoRow from '../components/InfoRow.vue'


import {
  useEventStore,
  EVENT,
  TOTAL_TICKETS,
  VENUE_CAPACITY,
} from '../stores/useEventStore'

const { stats, activityLog } = useEventStore()
const n = (v) => v.toLocaleString()

const cards = computed(() => [
  ['Total Tickets', n(TOTAL_TICKETS), 'primary'],
  ['Checked In', n(stats.value.checkedIn), 'success'],
  ['Present', n(stats.value.present), 'info'],
  ['Exited', n(stats.value.exited)],
  ['Flagged', n(stats.value.flagged), 'warning'],
  ['Removed', n(stats.value.removed), 'error'],
])

const rows = computed(() => [
  ['Check-in Opens', '5:00 PM'],
  ['Event Starts', '7:00 PM'],
  ['Event Ends', '12:00 AM'],
  ['Check-in Closes', '10:30 PM'],
  ['Grace Period', '30 min'],
  ['Venue Capacity', n(VENUE_CAPACITY)],
  ['Remaining Capacity', n(stats.value.remaining)],
  ['Check-in Rate', `${stats.value.rate}%`],
])
</script>

<template>
  <div class="!bg-[#f5f6fa] p-4 sm:p-6 w-90px overflow-x-hidden ml-60 mt-17">
      <PageHeader
        title="Live Dashboard"
        :subtitle="`${EVENT.name} · ${EVENT.date}`"
      />

      <!-- Compact stats row -->
      <div class="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          v-for="[label, value, color] in cards"
          :key="label"
          :label="label"
          :value="value"
          :color="color"
        />
      </div>

      <!-- Two compact cards -->
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <v-card class="pa-3" variant="flat" density="compact">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold">Live Activity</span>
            <span class="text-xs text-eg-muted">Real-time</span>
          </div>

          <div
            class="flex max-h-56 flex-col gap-1.5 overflow-y-auto sm:max-h-72"
          >
            <p
              v-if="!activityLog.length"
              class="p-3 text-center text-xs text-eg-muted"
            >
              No activity yet. Scan a ticket to begin.
            </p>

            <div
              v-for="a in activityLog"
              :key="a.id"
              class="animate-eg-fade flex items-center gap-2 rounded-md bg-eg-surface-2 px-2 py-1.5 text-xs"
            >
              <span class="w-12 shrink-0 text-eg-muted">{{ a.time }}</span>
              <span class="min-w-0 flex-1 truncate">{{ a.text }}</span>
              <v-chip
                :color="a.color"
                size="x-small"
                label
                variant="tonal"
                class="shrink-0 font-semibold uppercase"
              >
                {{ a.badge }}
              </v-chip>
            </div>
          </div>
        </v-card>

        <v-card class="pa-3" variant="flat" density="compact">
          <div class="mb-2 text-sm font-semibold">Event Status</div>
          <InfoRow
            v-for="[label, value] in rows"
            :key="label"
            :label="label"
            :value="value"
          />
        </v-card>
      </div>
    </div>
</template>
