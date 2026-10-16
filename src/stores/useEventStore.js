import { reactive, ref, computed } from 'vue'

export const TOTAL_TICKETS = 12450
export const VENUE_CAPACITY = 10000
export const EVENT = {
  name: 'Lagos Music Festival',
  date: 'Aug 15, 2026',
  status: 'LIVE',
}

// ─── Mock data ─────────────────────────────────────────────
const blank = () => ({
  checkInTime: null, checkOutTime: null, entryCount: 0, exitCount: 0,
  flagged: false, removed: false, removalReason: null, sessions: [],
})
const person = (id, name, type, email) => ({
  id, name, email, type, ticketStatus: 'VALID', attendance: 'NOT_ARRIVED', ...blank(),
})

const tickets = reactive({
  'EVT-829301': person('EVT-829301', 'John Doe', 'VIP', 'john.doe@email.com'),
  'EVT-829122': person('EVT-829122', 'Sarah Smith', 'General', 'sarah.s@email.com'),
  'EVT-830001': person('EVT-830001', 'Chidi Okonkwo', 'VIP', 'chidi.o@email.com'),
  'EVT-INVALID': { id: 'EVT-INVALID', name: null, ticketStatus: 'INVALID', attendance: null },
  'EVT-CANCELLED': { id: 'EVT-CANCELLED', name: 'Cancelled User', type: 'General', ticketStatus: 'CANCELLED', attendance: 'NOT_ARRIVED' },
})

;[
  ['Amina Yusuf', 'General'], ['David Chen', 'VIP'], ['Fatima Bello', 'General'],
  ['Michael Adebayo', 'General'], ['Grace Nwosu', 'VIP'], ['Tunde Bakare', 'General'],
  ['Ngozi Eze', 'General'], ['Ibrahim Musa', 'VIP'], ['Blessing Okoro', 'General'],
].forEach(([name, type], i) => {
  const id = `EVT-84${1000 + i}`
  tickets[id] = person(id, name, type, name.toLowerCase().replace(' ', '.') + '@email.com')
})

// ─── State ─────────────────────────────────────────────────
const activityLog = ref([])
const incidents = ref([])
const currentId = ref(null)       // last scanned ticket id (raw input)
const scanning = ref(false)
const totalScans = ref(0)
const reEntries = ref(0)
const peakPresent = ref(0)
const entryByHour = reactive({ 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0 })
const now = ref(new Date())
const toast = reactive({ show: false, text: '' })
const removeTargetId = ref(null)

