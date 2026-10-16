<script setup>
import { useEventStore, formatTime } from '../stores/useEventStore'
import PageHeader from '../components/PageHeader.vue'

const { incidents } = useEventStore()
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Attendee', key: 'attendee' },
  { title: 'Category', key: 'category' },
  { title: 'Severity', key: 'severity' },
  { title: 'Reported By', key: 'reportedBy' },
  { title: 'Time', key: 'time' },
  { title: 'Status', key: 'status' },
]
const severityColor = (s) => (s === 'High' || s === 'Critical' ? 'error' : 'warning')
</script>


<template>
  <div class="mt-30 ml-65 mx-auto w-full max-w-5xl px-3">
    <PageHeader
      title="Incidents"
      subtitle="Security flags, removals & reported issues"
    />

    <v-card class="pa-3" variant="flat">
      <v-data-table
        :headers="headers"
        :items="incidents"
        item-value="id"
        density="compact"
        class="!bg-transparent text-sm"
      >
        <template #item.severity="{ item }">
          <v-chip
            :color="severityColor(item.severity)"
            size="x-small"
            variant="tonal"
            class="font-semibold"
          >
            {{ item.severity }}
          </v-chip>
        </template>

        <template #item.time="{ item }">
          {{ formatTime(item.time) }}
        </template>

        <template #item.status="{ item }">
          <v-chip
            color="warning"
            size="x-small"
            variant="tonal"
            class="font-semibold"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template #no-data>
          <p class="p-4 text-center text-xs text-eg-muted">
            No incidents reported yet.
          </p>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
