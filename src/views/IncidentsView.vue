<script setup>
import { useEventStore, formatTime } from "../stores/useEventStore";
import PageHeader from "../components/PageHeader.vue";
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";

const { mdAndUp } = useDisplay();
const route = useRoute();

const drawer = ref(false);

// Keep drawer open on desktop, closed on mobile
watch(
  mdAndUp,
  (isDesktop) => {
    drawer.value = isDesktop;
  },
  { immediate: true },
);

// Close drawer on route change (mobile only)
watch(
  () => route.path,
  () => {
    if (!mdAndUp.value) drawer.value = false;
  },
);

const { stats, activityLog } = useEventStore();
const n = (v) => v.toLocaleString();

const { incidents } = useEventStore();
const headers = [
  { title: "ID", key: "id" },
  { title: "Attendee", key: "attendee" },
  { title: "Category", key: "category" },
  { title: "Severity", key: "severity" },
  { title: "Reported By", key: "reportedBy" },
  { title: "Time", key: "time" },
  { title: "Status", key: "status" },
];
const severityColor = (s) =>
  s === "High" || s === "Critical" ? "error" : "warning";
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
    <v-navigation-drawer
      v-model="drawer"
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      :scrim="!mdAndUp"
      width="155"
      class="!bg-[#1b2333] !text-white"
    >
      <v-list nav density="comfortable" class="!bg-transparent pa-2 sm:pa-3">
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

    <!-- main content -->
    <v-main class="min-w-0 w-full">
      <div
        class="mx-auto mt-16 mb-10 w-full max-w-5xl min-w-0 px-3 sm:mt-20 sm:px-5 lg:px-6"
      >
        <PageHeader
          title="Incidents"
          subtitle="Security flags, removals & reported issues"
        />

        <v-card class="pa-3" variant="flat">
          <div class="w-full min-w-0 overflow-x-auto">
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
          </div>
        </v-card>
      </div>
    </v-main>
  </v-layout>
</template>