// ─── Helpers ───────────────────────────────────────────────
export function formatTime(d) {
  if (!d) return '—'
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
export function formatDuration(ms) {
  if (!ms || ms < 0) return '—'
  const mins = Math.floor(ms / 60000)
  const h = Math.floor(mins / 60)
  return h > 0 ? `${h}h ${mins % 60}m` : `${mins}m`
}
export function getDuration(t) {
  if (!t.checkInTime) return null
  return (t.checkOutTime || now.value) - t.checkInTime
}
function notify(text) {
  toast.text = text
  toast.show = true
}
function log(text, badge, color) {
  activityLog.value.unshift({ id: crypto.randomUUID(), time: formatTime(new Date()), text, badge, color })
  if (activityLog.value.length > 40) activityLog.value.pop()
}
const isInside = (t) => t.attendance === 'PRESENT' || t.attendance === 'FLAGGED'

// ─── Derived ───────────────────────────────────────────────
const validList = computed(() => Object.values(tickets).filter((t) => t.ticketStatus === 'VALID'))

const stats = computed(() => {
  const list = validList.value
  const checkedIn = list.filter((t) => t.entryCount > 0).length
  const present = list.filter(isInside).length
  return {
    total: TOTAL_TICKETS,
    checkedIn,
    present,
    exited: list.filter((t) => t.attendance === 'EXITED').length,
    flagged: list.filter((t) => t.flagged).length,
    removed: list.filter((t) => t.removed).length,
    rate: ((checkedIn / TOTAL_TICKETS) * 100).toFixed(1),
    remaining: VENUE_CAPACITY - present,
    noShows: list.filter((t) => t.attendance === 'NOT_ARRIVED').length,
  }
})

const avgDuration = computed(() => {
  let total = 0, count = 0
  Object.values(tickets).forEach((t) => t.sessions?.forEach((s) => {
    if (s.duration) { total += s.duration; count++ }
  }))
  return count ? total / count : null
})

const scanResult = computed(() => {
  const id = currentId.value
  if (!id) return null
  const t = tickets[id]
  if (!t || t.ticketStatus === 'INVALID') return { kind: 'invalid', id }
  if (t.ticketStatus === 'CANCELLED') return { kind: 'cancelled', ticket: t }
  if (t.removed) return { kind: 'removed', ticket: t }
  if (isInside(t)) return { kind: 'inside', ticket: t }
  if (t.attendance === 'EXITED') return { kind: 'reentry', ticket: t }
  return { kind: 'valid', ticket: t }
})

function trackPeak() {
  if (stats.value.present > peakPresent.value) peakPresent.value = stats.value.present
}

// ─── Actions ───────────────────────────────────────────────
function scan(raw) {
  const id = String(raw || '').trim().toUpperCase()
  if (!id || scanning.value) return
  scanning.value = true
  totalScans.value++
  setTimeout(() => {
    scanning.value = false
    currentId.value = id
    log(`Ticket ${id} scanned`, 'Scan', 'primary')
  }, 700)
}

function resetScanner() {
  currentId.value = null
}

function startSession(t) {
  t.attendance = 'PRESENT'
  t.checkInTime = new Date()
  t.checkOutTime = null
  t.entryCount++
  t.sessions.push({ entry: t.checkInTime, exit: null, duration: null })
}

function checkIn(id) {
  const t = tickets[id]
  if (!t || t.attendance === 'PRESENT') return
  startSession(t)
  const h = t.checkInTime.getHours()
  if (entryByHour[h] !== undefined) entryByHour[h]++
  log(`${t.name} checked in`, 'Check-in', 'success')
  trackPeak()
  notify(`${t.name} checked in successfully`)
}

function checkOut(id) {
  const t = tickets[id]
  if (!t || !isInside(t)) return
  t.attendance = 'EXITED'
  t.checkOutTime = new Date()
  t.exitCount++
  const s = t.sessions[t.sessions.length - 1]
  if (s) { s.exit = t.checkOutTime; s.duration = t.checkOutTime - s.entry }
  log(`${t.name} exited`, 'Check-out', 'info')
  notify(`${t.name} checked out`)
}

function reEnter(id) {
  const t = tickets[id]
  if (!t || t.attendance !== 'EXITED') return
  startSession(t)
  reEntries.value++
  log(`${t.name} re-entered`, 'Re-entry', 'success')
  trackPeak()
  notify(`${t.name} re-entered`)
}

function addIncident(t, category, severity, reportedBy, notes) {
  incidents.value.unshift({
    id: 'INC-' + (82000 + incidents.value.length + 1),
    attendee: t.name, ticket: t.id, category, severity, reportedBy,
    time: new Date(), status: 'OPEN', notes,
  })
}

function flagAttendee(id) {
  const t = tickets[id]
  if (!t) return
  t.flagged = true
  t.attendance = 'FLAGGED'
  addIncident(t, 'Security', 'Medium', 'Scanner Staff')
  log(`${t.name} flagged by staff`, 'Flagged', 'warning')
  notify(`${t.name} has been flagged`)
}

function openRemoveDialog(id) { removeTargetId.value = id }
function closeRemoveDialog() { removeTargetId.value = null }

function confirmRemove(reason, notes) {
  const id = removeTargetId.value
  const t = tickets[id]
  if (!t) return
  t.removed = true
  t.attendance = 'REMOVED'
  t.removalReason = reason
  t.checkOutTime = new Date()
  addIncident(t, 'Removal', 'High', 'Security Staff', notes ? `${reason} — ${notes}` : reason)
  log(`${t.name} removed — ${reason}`, 'Removed', 'error')
  notify(`${t.name} removed from event`)
  closeRemoveDialog()
}

function reportIssue() { notify('Issue reported (demo)') }
function contactManager() { notify('Manager contacted (demo)') }
function tick() { now.value = new Date() }

export function useEventStore() {
  return {
    tickets, validList, stats, avgDuration, scanResult,
    activityLog, incidents, entryByHour, now,
    currentId, scanning, totalScans, reEntries, peakPresent,
    toast, removeTargetId,
    scan, resetScanner, checkIn, checkOut, reEnter, flagAttendee,
    openRemoveDialog, closeRemoveDialog, confirmRemove,
    reportIssue, contactManager, tick,
  }
}
