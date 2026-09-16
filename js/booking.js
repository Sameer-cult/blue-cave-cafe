/**
 * BLUE CAVE CAFE — Booking Engine Logic
 * Exactly 3 Cabins (Cabin A, B, C) & 3 Tables (Table 1, 2, 3)
 * Free Date & Time Selection (11:00 AM – 11:00 PM)
 * Real-time Booked vs Available Schedule Tracking
 * Direct WhatsApp Notification to Cafe Owner (6307-693972)
 */

const CAFE_PHONE = "916307693972"; // 6307-693972 formatted for WhatsApp API
const BOOKING_STORAGE_KEY = "blue_cave_bookings_v3";

// Seating Inventory: Exactly 3 Themed Cave Cabins & 3 Cafe Tables
const SEATING_INVENTORY = [
  // 3 Themed Cave Cabins
  {
    id: "cabin-a",
    name: "Cabin A",
    category: "Themed Cave Cabin",
    type: "cabin",
    desc: "Intimate alcove with fairy lights & romantic candlelight. Perfect for dates.",
    badge: "Cave Cabin",
    badgeClass: "romantic",
    image: "assets/images/cozy_cabin_booth.jpg"
  },
  {
    id: "cabin-b",
    name: "Cabin B",
    category: "Themed Cave Cabin",
    type: "cabin",
    desc: "Cozy stone cave nook with ambient lighting for quiet dining and heartfelt conversations.",
    badge: "Cave Cabin",
    badgeClass: "romantic",
    image: "assets/images/cabin_dining_real.jpg"
  },
  {
    id: "cabin-c",
    name: "Cabin C",
    category: "VIP Cave Cabin",
    type: "cabin",
    desc: "Spacious themed cave with customizable party neon glow. Great for dates & birthdays.",
    badge: "VIP Cabin",
    badgeClass: "party",
    image: "assets/images/neon_cave_interior.jpg"
  },

  // 3 Cafe Tables
  {
    id: "table-1",
    name: "Table 1",
    category: "Cave Dining Table",
    type: "table",
    desc: "Central cave table with plush booth seating right under the stone rock arch.",
    badge: "Cave Table",
    badgeClass: "games",
    image: "assets/images/hero_cave_ambiance.jpg"
  },
  {
    id: "table-2",
    name: "Table 2",
    category: "Board Game Arena Table",
    type: "table",
    desc: "Next to the Uno, Ludo & board games shelf. Relaxed and fun hangout spot.",
    badge: "Games Table",
    badgeClass: "games",
    image: "assets/images/cafe_social_vibe.jpg"
  },
  {
    id: "table-3",
    name: "Table 3",
    category: "Corner Lounge Table",
    type: "table",
    desc: "Quiet corner alcove table, ideal for espresso, shakes and artisanal Italian pasta.",
    badge: "Lounge Table",
    badgeClass: "games",
    image: "assets/images/cafe_special_dish.jpg"
  }
];

// Full Day 30-Minute Time Slots throughout Cafe Hours (11:00 AM - 11:00 PM)
const TIME_SLOTS = [
  // Lunch (11:00 AM - 03:30 PM)
  { time: "11:00 AM", period: "afternoon" },
  { time: "11:30 AM", period: "afternoon" },
  { time: "12:00 PM", period: "afternoon" },
  { time: "12:30 PM", period: "afternoon" },
  { time: "01:00 PM", period: "afternoon" },
  { time: "01:30 PM", period: "afternoon" },
  { time: "02:00 PM", period: "afternoon" },
  { time: "02:30 PM", period: "afternoon" },
  { time: "03:00 PM", period: "afternoon" },
  { time: "03:30 PM", period: "afternoon" },

  // Evening & Sunset (04:00 PM - 06:30 PM)
  { time: "04:00 PM", period: "sunset" },
  { time: "04:30 PM", period: "sunset" },
  { time: "05:00 PM", period: "sunset" },
  { time: "05:30 PM", period: "sunset" },
  { time: "06:00 PM", period: "sunset" },
  { time: "06:30 PM", period: "sunset" },

  // Night Ambiance (07:00 PM - 10:30 PM)
  { time: "07:00 PM", period: "night" },
  { time: "07:30 PM", period: "night" },
  { time: "08:00 PM", period: "night" },
  { time: "08:30 PM", period: "night" },
  { time: "09:00 PM", period: "night" },
  { time: "09:30 PM", period: "night" },
  { time: "10:00 PM", period: "night" },
  { time: "10:30 PM", period: "night" }
];

