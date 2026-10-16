
<template>
  <v-layout class="min-h-screen">
    <v-app-bar
      class="!bg-[#1b2333] !text-white"
      elevation="0"
    >
      <v-app-bar-title class="!ml-10 !text-base !font-semibold">
        Events Attendance
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      permanent
      class="!bg-[#1b2333] !text-white"
    >
      <v-list nav class="!bg-transparent !p-3">
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard-outline"
          to="/dashboard"
          rounded="lg"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Scanner"
          prepend-icon="mdi-qrcode-scan"
          to="/scannerview"
          rounded="lg"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Attendance"
          prepend-icon="mdi-account-check-outline"
          to="/attendeesview"
          rounded="lg"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Incidents"
          prepend-icon="mdi-alert-circle-outline"
          to="/incidentsview"
          rounded="lg"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Analytics"
          prepend-icon="mdi-chart-box-outline"
          to="/analyticsview"
          rounded="lg"
          active-class="!bg-[#2b364a] !text-white"
        />

        <p class="px-4 pt-6 pb-2 text-[11px] font-semibold tracking-[1.5px] text-slate-400">
          EVENTS
        </p>

        <v-list-item
          title="Settings"
          prepend-icon="mdi-cog-outline"
          to="/settingsview"
          rounded="lg"
          active-class="!bg-[#2b364a] !text-white"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main class="!bg-[#f5f6fa]">
      <v-container fluid class="pa-0">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>
