<script setup>
defineProps({ label: String, value: [String, Number], color: String })
</script>

<template>
  <v-card class="p-4">
    <div class="mb-1 text-xs uppercase tracking-wide text-eg-muted">{{ label }}</div>
    <div class="text-3xl font-bold leading-tight" :class="color ? `text-${color}` : ''">{{ value }}</div>
  </v-card>
</template>
