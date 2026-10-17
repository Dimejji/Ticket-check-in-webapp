```vue
<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'


import {
  useEventStore,
  EVENT,
  formatTime,
  formatDuration,
  getDuration,
} from "../stores/useEventStore";

const store = useEventStore();
const { scanning, scanResult: r } = store;
const input = ref("");

const samples = [
  ["EVT-829301", "EVT-829301"],
  ["EVT-829122", "EVT-829122"],
  ["EVT-830001", "EVT-830001"],
  ["EVT-INVALID", "Invalid"],
  ["EVT-CANCELLED", "Cancelled"],
];

function submit(id = input.value) {
  input.value = id;
  store.scan(id);
}
function again() {
  input.value = "";
  store.resetScanner();
}

const banner = computed(
  () =>
    ({
      valid: { color: "success", text: "✓ VALID TICKET" },
      reentry: { color: "info", text: "✓ VALID TICKET — RE-ENTRY AVAILABLE" },
      inside: { color: "warning", text: "⚠ ATTENDEE ALREADY INSIDE" },
      removed: { color: "error", text: "⛔ ACCESS DENIED — ATTENDEE REMOVED" },
      cancelled: { color: "error", text: "✕ TICKET CANCELLED" },
      invalid: { color: "error", text: "✕ INVALID TICKET" },
    })[r.value?.kind],
);

const lastSession = (t) => t.sessions.at(-1)?.duration ?? null;


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
    <v-main class="min-w-0 w-full mt-20 ">
      <div class="mx-auto mt-16 w-full max-w-5xl px-3 pb-4 sm:mt-20 sm:px-5 lg:px-6">
        <PageHeader
          title="Ticket Scanner"
          subtitle="Scan QR / barcode or enter ticket ID"
        />

        <div class="grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
          <!-- Scanner -->
          <v-card class="min-w-0 pa-3 ml-10" variant="flat">
            <div class="mb-2 flex flex-wrap justify-between gap-2 text-sm">
              <span class="font-semibold">Scanner</span>
              <span class="text-success">● Online</span>
            </div>

            <div
              class="flex min-h-44 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-2"
              :class="scanning
                ? 'border-primary bg-primary/10'
                : 'border-eg-border bg-eg-surface-2'"
            >
              <div class="relative grid size-24 place-items-center rounded-lg border-2 border-primary">
                <v-icon icon="mdi-camera" size="32" />
                <div
                  v-if="scanning"
                  class="animate-eg-scan absolute inset-x-[10%] h-0.5 bg-primary"
                />
              </div>

              <p class="text-center text-xs text-eg-muted">
                Point camera at ticket QR code
              </p>

              <form
                class="flex w-full max-w-xs items-start gap-1.5"
                @submit.prevent="submit()"
              >
                <v-text-field
                  v-model="input"
                  placeholder="Ticket ID"
                  density="compact"
                  hide-details
                  class="min-w-0 flex-1"
                />
                <v-btn
                  color="primary"
                  size="small"
                  type="submit"
                  :loading="scanning"
                  class="shrink-0"
                >
                  Scan
                </v-btn>
              </form>

              <div class="flex w-full flex-wrap justify-center gap-1">
                <v-btn
                  v-for="[id, label] in samples"
                  :key="id"
                  size="x-small"
                  variant="outlined"
                  @click="submit(id)"
                >
                  {{ label }}
                </v-btn>
              </div>
            </div>
          </v-card>

          <!-- Scan Result -->
          <v-card class="flex min-w-0 flex-col pa-3" variant="flat">
            <div class="mb-2 text-sm font-semibold">Scan Result</div>

            <div
              v-if="!r"
              class="grid min-h-40 flex-1 place-items-center text-center text-xs text-eg-muted"
            >
              <div>
                <div class="mb-1 text-2xl">🎫</div>
                Scan a ticket to see validation result
              </div>
            </div>

            <template v-else>
              <v-alert
                :color="banner.color"
                variant="tonal"
                density="compact"
                class="mb-2 text-sm font-bold"
              >
                {{ banner.text }}
              </v-alert>

              <div class="mb-3 min-w-0 text-xs">
                <template v-if="r.kind === 'invalid'">
                  <p class="text-eg-muted">
                    Ticket invalid: it may not exist, may be cancelled, expired,
                    or belong to another event.
                  </p>
                </template>

                <template v-else>
                  <InfoRow label="Name" :value="r.ticket.name" />
                  <InfoRow label="Ticket" :value="r.ticket.id" />

                  <InfoRow
                    v-if="!['cancelled', 'removed'].includes(r.kind)"
                    label="Ticket Type"
                    :value="r.ticket.type"
                  />

                  <template v-if="r.kind === 'cancelled'">
                    <InfoRow label="Status" value="CANCELLED" color="error" />
                  </template>

                  <template v-else-if="r.kind === 'removed'">
                    <InfoRow label="Reason" :value="r.ticket.removalReason || '—'" />
                    <p class="mt-1 text-eg-muted">
                      Re-entry blocked. Contact a manager.
                    </p>
                  </template>

                  <template v-else-if="r.kind === 'inside'">
                    <InfoRow label="Checked in" :value="formatTime(r.ticket.checkInTime)" />
                    <InfoRow label="Time inside" :value="formatDuration(getDuration(r.ticket))" />
                    <InfoRow label="Status" :value="r.ticket.attendance" />
                  </template>

                  <template v-else-if="r.kind === 'reentry'">
                    <InfoRow label="Previous exit" :value="formatTime(r.ticket.checkOutTime)" />
                    <InfoRow label="Previous duration" :value="formatDuration(lastSession(r.ticket))" />
                    <InfoRow label="Status" value="EXITED" />
                  </template>

                  <template v-else>
                    <InfoRow label="Event" :value="EVENT.name" />
                    <InfoRow label="Event Status" :value="EVENT.status" color="success" />
                    <InfoRow label="Status" value="CHECK-IN AVAILABLE" />
                  </template>
                </template>
              </div>

              <div class="mt-auto flex flex-wrap gap-1.5">
                <template v-if="r.kind === 'valid'">
                  <v-btn color="success" size="small" @click="store.checkIn(r.ticket.id)">
                    Check In
                  </v-btn>
                  <v-btn size="small" variant="outlined" @click="store.reportIssue()">
                    Report Issue
                  </v-btn>
                </template>

                <template v-else-if="r.kind === 'reentry'">
                  <v-btn color="success" size="small" @click="store.reEnter(r.ticket.id)">
                    Re-Enter
                  </v-btn>
                </template>

                <template v-else-if="r.kind === 'inside'">
                  <v-btn color="success" size="small" @click="store.checkOut(r.ticket.id)">
                    Check Out
                  </v-btn>
                  <v-btn color="warning" size="small" @click="store.flagAttendee(r.ticket.id)">
                    Flag
                  </v-btn>
                  <v-btn color="error" size="small" @click="store.openRemoveDialog(r.ticket.id)">
                    Remove
                  </v-btn>
                </template>

                <v-btn
                  v-else-if="r.kind === 'removed'"
                  color="warning"
                  size="small"
                  @click="store.contactManager()"
                >
                  Contact Manager
                </v-btn>

                <v-btn
                  v-else-if="r.kind === 'invalid'"
                  color="warning"
                  size="small"
                  @click="store.reportIssue()"
                >
                  Report Issue
                </v-btn>

                <v-btn size="small" variant="outlined" @click="again">
                  Scan Again
                </v-btn>
              </div>
            </template>
          </v-card>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>