// Helpers for date keys (YYYY-MM-DD) & Indian Standard Time (IST)
function getNowIST() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 5.5));
}

function getDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return getDateKey(getNowIST());
}

function getTomorrowKey() {
  const d = getNowIST();
  d.setDate(d.getDate() + 1);
  return getDateKey(d);
}

// Convert "07:30 PM" or "11:00 AM" to 24-hr { hours, minutes }
function parseTimeParts(timeStr) {
  if (!timeStr) return { hours: 0, minutes: 0 };
  const [time, period] = timeStr.trim().split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours: Number(hours), minutes: Number(minutes) };
}

// Determines if a time slot has already elapsed for a given dateKey
function isTimePassedForDate(timeStr, dateKey) {
  if (!timeStr) return false;
  const todayKey = getTodayKey();
  if (dateKey < todayKey) return true; // Past dates are completely passed
  if (dateKey > todayKey) return false; // Future dates are all upcoming

  // Same day: compare slot time with current IST time
  const now = getNowIST();
  const { hours, minutes } = parseTimeParts(timeStr);
  const nowH = now.getHours();
  const nowM = now.getMinutes();

  if (hours < nowH) return true;
  if (hours === nowH && minutes <= nowM) return true;
  return false;
}

// -------------------------------------------------------------
// Booking Registry (Local Persistence + Realistic Pre-seeded Slots)
// -------------------------------------------------------------
function getStoredBookings() {
  try {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // Pre-seed realistic sample bookings for Today and Tomorrow so visitors immediately see the booked schedule in action
  const todayKey = getTodayKey();
  const tomorrowKey = getTomorrowKey();

  const seed = [
    { seatingId: "cabin-a", dateKey: todayKey, time: "01:30 PM", name: "Rohan S.", refId: "BCC-4812" },
    { seatingId: "cabin-a", dateKey: todayKey, time: "08:00 PM", name: "Ananya M.", refId: "BCC-7231" },
    { seatingId: "cabin-b", dateKey: todayKey, time: "07:00 PM", name: "Vikram G.", refId: "BCC-3190" },
    { seatingId: "cabin-c", dateKey: todayKey, time: "08:30 PM", name: "Birthday Bash", refId: "BCC-9024" },
    { seatingId: "table-2", dateKey: todayKey, time: "05:00 PM", name: "Game Squad", refId: "BCC-6120" },
    // Tomorrow
    { seatingId: "cabin-a", dateKey: tomorrowKey, time: "07:30 PM", name: "Priya V.", refId: "BCC-8311" },
    { seatingId: "cabin-c", dateKey: tomorrowKey, time: "09:00 PM", name: "Karan D.", refId: "BCC-5520" }
  ];

  saveBookings(seed);
  return seed;
}

function saveBookings(bookings) {
  try {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {}
}

function addBooking(bookingData) {
  const bookings = getStoredBookings();
  bookings.push(bookingData);
  saveBookings(bookings);
}

function isSlotBooked(seatingId, dateKey, time) {
  const bookings = getStoredBookings();
  return bookings.some(b => b.seatingId === seatingId && b.dateKey === dateKey && b.time === time);
}

function getBookedSlotsFor(seatingId, dateKey) {
  const bookings = getStoredBookings();
  return bookings.filter(b => b.seatingId === seatingId && b.dateKey === dateKey);
}

// Active State
let currentBooking = {
  seating: SEATING_INVENTORY[0], // Defaults to Cabin A
  activeFilter: "all",
  activePeriodFilter: "all",
  dateKey: getTodayKey(),
  formattedDate: formatDisplayDate(new Date()),
  timeSlot: "07:00 PM",
  addons: [],
  name: "",
  phone: "",
  note: "",
  refId: generateRefId()
};

function formatDisplayDate(dateObj) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return dateObj.toLocaleDateString('en-IN', options);
}

function generateRefId() {
  return "BCC-" + Math.floor(1000 + Math.random() * 9000);
}

// Initialize Booking Engine on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderFloorPlan();
  initZoneFilters();
  setupDatePickers();
  renderTimeSlots();
  setupCustomTimePicker();
  setupAddons();
  setupFormListeners();
  updateHoursBanner();
  updateSummaryPreview();

  // Keep hours banner fresh
  setInterval(updateHoursBanner, 60000);
});

