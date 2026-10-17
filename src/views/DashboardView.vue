<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'
import InfoRow from '../components/InfoRow.vue'

import {
  useEventStore,
  EVENT,
  TOTAL_TICKETS,
  VENUE_CAPACITY,
} from '../stores/useEventStore'

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

      <v-app-bar-title
        class="!text-sm !font-semibold tracking-tight sm:!text-base"
      >
        Events Attendance
      </v-app-bar-title>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      :scrim="!mdAndUp"
      width="140"
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

        <div
          class="px-4 pt-5 pb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase"
        >
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
    <v-main class="bg-grey-lighten-4 mt-16 sm:mt-20">
      <v-container fluid class="pa-3 pa-sm-4">
        <v-row justify="center">
          <v-col cols="12" lg="10" xl="9" class="mx-auto">
            <div class="mx-auto" style="max-width: 1100px">
              <!-- Page Header -->
              <PageHeader
                title="Live Dashboard"
                :subtitle="`${EVENT.name} · ${EVENT.date}`"
                class="ml-0 sm:ml-10"
              />

              <!-- Statistics -->
              <v-row
                density="compact"
                class="mb-3 ml-0 sm:ml-10"
              >
                <v-col
                  v-for="[label, value, color] in cards"
                  :key="label"
                  cols="6"
                  sm="4"
                  xl="2"
                >
                  <StatCard
                    :label="label"
                    :value="value"
                    :color="color"
                  />
                </v-col>
              </v-row>

              <!-- Dashboard panels -->
              <v-row class="ml-0 sm:ml-10">
                <!-- Live Activity -->
                <v-col cols="12" md="6">
                  <v-card rounded="lg" variant="flat" border>
                    <v-card-title
                      class="d-flex align-center justify-space-between text-body-1 flex-wrap ga-2"
                    >
                      <span>Live Activity</span>

                      <v-chip
                        size="small"
                        color="success"
                        variant="tonal"
                      >
                        Real-time
                      </v-chip>
                    </v-card-title>

                    <v-divider />

                    <v-card-text class="pa-3">
                      <div
                        v-if="!activityLog.length"
                        class="py-8 text-center text-medium-emphasis"
                      >
                        <v-icon size="32" class="mb-2">
                          mdi-history
                        </v-icon>

                        <div>No activity yet.</div>
                        <div class="text-body-2">
                          Scan a ticket to begin.
                        </div>
                      </div>

                      <div
                        v-else
                        class="overflow-y-auto overflow-x-hidden"
                        style="max-height: 240px"
                      >
                        <v-list density="compact" class="pa-0">
                          <v-list-item
                            v-for="a in activityLog"
                            :key="a.id"
                            class="px-1"
                          >
                            <template #prepend>
                              <span
                                class="text-caption text-medium-emphasis mr-3"
                              >
                                {{ a.time }}
                              </span>
                            </template>

                            <v-list-item-title
                              class="text-body-2 text-wrap"
                            >
                              {{ a.text }}
                            </v-list-item-title>

                            <template #append>
                              <v-chip
                                :color="a.color"
                                size="x-small"
                                variant="tonal"
                              >
                                {{ a.badge }}
                              </v-chip>
                            </template>
                          </v-list-item>
                        </v-list>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Event Status -->
                <v-col cols="12" md="6">
                  <v-card rounded="lg" variant="flat" border>
                    <v-card-title class="text-body-1">
                      Event Status
                    </v-card-title>

                    <v-divider />

                    <v-card-text class="pa-3">
                      <InfoRow
                        v-for="[label, value] in rows"
                        :key="label"
                        :label="label"
                        :value="value"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>
