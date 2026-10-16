<script setup>
import { ref, computed } from 'vue'
import { useEventStore, formatTime, formatDuration, getDuration } from '../stores/useEventStore'
import PageHeader from '../components/PageHeader.vue'

const store = useEventStore()
const search = ref('')
const status = ref('all')

const statusItems = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Present', value: 'PRESENT' },
  { title: 'Exited', value: 'EXITED' },
  { title: 'Not Arrived', value: 'NOT_ARRIVED' },
  { title: 'Removed', value: 'REMOVED' },
  { title: 'Flagged', value: 'FLAGGED' },
]
const statusColor = {
  PRESENT: 'success', EXITED: 'info', NOT_ARRIVED: 'grey', REMOVED: 'error', FLAGGED: 'warning',
}

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Ticket', key: 'id' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'attendance' },
  { title: 'Entry', key: 'entry', sortable: false },
  { title: 'Duration', key: 'duration', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const rows = computed(() => {
  const q = search.value.toLowerCase()
  return store.validList.value
    .filter((t) => t.name)
    .filter((t) => status.value === 'all' || t.attendance === status.value)
    .filter((t) => !q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || (t.email || '').toLowerCase().includes(q))
    .map((t) => ({
      ...t,
      entry: formatTime(t.checkInTime),
      duration: formatDuration(getDuration(t)),
    }))
})
</script>

<template>
  <div class="mt-25 ml-65 mb-20 mx-auto w-full max-w-5xl px-3">
    <PageHeader
      title="Attendees"
      subtitle="Search and manage all ticket holders"
    />

    <v-card class="pa-3" variant="flat">
      <!-- Search and Filter -->
      <div class="mb-3 flex flex-col gap-2 sm:flex-row">
        <v-text-field
          v-model="search"
          placeholder="Search name, ticket ID, email..."
          prepend-inner-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          bg-color="background"
          class="w-full sm:max-w-xs"
        />

        <v-select
          v-model="status"
          :items="statusItems"
          density="compact"
          hide-details
          bg-color="background"
          class="w-full sm:max-w-44"
        />
      </div>

      <!-- Attendees Table -->
      <v-data-table
        :headers="headers"
        :items="rows"
        item-value="id"
        no-data-text="No attendees found"
        density="compact"
        class="!bg-transparent text-sm"
      >
        <template #item.name="{ item }">
          <strong>{{ item.name }}</strong>
        </template>

        <template #item.attendance="{ item }">
          <v-chip
            :color="statusColor[item.attendance] || 'grey'"
            size="x-small"
            variant="tonal"
            class="font-semibold"
          >
            {{ item.attendance.replace('_', ' ') }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="flex flex-wrap gap-1">
            <template
              v-if="['PRESENT', 'FLAGGED'].includes(item.attendance)"
            >
              <v-btn
                size="x-small"
                variant="outlined"
                @click="store.checkOut(item.id)"
              >
                Out
              </v-btn>

              <v-btn
                size="x-small"
                color="error"
                variant="flat"
                @click="store.openRemoveDialog(item.id)"
              >
                Remove
              </v-btn>
            </template>

            <v-btn
              v-else-if="item.attendance === 'NOT_ARRIVED'"
              size="x-small"
              color="success"
              variant="flat"
              @click="store.checkIn(item.id)"
            >
              Check In
            </v-btn>

            <v-btn
              v-else-if="item.attendance === 'EXITED'"
              size="x-small"
              color="success"
              variant="flat"
              @click="store.reEnter(item.id)"
            >
              Re-enter
            </v-btn>

            <span v-else>—</span>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
