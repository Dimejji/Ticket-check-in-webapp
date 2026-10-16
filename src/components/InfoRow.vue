<script setup>
defineProps({ label: String, value: [String, Number], color: String })
</script>

<template>
  <div class="flex justify-between border-b border-eg-border py-1.5 text-sm">
    <span class="text-eg-muted">{{ label }}</span>
    <span class="font-semibold" :class="color ? `text-${color}` : ''">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>
