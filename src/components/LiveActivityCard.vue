
<script setup>
defineProps({
  activityLog: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <v-card rounded="lg" variant="flat" border>
    <v-card-title class="d-flex align-center justify-space-between text-body-1">
      Live Activity
      <v-chip color="success" size="small" variant="tonal">
        Real-time
      </v-chip>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-3">
      <div v-if="!activityLog.length" class="py-8 text-center text-medium-emphasis">
        <v-icon size="32">mdi-history</v-icon>
        <div>No activity yet.</div>
        <div class="text-body-2">Scan a ticket to begin.</div>
      </div>

      <v-list v-else density="compact" class="overflow-y-auto pa-0" style="max-height: 240px">
        <v-list-item v-for="a in activityLog" :key="a.id" class="px-1">
          <template #prepend>
            <span class="mr-3 text-caption text-medium-emphasis">
              {{ a.time }}
            </span>
          </template>

          <v-list-item-title class="text-body-2 text-wrap">
            {{ a.text }}
          </v-list-item-title>

          <template #append>
            <v-chip :color="a.color" size="x-small" variant="tonal">
              {{ a.badge }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