// -------------------------------------------------------------
// Cafe Operating Hours & Real-Time Open/Closed Status
// -------------------------------------------------------------
function updateHoursBanner() {
  const badge = document.getElementById("booking-open-badge");
  const textEl = document.getElementById("booking-open-text");
  if (!badge || !textEl) return;

  // Indian Standard Time
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utc + (3600000 * 5.5));
  const hours = istTime.getHours();

  // 11:00 AM (11) to 11:00 PM (23)
  const isOpen = (hours >= 11 && hours < 23);

  if (isOpen) {
    badge.className = "hours-banner-badge is-open";
    textEl.innerHTML = `<span class="status-pulse-dot"></span> <b>OPEN NOW</b> • Closes at 11:00 PM`;
  } else {
    badge.className = "hours-banner-badge is-closed";
    const opensAt = hours < 11 ? "Opens Today at 11:00 AM" : "Opens Tomorrow at 11:00 AM";
    textEl.innerHTML = `<span class="dot-closed"></span> <b>CLOSED NOW</b> • ${opensAt}`;
  }
}

// -------------------------------------------------------------
// 1. Floor Plan Grid (3 Cabins & 3 Tables)
// -------------------------------------------------------------
function renderFloorPlan() {
  const container = document.getElementById("floorplan-grid");
  if (!container) return;

  const items = currentBooking.activeFilter === "all" 
    ? SEATING_INVENTORY 
    : SEATING_INVENTORY.filter(s => s.type === currentBooking.activeFilter);

  container.innerHTML = items.map((seat) => {
    const isSelected = seat.id === currentBooking.seating.id;
    const bookedOnDate = getBookedSlotsFor(seat.id, currentBooking.dateKey);
    const bookedCount = bookedOnDate.length;

    return `
      <div class="floor-booth ${seat.type === 'cabin' ? 'is-cabin' : 'is-table'} ${isSelected ? 'selected' : ''}" 
           data-seat-id="${seat.id}">
        <div>
          <div class="booth-badge-row">
            <span class="booth-badge ${seat.badgeClass}">★ ${seat.badge}</span>
            <span class="booth-type-tag">${seat.category}</span>
          </div>
          <h4 class="booth-name">${seat.name}</h4>
          <p class="booth-desc">${seat.desc}</p>
        </div>
        <div class="booth-footer">
          <div class="booth-capacity">
            <i class="fa-solid fa-sparkles"></i> Themed Atmosphere
          </div>
          <span style="font-weight: 700; color: ${isSelected ? '#10b981' : 'var(--accent-primary)'};">
            ${isSelected ? '✓ Selected' : 'Tap to Select'}
          </span>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".floor-booth").forEach(boothEl => {
    boothEl.addEventListener("click", () => {
      const seatId = boothEl.getAttribute("data-seat-id");
      const found = SEATING_INVENTORY.find(s => s.id === seatId);
      if (found) {
        currentBooking.seating = found;
        renderFloorPlan();
        renderTimeSlots();
        updateSummaryPreview();
      }
    });
  });
}

function initZoneFilters() {
  const filterBtns = document.querySelectorAll(".zone-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentBooking.activeFilter = btn.getAttribute("data-filter");
      renderFloorPlan();
    });
  });
}

// -------------------------------------------------------------
// 2. Free Date Selection (Quick Chips + Unlimited Date Picker)
// -------------------------------------------------------------
function setupDatePickers() {
  const chipsContainer = document.getElementById("date-chips");
  const dateInput = document.getElementById("custom-date-picker");
  const dateDisplay = document.getElementById("selected-date-display");

  // Set min date to today
  const today = new Date();
  const todayKey = getTodayKey();
  if (dateInput) {
    dateInput.min = todayKey;
    dateInput.value = todayKey;
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const weekend = getNextWeekend();

  const dates = [
    { label: "Today", dateObj: today, key: todayKey },
    { label: "Tomorrow", dateObj: tomorrow, key: getDateKey(tomorrow) },
    { label: "Weekend", dateObj: weekend, key: getDateKey(weekend) }
  ];

  if (chipsContainer) {
    chipsContainer.innerHTML = dates.map((d, idx) => {
      const isSel = d.key === currentBooking.dateKey;
      const dayName = d.dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
      const dayDate = d.dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      return `
        <div class="date-chip ${isSel ? 'selected' : ''}" data-date-key="${d.key}" data-display="${d.label} (${dayDate})">
          <span class="day">${d.label} (${dayName})</span>
          <span class="date-str">${dayDate}</span>
        </div>
      `;
    }).join("");

    chipsContainer.querySelectorAll(".date-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        chipsContainer.querySelectorAll(".date-chip").forEach(c => c.classList.remove("selected"));
        chip.classList.add("selected");

        currentBooking.dateKey = chip.getAttribute("data-date-key");
        const parts = currentBooking.dateKey.split("-");
        const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
        currentBooking.formattedDate = formatDisplayDate(dObj);

        if (dateInput) dateInput.value = currentBooking.dateKey;
        if (dateDisplay) dateDisplay.textContent = chip.getAttribute("data-display");

        renderFloorPlan();
        renderTimeSlots();
        updateSummaryPreview();
      });
    });
  }

  // Native Date Picker listener: allows user to pick ANY future date freely!
  if (dateInput) {
    dateInput.min = getTodayKey();
    if (!dateInput.value) dateInput.value = currentBooking.dateKey;

    dateInput.addEventListener("change", (e) => {
      if (!e.target.value) return;

      if (e.target.value < getTodayKey()) {
        alert("You cannot book a table for a past date. Please pick today or a future date.");
        e.target.value = getTodayKey();
        currentBooking.dateKey = getTodayKey();
      } else {
        currentBooking.dateKey = e.target.value;
      }

      const parts = currentBooking.dateKey.split("-");
      const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
      currentBooking.formattedDate = formatDisplayDate(dObj);

      // Deselect quick chips if custom date
      if (chipsContainer) {
        chipsContainer.querySelectorAll(".date-chip").forEach(c => {
          c.classList.toggle("selected", c.getAttribute("data-date-key") === currentBooking.dateKey);
        });
      }

      if (dateDisplay) {
        dateDisplay.textContent = dObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      }

      renderFloorPlan();
      renderTimeSlots();
      updateSummaryPreview();
    });
  }
}

function getNextWeekend() {
  const d = getNowIST();
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
}

// -------------------------------------------------------------
// 3. Time Slots & Live Booked Schedule Engine
// -------------------------------------------------------------
function renderTimeSlots() {
  const container = document.getElementById("slots-grid");
  const tabBtns = document.querySelectorAll(".slot-cat-btn");
  const hintEl = document.getElementById("slot-availability-hint");
  if (!container) return;

  const bookedList = getBookedSlotsFor(currentBooking.seating.id, currentBooking.dateKey);
  const bookedTimes = bookedList.map(b => b.time);

  const filtered = TIME_SLOTS.filter(s => {
    return currentBooking.activePeriodFilter === "all" || s.period === currentBooking.activePeriodFilter;
  });

  const availableSlots = filtered.filter(s => {
    const isPassed = isTimePassedForDate(s.time, currentBooking.dateKey);
    const isBooked = bookedTimes.includes(s.time);
    return !isPassed && !isBooked;
  });

  const freeCount = availableSlots.length;
  if (hintEl) {
    if (freeCount > 0) {
      hintEl.innerHTML = `<span style="color: #10b981; font-weight: 600;">${freeCount} available</span> • Locked once booked`;
    } else if (currentBooking.dateKey === getTodayKey()) {
      hintEl.innerHTML = `<span style="color: #f87171; font-weight: 600;"><i class="fa-solid fa-moon"></i> All slots for today have ended • Pick Tomorrow</span>`;
    } else {
      hintEl.innerHTML = `<span style="color: #f87171; font-weight: 600;">Fully Booked on this date</span>`;
    }
  }

  // If current selected time is passed or booked, pick the first valid upcoming slot
  const isCurrentPassed = isTimePassedForDate(currentBooking.timeSlot, currentBooking.dateKey);
  const isCurrentBooked = bookedTimes.includes(currentBooking.timeSlot);
  if (isCurrentPassed || isCurrentBooked || !currentBooking.timeSlot) {
    const nextFree = TIME_SLOTS.find(s => !isTimePassedForDate(s.time, currentBooking.dateKey) && !bookedTimes.includes(s.time));
    if (nextFree) {
      currentBooking.timeSlot = nextFree.time;
    } else {
      currentBooking.timeSlot = "";
    }
  }

  container.innerHTML = filtered.map(slot => {
    const isPassed = isTimePassedForDate(slot.time, currentBooking.dateKey);
    const isBooked = !isPassed && bookedTimes.includes(slot.time);
    const isSelected = !isPassed && !isBooked && slot.time === currentBooking.timeSlot;

    let slotClass = "available";
    let statusMarkup = '<i class="fa-solid fa-circle-check"></i> Free';
    let title = "Available for reservation";

    if (isPassed) {
      slotClass = "passed";
      statusMarkup = '<i class="fa-regular fa-clock"></i> Passed';
      title = "This time slot has already passed for today";
    } else if (isBooked) {
      slotClass = "booked";
      statusMarkup = '<i class="fa-solid fa-lock"></i> Booked';
      title = "Already reserved — locked for other guests";
    }

    return `
      <div class="time-slot ${slotClass} ${isSelected ? 'selected' : ''}" 
           data-slot-time="${slot.time}"
           title="${title}">
        <span class="slot-time">${slot.time}</span>
        <span class="slot-status ${slotClass}">
          ${statusMarkup}
        </span>
      </div>
    `;
  }).join("");

  // Period Tabs setup
  tabBtns.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-period") === currentBooking.activePeriodFilter);
    btn.onclick = () => {
      currentBooking.activePeriodFilter = btn.getAttribute("data-period");
      renderTimeSlots();
    };
  });

  // Available slot clicks
  container.querySelectorAll(".time-slot.available").forEach(slotEl => {
    slotEl.addEventListener("click", () => {
      container.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
      slotEl.classList.add("selected");
      currentBooking.timeSlot = slotEl.getAttribute("data-slot-time");
      updateSummaryPreview();
    });
  });

  // Passed slot clicks (Notice explaining slot has passed for today)
  container.querySelectorAll(".time-slot.passed").forEach(slotEl => {
    slotEl.addEventListener("click", () => {
      const time = slotEl.getAttribute("data-slot-time");
      alert(`The ${time} slot has already passed for today.\n\nPlease choose an upcoming time slot, or select Tomorrow to book freely!`);
    });
  });

  // Booked slot clicks (Friendly notice explaining double-booking prevention)
  container.querySelectorAll(".time-slot.booked").forEach(slotEl => {
    slotEl.addEventListener("click", () => {
      const time = slotEl.getAttribute("data-slot-time");
      alert(`Sorry, ${time} is already booked for ${currentBooking.seating.name} on ${currentBooking.formattedDate}.\n\nTo prevent conflicts, no one can book this cabin at the same time. Please select any open slot!`);
    });
  });
}

// -------------------------------------------------------------
// 4. Custom Time Picker (Pick any exact custom time freely)
// -------------------------------------------------------------
function setupCustomTimePicker() {
  const picker = document.getElementById("custom-time-picker");
  if (!picker) return;

  picker.addEventListener("change", (e) => {
    if (!e.target.value) return;
    const [hStr, mStr] = e.target.value.split(":");
    let h = parseInt(hStr, 10);
    const militaryH = h;
    const m = mStr;
    const period = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    const formatted = `${String(h).padStart(2, '0')}:${m} ${period}`;

    // Validate cafe hours 11:00 AM to 11:00 PM
    if (militaryH < 11 || militaryH > 23) {
      alert("Please choose a time during cafe hours: 11:00 AM to 11:00 PM.");
      picker.value = "";
      return;
    }

    // Validate if time has already passed for today
    if (isTimePassedForDate(formatted, currentBooking.dateKey)) {
      alert(`The time "${formatted}" has already passed for today.\n\nPlease select an upcoming time or choose Tomorrow!`);
      picker.value = "";
      return;
    }

    // Check if slot is already booked
    if (isSlotBooked(currentBooking.seating.id, currentBooking.dateKey, formatted)) {
      alert(`${formatted} is already booked for ${currentBooking.seating.name} on ${currentBooking.formattedDate}. Please choose another time.`);
      picker.value = "";
      return;
    }

    currentBooking.timeSlot = formatted;
    // Deselect standard preset chips
    document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
    updateSummaryPreview();
  });
}

// -------------------------------------------------------------
// 5. Addon Checkboxes
// -------------------------------------------------------------
function setupAddons() {
  const addonBoxes = document.querySelectorAll(".addon-box");
  addonBoxes.forEach(box => {
    const checkbox = box.querySelector("input[type='checkbox']");
    box.addEventListener("click", (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      box.classList.toggle("checked", checkbox.checked);

      const addonName = box.getAttribute("data-addon-name");
      if (checkbox.checked) {
        if (!currentBooking.addons.includes(addonName)) currentBooking.addons.push(addonName);
      } else {
        currentBooking.addons = currentBooking.addons.filter(a => a !== addonName);
      }
      updateSummaryPreview();
    });
  });
}

// -------------------------------------------------------------
// 6. Form Listeners & Submission
// -------------------------------------------------------------
function setupFormListeners() {
  const nameInput = document.getElementById("booking-name");
  const phoneInput = document.getElementById("booking-phone");
  const noteInput = document.getElementById("booking-note");
  const submitBtn = document.getElementById("btn-confirm-reservation");
  const closePassBtn = document.getElementById("pass-close-btn");

  if (nameInput) {
    nameInput.addEventListener("input", (e) => { currentBooking.name = e.target.value.trim(); });
  }
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => { currentBooking.phone = e.target.value.trim(); });
  }
  if (noteInput) {
    noteInput.addEventListener("input", (e) => { currentBooking.note = e.target.value.trim(); });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", handleBookingSubmit);
  }

  if (closePassBtn) {
    closePassBtn.addEventListener("click", () => {
      document.getElementById("booking-modal").classList.remove("active");
    });
  }
}

function updateSummaryPreview() {
  const summaryTitle = document.getElementById("summary-title");
  const summaryDetails = document.getElementById("summary-details");
  const summaryThumb = document.getElementById("summary-thumb");

  if (summaryTitle) {
    summaryTitle.textContent = `${currentBooking.seating.name} (${currentBooking.seating.category})`;
  }
  if (summaryDetails) {
    const addonText = currentBooking.addons.length > 0 ? ` • +${currentBooking.addons.length} Add-ons` : '';
    summaryDetails.textContent = `${currentBooking.formattedDate} • ${currentBooking.timeSlot}${addonText}`;
  }
  if (summaryThumb) {
    summaryThumb.src = currentBooking.seating.image;
  }
}

// -------------------------------------------------------------
// 7. Booking Submission & Pass Generation
// -------------------------------------------------------------
function handleBookingSubmit() {
  const nameInput = document.getElementById("booking-name");
  const phoneInput = document.getElementById("booking-phone");

  if (!nameInput || !nameInput.value.trim()) {
    alert("Please enter your name for the reservation.");
    if (nameInput) nameInput.focus();
    return;
  }

  if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
    alert("Please enter a valid phone number for confirmation.");
    if (phoneInput) phoneInput.focus();
    return;
  }

  // Validate if time slot has already passed
  if (!currentBooking.timeSlot || isTimePassedForDate(currentBooking.timeSlot, currentBooking.dateKey)) {
    alert(`The time slot "${currentBooking.timeSlot || 'selected'}" has already passed for ${currentBooking.formattedDate}.\n\nPlease choose an upcoming time slot, or select Tomorrow!`);
    renderTimeSlots();
    return;
  }

  // Double check if time slot was taken
  if (isSlotBooked(currentBooking.seating.id, currentBooking.dateKey, currentBooking.timeSlot)) {
    alert(`Sorry! ${currentBooking.timeSlot} on ${currentBooking.formattedDate} is already booked. Please choose an available time.`);
    renderTimeSlots();
    return;
  }

  currentBooking.name = nameInput.value.trim();
  currentBooking.phone = phoneInput.value.trim();
  currentBooking.refId = generateRefId();

  // Save into local booking registry
  addBooking({
    seatingId: currentBooking.seating.id,
    seatingName: currentBooking.seating.name,
    dateKey: currentBooking.dateKey,
    time: currentBooking.timeSlot,
    name: currentBooking.name,
    phone: currentBooking.phone,
    refId: currentBooking.refId
  });

  // Re-render floor plan & time slots so newly booked slot turns into red "Booked"
  renderFloorPlan();
  renderTimeSlots();

  // Populate Pass modal
  document.getElementById("pass-ref-id").textContent = currentBooking.refId;
  document.getElementById("pass-guest-name").textContent = currentBooking.name;
  document.getElementById("pass-seating").textContent = `${currentBooking.seating.name} • ${currentBooking.seating.category}`;
  document.getElementById("pass-date-time").textContent = `${currentBooking.formattedDate} at ${currentBooking.timeSlot}`;
  
  const addonsDisplay = currentBooking.addons.length > 0 ? currentBooking.addons.join(", ") : "Standard Dining Experience";
  document.getElementById("pass-addons").textContent = addonsDisplay;

  // Build WhatsApp URL
  const feastText = window.getSelectedFeastSummary ? window.getSelectedFeastSummary() : "";
  const waMsg = buildWhatsAppMessage(feastText);
  const waUrl = `https://wa.me/${CAFE_PHONE}?text=${encodeURIComponent(waMsg)}`;
  
  const waLinkBtn = document.getElementById("pass-whatsapp-btn");
  if (waLinkBtn) {
    waLinkBtn.href = waUrl;
  }

  // Update QR Code
  const qrImg = document.getElementById("pass-qr-image");
  if (qrImg) {
    const qrData = `BLUECAVE-RES-${currentBooking.refId}-${encodeURIComponent(currentBooking.name)}-${currentBooking.timeSlot}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${qrData}`;
  }

  // Setup Copy Ref Button
  const copyBtn = document.getElementById("btn-copy-ref");
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(currentBooking.refId).then(() => {
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied! (${currentBooking.refId})`;
        setTimeout(() => {
          copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Booking ID`;
        }, 2500);
      });
    };
  }

  // Show Modal
  const modal = document.getElementById("booking-modal");
  if (modal) {
    modal.classList.add("active");
  }
}

