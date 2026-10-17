<!-- <script setup>
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

const { mdAndUp } = useDisplay()
const route = useRoute() -->

// Drawer open state
// const drawer = ref(true)

// Keep drawer open on desktop, closed by default on mobile
// watch(mdAndUp, (isDesktop) => {
//   drawer.value = isDesktop
// }, { immediate: true })

// Close drawer after navigating on mobile
// watch(() => route.path, () => {
//   if (!mdAndUp.value) {
//     drawer.value = false
//   }
// })
<!-- // </script> -->

<!-- <template>
  <v-layout class="min-h-screen"> -->
    <!-- App Bar -->
    <!-- <v-app-bar
      class="!bg-[#1b2333] !text-white"
      elevation="0"
      density="comfortable" -->
    >
      <!-- Hamburger – only visible on mobile/tablet -->
      <!-- <v-app-bar-nav-icon
        v-if="!mdAndUp"
        class="!text-white"
        @click="drawer = !drawer"
      /> -->

      <!-- <v-app-bar-title
        class="!text-base !font-semibold"
        :class="mdAndUp ? '!ml-6' : '!ml-2'"
      > -->
        Events Attendance
      <!-- </v-app-bar-title>
    </v-app-bar> -->

    <!-- Navigation Drawer – responsive -->
    <!-- <v-navigation-drawer
      v-model="drawer"
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      width="240"
      class="!bg-[#1b2333] !text-white"
    > -->
      <!-- <v-list nav class="!bg-transparent !p-3">
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard-outline"
          to="/dashboard"
          rounded="lg"
          class="!mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        /> -->

        <!-- <v-list-item
          title="Scanner"
          prepend-icon="mdi-qrcode-scan"
          to="/scannerview"
          rounded="lg"
          class="!mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        /> -->

        <!-- <v-list-item
          title="Attendance"
          prepend-icon="mdi-account-check-outline"
          to="/attendeesview"
          rounded="lg"
          class="!mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        /> -->

        <!-- <v-list-item
          title="Incidents"
          prepend-icon="mdi-alert-circle-outline"
          to="/incidentsview"
          rounded="lg"
          class="!mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        />

        <v-list-item
          title="Analytics"
          prepend-icon="mdi-chart-box-outline"
          to="/analyticsview"
          rounded="lg"
          class="!mb-1 !text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        /> -->

        <!-- <p class="px-4 pt-6 pb-2 text-[11px] font-semibold tracking-[1.5px] text-slate-400">
          EVENTS
        </p>

        <v-list-item
          title="Settings"
          prepend-icon="mdi-cog-outline"
          to="/settingsview"
          rounded="lg"
          class="!text-slate-300 hover:!bg-[#2b364a] hover:!text-white"
          active-class="!bg-[#2b364a] !text-white"
        /> -->
      <!-- </v-list> -->
    <!-- </v-navigation-drawer> -->

    <!-- Main content -->
    
<!-- Main content -->
<!-- <v-main class="!bg-[#f5f6fa] min-w-0 w-full">
  <v-container fluid class="pa-0 min-w-0">
    <router-view />
  </v-container>
</v-main>

  </v-layout>
</template> -->