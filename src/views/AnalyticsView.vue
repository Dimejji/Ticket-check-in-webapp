<script setup>
import { computed } from 'vue'
import { useEventStore, formatDuration } from '../stores/useEventStore'
import PageHeader from '../components/PageHeader.vue'
import InfoRow from '../components/InfoRow.vue'

const { entryByHour, avgDuration, peakPresent, stats, reEntries, totalScans } = useEventStore()
const labels = { 17: '5 PM', 18: '6 PM', 19: '7 PM', 20: '8 PM', 21: '9 PM', 22: '10 PM', 23: '11 PM' }
const max = computed(() => Math.max(...Object.values(entryByHour), 1))
</script>


<template>
  <div class="mt-25 ml-65 mx-auto w-full max-w-5xl px-3">
    <PageHeader
      title="Analytics"
      subtitle="Entry/exit patterns and attendance duration"
    />

    <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <!-- Attendance by Hour -->
      <v-card class="pa-3" variant="flat">
        <div class="mb-3 text-xs font-semibold">
          Attendance by Hour (Entries)
        </div>

        <div class="flex flex-col gap-1.5">
          <div
            v-for="(label, h) in labels"
            :key="h"
            class="flex items-center gap-2 text-[10px]"
          >
            <span class="w-10 shrink-0 text-right text-eg-muted">
              {{ label }}
            </span>

            <v-progress-linear
              :model-value="max ? (entryByHour[h] / max) * 100 : 0"
              height="8"
              rounded
              color="primary"
              bg-color="surface-variant"
              bg-opacity="1"
              class="flex-1"
            />

            <span class="w-6 text-right text-eg-muted">
              {{ entryByHour[h] }}
            </span>
          </div>
        </div>
      </v-card>

      <!-- Key Metrics -->
      <v-card class="pa-3" variant="flat">
        <div class="mb-2 text-xs font-semibold">
          Key Metrics
        </div>

        <div class="flex flex-col gap-1">
          <InfoRow
            label="Average Time Inside"
            :value="avgDuration ? formatDuration(avgDuration) : '—'"
          />
          <InfoRow label="Peak Attendance" :value="peakPresent" />
          <InfoRow label="No-Shows" :value="stats.noShows" />
          <InfoRow label="Re-entries" :value="reEntries" />
          <InfoRow label="Total Scans" :value="totalScans" />
        </div>
      </v-card>
    </div>
  </div>
</template>
