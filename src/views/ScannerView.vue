<script setup>
import { ref, computed } from "vue";
import {
  useEventStore,
  EVENT,
  formatTime,
  formatDuration,
  getDuration,
} from "../stores/useEventStore";
import PageHeader from "../components/PageHeader.vue";
import InfoRow from "../components/InfoRow.vue";

const store = useEventStore();
const { scanning, scanResult: r } = store;
const input = ref("");

const samples = [
  ["EVT-829301", "EVT-829301"],
  ["EVT-829122", "EVT-829122"],
  ["EVT-830001", "EVT-830001"],
  ["EVT-INVALID", "Invalid"],
  ["EVT-CANCELLED", "Cancelled"],
];

function submit(id = input.value) {
  input.value = id;
  store.scan(id);
}
function again() {
  input.value = "";
  store.resetScanner();
}

const banner = computed(
  () =>
    ({
      valid: { color: "success", text: "✓ VALID TICKET" },
      reentry: { color: "info", text: "✓ VALID TICKET — RE-ENTRY AVAILABLE" },
      inside: { color: "warning", text: "⚠ ATTENDEE ALREADY INSIDE" },
      removed: { color: "error", text: "⛔ ACCESS DENIED — ATTENDEE REMOVED" },
      cancelled: { color: "error", text: "✕ TICKET CANCELLED" },
      invalid: { color: "error", text: "✕ INVALID TICKET" },
    })[r.value?.kind],
);

const lastSession = (t) => t.sessions.at(-1)?.duration ?? null;
</script>


<template>
  <div class="mt-25 ml-68 mx-auto w-full max-w-5xl px-3">
    <PageHeader
      title="Ticket Scanner"
      subtitle="Scan QR / barcode or enter ticket ID"
    />

    <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <!-- Scanner -->
      <v-card class="pa-3" variant="flat">
        <div class="mb-2 flex justify-between text-sm">
          <span class="font-semibold">Scanner</span>
          <span class="text-success">● Online</span>
        </div>

        <div
          class="flex min-h-44 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-2"
          :class="scanning
            ? 'border-primary bg-primary/10'
            : 'border-eg-border bg-eg-surface-2'"
        >
          <div class="relative grid size-24 place-items-center rounded-lg border-2 border-primary">
            <v-icon icon="mdi-camera" size="32" />
            <div
              v-if="scanning"
              class="animate-eg-scan absolute inset-x-[10%] h-0.5 bg-primary"
            />
          </div>

          <p class="text-center text-xs text-eg-muted">
            Point camera at ticket QR code
          </p>

          <form
            class="flex w-full max-w-xs items-start gap-1.5"
            @submit.prevent="submit()"
          >
            <v-text-field
              v-model="input"
              placeholder="Ticket ID"
              density="compact"
              hide-details
            />
            <v-btn
              color="primary"
              size="small"
              type="submit"
              :loading="scanning"
            >
              Scan
            </v-btn>
          </form>

          <div class="flex flex-wrap justify-center gap-1">
            <v-btn
              v-for="[id, label] in samples"
              :key="id"
              size="x-small"
              variant="outlined"
              @click="submit(id)"
            >
              {{ label }}
            </v-btn>
          </div>
        </div>
      </v-card>

      <!-- Scan Result -->
      <v-card class="flex flex-col pa-3" variant="flat">
        <div class="mb-2 text-sm font-semibold">Scan Result</div>

        <div
          v-if="!r"
          class="grid min-h-40 flex-1 place-items-center text-center text-xs text-eg-muted"
        >
          <div>
            <div class="mb-1 text-2xl">🎫</div>
            Scan a ticket to see validation result
          </div>
        </div>

        <template v-else>
          <v-alert
            :color="banner.color"
            variant="tonal"
            density="compact"
            class="mb-2 text-sm font-bold"
          >
            {{ banner.text }}
          </v-alert>

          <div class="mb-3 text-xs">
            <template v-if="r.kind === 'invalid'">
              <p class="text-eg-muted">
                Ticket invalid: it may not exist, may be cancelled, expired,
                or belong to another event.
              </p>
            </template>

            <template v-else>
              <InfoRow label="Name" :value="r.ticket.name" />
              <InfoRow label="Ticket" :value="r.ticket.id" />

              <InfoRow
                v-if="!['cancelled', 'removed'].includes(r.kind)"
                label="Ticket Type"
                :value="r.ticket.type"
              />

              <template v-if="r.kind === 'cancelled'">
                <InfoRow label="Status" value="CANCELLED" color="error" />
              </template>

              <template v-else-if="r.kind === 'removed'">
                <InfoRow label="Reason" :value="r.ticket.removalReason || '—'" />
                <p class="mt-1 text-eg-muted">
                  Re-entry blocked. Contact a manager.
                </p>
              </template>

              <template v-else-if="r.kind === 'inside'">
                <InfoRow label="Checked in" :value="formatTime(r.ticket.checkInTime)" />
                <InfoRow label="Time inside" :value="formatDuration(getDuration(r.ticket))" />
                <InfoRow label="Status" :value="r.ticket.attendance" />
              </template>

              <template v-else-if="r.kind === 'reentry'">
                <InfoRow label="Previous exit" :value="formatTime(r.ticket.checkOutTime)" />
                <InfoRow label="Previous duration" :value="formatDuration(lastSession(r.ticket))" />
                <InfoRow label="Status" value="EXITED" />
              </template>

              <template v-else>
                <InfoRow label="Event" :value="EVENT.name" />
                <InfoRow label="Event Status" :value="EVENT.status" color="success" />
                <InfoRow label="Status" value="CHECK-IN AVAILABLE" />
              </template>
            </template>
          </div>

          <div class="mt-auto flex flex-wrap gap-1.5">
            <template v-if="r.kind === 'valid'">
              <v-btn color="success" size="small" @click="store.checkIn(r.ticket.id)">
                Check In
              </v-btn>
              <v-btn size="small" variant="outlined" @click="store.reportIssue()">
                Report Issue
              </v-btn>
            </template>

            <template v-else-if="r.kind === 'reentry'">
              <v-btn color="success" size="small" @click="store.reEnter(r.ticket.id)">
                Re-Enter
              </v-btn>
            </template>

            <template v-else-if="r.kind === 'inside'">
              <v-btn color="success" size="small" @click="store.checkOut(r.ticket.id)">
                Check Out
              </v-btn>
              <v-btn color="warning" size="small" @click="store.flagAttendee(r.ticket.id)">
                Flag
              </v-btn>
              <v-btn color="error" size="small" @click="store.openRemoveDialog(r.ticket.id)">
                Remove
              </v-btn>
            </template>

            <v-btn
              v-else-if="r.kind === 'removed'"
              color="warning"
              size="small"
              @click="store.contactManager()"
            >
              Contact Manager
            </v-btn>

            <v-btn
              v-else-if="r.kind === 'invalid'"
              color="warning"
              size="small"
              @click="store.reportIssue()"
            >
              Report Issue
            </v-btn>

            <v-btn size="small" variant="outlined" @click="again">
              Scan Again
            </v-btn>
          </div>
        </template>
      </v-card>
    </div>
  </div>
</template>
