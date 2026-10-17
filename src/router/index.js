
import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import ScannerView from "../views/ScannerView.vue";
import AttendeesView from "../views/AttendeesView.vue";
import IncidentsView from "../views/IncidentsView.vue";
import AnalyticsView from "../views/AnalyticsView.vue";
import SettingsView from "../views/SettingsView.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", name: "Dashboard", component: DashboardView },
  { path: "/scannerview", name: "Scanner", component: ScannerView },
  { path: "/attendeesview", name: "Attendance", component: AttendeesView },
  { path: "/incidentsview", name: "Incidents", component: IncidentsView },
  { path: "/analyticsview", name: "Analytics", component: AnalyticsView },
  { path: "/settingsview", name: "Settings", component: SettingsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
