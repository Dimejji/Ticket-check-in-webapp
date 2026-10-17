<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

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

// const { stats, activityLog } = useEventStore()
// const n = (v) => v.toLocaleString()

import { useEventStore, formatDuration } from '../stores/useEventStore'
import PageHeader from '../components/PageHeader.vue'
import InfoRow from '../components/InfoRow.vue'

const { entryByHour, avgDuration, peakPresent, stats, reEntries, totalScans } = useEventStore()
const labels = { 17: '5 PM', 18: '6 PM', 19: '7 PM', 20: '8 PM', 21: '9 PM', 22: '10 PM', 23: '11 PM' }
const max = computed(() => Math.max(...Object.values(entryByHour), 1))
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
      width="180"
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

    <!-- main content -->
    <v-main class="min-w-0 w-full">
      <div class="mx-auto mt-16 mb-10 w-full max-w-5xl min-w-0 px-3 sm:mt-20 sm:px-5 lg:px-6">
        <PageHeader
          title="Analytics"
          subtitle="Entry/exit patterns and attendance duration"
        />

        <div class="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
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
    </v-main>
  </v-layout>
</template>