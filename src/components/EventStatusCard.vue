
<script setup>
import InfoRow from './InfoRow.vue'

defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <v-card rounded="lg" variant="flat" border>
    <v-card-title class="text-body-1">Event Status</v-card-title>
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
</template>
