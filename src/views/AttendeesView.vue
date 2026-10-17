```vue
<script setup>
import { ref, computed,watch } from 'vue'
import { useEventStore, formatTime, formatDuration, getDuration } from '../stores/useEventStore'
import PageHeader from '../components/PageHeader.vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'


const store = useEventStore()
const search = ref('')
const status = ref('all')

const { mdAndUp } = useDisplay()
const route = useRoute()

const drawer = ref(false)

// Keep drawer open on desktop, closed on mobile
watch(
  mdAndUp,
  (isDesktop) => {
    drawer.value = isDesktop
  },
  { immediate: true }
)

// Close drawer on route change (mobile only)
watch(
  () => route.path,
  () => {
    if (!mdAndUp.value) drawer.value = false
  }
)

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

// const rows = computed(() => [
//   ['Check-in Opens', '5:00 PM'],
//   ['Event Starts', '7:00 PM'],
//   ['Event Ends', '12:00 AM'],
//   ['Check-in Closes', '10:30 PM'],
//   ['Grace Period', '30 min'],
//   ['Venue Capacity', n(VENUE_CAPACITY)],
//   ['Remaining Capacity', n(stats.value.remaining)],
//   ['Check-in Rate', `${stats.value.rate}%`],
// ])


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
  <v-layout class="min-h-screen bg-[#f5f6fa]">
    <!-- App Bar -->
    <v-app-bar
      class="!bg-[#1b2333] !text-white"
      elevation="0"
      density="comfortable"
      flat
    >
      <v-app-bar-nav-icon
        v-if="!mdAndUp"
        class="!text-white"
        @click="drawer = !drawer"
      />

      <v-app-bar-title class="!text-sm !font-semibold tracking-tight sm:!text-base">
        Events Attendance
      </v-app-bar-title>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      :scrim="!mdAndUp"
      width="155"
      class="!bg-[#1b2333] !text-white"
    >
      <v-list
        nav
        density="comfortable"
        class="!bg-transparent pa-2 sm:pa-3"
      >
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard-outline"
          to="/dashboard"
          rounded="lg"
          class="mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Scanner"
          prepend-icon="mdi-qrcode-scan"
          to="/scannerview"
          rounded="lg"
          class="mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Attendance"
          prepend-icon="mdi-account-check-outline"
          to="/attendeesview"
          rounded="lg"
          class="mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Incidents"
          prepend-icon="mdi-alert-circle-outline"
          to="/incidentsview"
          rounded="lg"
          class="mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Analytics"
          prepend-icon="mdi-chart-box-outline"
          to="/analyticsview"
          rounded="lg"
          class="mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        />

        <div class="px-4 pt-5 pb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Events
        </div>

        <v-list-item
          title="Settings"
          prepend-icon="mdi-cog-outline"
          to="/settingsview"
          rounded="lg"
          class="!text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="min-w-0 w-full">
      <div class="mx-auto mt-16 mb-10 w-full max-w-5xl px-3 sm:mt-20 sm:px-5 lg:px-6">
        <PageHeader
          title="Attendees"
          subtitle="Search and manage all ticket holders"
          class="ml-10"
        />

        <v-card class="min-w-0 pa-3 ml-10" variant="flat">
          <!-- Search and Filter -->
          <div class="mb-3 flex min-w-0 flex-col gap-2 sm:flex-row">
            <v-text-field
              v-model="search"
              placeholder="Search name, ticket ID, email..."
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              hide-details
              bg-color="background"
              class="w-full min-w-0 sm:max-w-xs"
            />

            <v-select
              v-model="status"
              :items="statusItems"
              density="compact"
              hide-details
              bg-color="background"
              class="w-full min-w-0 sm:max-w-44"
            />
          </div>

          <!-- Attendees Table -->
          <div class="w-full min-w-0 overflow-x-auto">
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
          </div>
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>