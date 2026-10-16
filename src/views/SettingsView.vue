<script setup>
import PageHeader from '../components/PageHeader.vue'
import InfoRow from '../components/InfoRow.vue'

</script>


<template>
  <div class="mt-25 ml-65 mb-20 mx-auto w-full max-w-5xl px-3">
    <PageHeader
      title="Event Settings"
      subtitle="Configure timing, capacity and rules (demo)"
    />

    <v-card class="pa-3" variant="flat">
      <div class="flex flex-col gap-1">
        <InfoRow label="Event Name" value="Lagos Music Festival" />
        <InfoRow label="Date" value="August 15, 2026" />
        <InfoRow label="Time Zone" value="WAT (UTC+1)" />
        <InfoRow label="Check-in Opens" value="5:00 PM" />
        <InfoRow label="Event Starts" value="7:00 PM" />
        <InfoRow label="Event Ends" value="12:00 AM" />
        <InfoRow label="Grace Period" value="30 minutes" />
        <InfoRow
          label="Re-entry Allowed"
          value="Yes"
          color="success"
        />
        <InfoRow label="Venue Capacity" value="10,000" />
        <InfoRow label="Current State" value="LIVE" color="success" />
      </div>

      <p class="mt-3 text-[10px] leading-4 text-eg-muted">
        Frontend demo only. In production, organizers can edit these
        settings, which will control the validation logic.
      </p>
    </v-card>
  </div>
</template>
