<script setup>
defineProps({ title: String, subtitle: String })
</script>

<template>
  <header class="mb-6">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <p class="text-sm text-eg-muted">{{ subtitle }}</p>
  </header>
</template>
