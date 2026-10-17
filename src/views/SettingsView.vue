<script setup>
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import InfoRow from '../components/InfoRow.vue'

const { mdAndUp } = useDisplay()
const route = useRoute()

const drawer = ref(false)

// Keep the drawer open on desktop and closed on mobile.
watch(
  mdAndUp,
  (isDesktop) => {
    drawer.value = isDesktop
  },
  { immediate: true }
)

// Close the drawer after navigation on mobile.
watch(
  () => route.path,
  () => {
    if (!mdAndUp.value) {
      drawer.value = false
    }
  }
)
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
        aria-label="Toggle navigation"
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
    <v-main class="min-w-0 w-full bg-[#f5f6fa] ml-2">
      <div
        class="mx-auto mt-10 w-full max-w-5xl min-w-0 px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        <PageHeader
          title="Event Settings"
          subtitle="Configure timing, capacity and rules (demo)"
        />

        <v-card
          class="mt-5 rounded-xl pa-4 sm:pa-6"
          color="white"
          variant="flat"
        >
          <div class="flex flex-col gap-1">
            <InfoRow
              label="Event Name"
              value="Lagos Music Festival"
            />

            <InfoRow
              label="Date"
              value="August 15, 2026"
            />

            <InfoRow
              label="Time Zone"
              value="WAT (UTC+1)"
            />

            <InfoRow
              label="Check-in Opens"
              value="5:00 PM"
            />

            <InfoRow
              label="Event Starts"
              value="7:00 PM"
            />

            <InfoRow
              label="Event Ends"
              value="12:00 AM"
            />

            <InfoRow
              label="Grace Period"
              value="30 minutes"
            />

            <InfoRow
              label="Re-entry Allowed"
              value="Yes"
              color="success"
            />

            <InfoRow
              label="Venue Capacity"
              value="10,000"
            />

            <InfoRow
              label="Current State"
              value="LIVE"
              color="success"
            />
          </div>

          <v-divider class="my-4" />

          <p class="text-xs leading-5 text-slate-500">
            Frontend demo only. In production, organizers can edit
            these settings, which will control the validation logic.
          </p>
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>