// -------------------------------------------------------------
// 8. Build WhatsApp Notification Message sent to Cafe Owner (6307-693972)
// -------------------------------------------------------------
function buildWhatsAppMessage(feastSummary) {
  let msg = `*NEW TABLE / CABIN RESERVATION*\n`;
  msg += `*Blue Cave Cafe Kanpur*\n\n`;
  msg += `🎫 *Booking Reference:* ${currentBooking.refId}\n`;
  msg += `👤 *Guest Name:* ${currentBooking.name}\n`;
  msg += `📞 *Contact Number:* ${currentBooking.phone}\n`;
  msg += `📅 *Date:* ${currentBooking.formattedDate}\n`;
  msg += `⏰ *Time Slot:* ${currentBooking.timeSlot}\n`;
  msg += `📍 *Selected Option:* ${currentBooking.seating.name} (${currentBooking.seating.category})\n`;
  
  if (currentBooking.addons.length > 0) {
    msg += `✨ *Special Inclusions:* ${currentBooking.addons.join(", ")}\n`;
  }
  
  if (currentBooking.note) {
    msg += `📝 *Guest Note:* ${currentBooking.note}\n`;
  }

  if (feastSummary) {
    msg += `\n🍽️ *Pre-order Wishlist:*\n${feastSummary}\n`;
  }

  msg += `\nPlease confirm my reservation slot. Looking forward to visiting Blue Cave Cafe!`;
  return msg;
}

window.currentBooking = currentBooking;
