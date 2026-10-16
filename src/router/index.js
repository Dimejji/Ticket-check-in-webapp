
import { createRouter, createWebHistory } from 'vue-router'

import Sidebar from '../components/sidebar.vue'
import DashboardView from '../views/DashboardView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import ScannerView from '../views/ScannerView.vue'
import AttendeesView from '../views/AttendeesView.vue'
import IncidentsView from '../views/IncidentsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    component: Sidebar,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardView,
      },
      {
        path: 'analyticsview',
        component: AnalyticsView,
      },
      {
        path: 'attendeesview',
        component: AttendeesView,
      },
      {
        path: 'incidentsview',
        component: IncidentsView,
      },
      {
        path: 'scannerview',
        component: ScannerView,
      },
      {
        path: 'settingsview',
        component: SettingsView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
