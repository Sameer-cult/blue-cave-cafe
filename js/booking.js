/**
 * BLUE CAVE CAFE — Booking Engine Logic
 * Handles interactive floor plan, slot availability, pass generation & WhatsApp integration
 */

const CAFE_PHONE = "916307693972"; // 6307-693972 formatted for WhatsApp API

// Seating Inventory Data
const SEATING_INVENTORY = [
  {
    id: "cabin-a",
    name: "Cabin A • Starlight Love Cave",
    category: "Romantic Private Cabin",
    capacity: "2 Guests",
    desc: "Intimate private alcove draped in fairy lights & candles. Perfect for dates & anniversaries.",
    badge: "Romantic",
    badgeClass: "romantic",
    image: "assets/images/private_cabin_booth.jpg"
  },
  {
    id: "cabin-b",
    name: "Cabin B • Secret Rock Retreat",
    category: "Private Acoustic Cove",
    capacity: "2–4 Guests",
    desc: "Sound-cushioned textured cave nook for deep conversations & cozy dining.",
    badge: "Cozy Nook",
    badgeClass: "romantic",
    image: "assets/images/cabin_dining_real.jpg"
  },
  {
    id: "cabin-c",
    name: "Cabin C • Neon Party Vault",
    category: "VIP Group Celebration Cave",
    capacity: "4–8 Guests",
    desc: "Spacious private cave with customizable party neon, bluetooth sound & birthday setup.",
    badge: "Party VIP",
    badgeClass: "party",
    image: "assets/images/neon_cave_interior.jpg"
  },
  {
    id: "table-open",
    name: "Table Zone • Board Game Lounge",
    category: "Open Social Cafe",
    capacity: "2–6 Guests",
    desc: "Central cave dining table adjacent to our Uno, Ludo & board games collection.",
    badge: "Games & Coffee",
    badgeClass: "games",
    image: "assets/images/cafe_social_vibe.jpg"
  }
];

// Time Slots Data with Dynamic Availability
const TIME_SLOTS = [
  // Afternoon Chill (11:30 AM - 3:00 PM)
  { time: "11:30 AM", period: "afternoon", status: "Available", statusClass: "available" },
  { time: "12:30 PM", period: "afternoon", status: "Available", statusClass: "available" },
  { time: "01:30 PM", period: "afternoon", status: "Filling Fast", statusClass: "filling" },
  { time: "02:30 PM", period: "afternoon", status: "Available", statusClass: "available" },

  // Sunset & High Tea (4:00 PM - 6:00 PM)
  { time: "04:00 PM", period: "sunset", status: "Filling Fast", statusClass: "filling" },
  { time: "05:00 PM", period: "sunset", status: "1 Left", statusClass: "filling" },
  { time: "06:00 PM", period: "sunset", status: "Available", statusClass: "available" },

  // Evening & Night Cave Ambiance (7:00 PM - 10:00 PM)
  { time: "07:00 PM", period: "night", status: "Filling Fast", statusClass: "filling" },
  { time: "08:00 PM", period: "night", status: "1 Left", statusClass: "filling" },
  { time: "09:00 PM", period: "night", status: "Filling Fast", statusClass: "filling" },
  { time: "10:00 PM", period: "night", status: "Available", statusClass: "available" }
];

// Active State
let currentBooking = {
  seating: SEATING_INVENTORY[0],
  date: "Today",
  formattedDate: getTodayFormatted(),
  timeSlot: "07:00 PM",
  guests: 2,
  addons: [],
  name: "",
  phone: "",
  note: "",
  refId: generateRefId()
};

function getTodayFormatted() {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date().toLocaleDateString('en-IN', options);
}

function generateRefId() {
  return "BCC-" + Math.floor(1000 + Math.random() * 9000);
}

// Initialize Booking Engine on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderFloorPlan();
  renderDateChips();
  renderTimeSlots("night");
  setupGuestStepper();
  setupAddons();
  setupFormListeners();
  updateSummaryPreview();
});

// 1. Render Floor Plan
function renderFloorPlan() {
  const container = document.getElementById("floorplan-grid");
  if (!container) return;

  container.innerHTML = SEATING_INVENTORY.map((seat, index) => {
    const isSelected = seat.id === currentBooking.seating.id;
    return `
      <div class="floor-booth ${seat.id === 'cabin-c' ? 'vip-cabin' : ''} ${isSelected ? 'selected' : ''}" data-seat-id="${seat.id}">
        <div>
          <div class="booth-badge-row">
            <span class="booth-badge ${seat.badgeClass}">${seat.badge}</span>
            <span class="booth-capacity"><i class="fa-solid fa-user-group"></i> ${seat.capacity}</span>
          </div>
          <h4 class="booth-name">${seat.name}</h4>
          <p class="booth-desc">${seat.desc}</p>
        </div>
        <div class="booth-footer">
          <span>${seat.category}</span>
          <span style="color: ${isSelected ? '#10b981' : 'var(--accent-primary)'}; font-weight: 600;">
            ${isSelected ? '✓ Selected' : 'Tap to Select'}
          </span>
        </div>
      </div>
    `;
  }).join("");

  // Attach click events
  container.querySelectorAll(".floor-booth").forEach(boothEl => {
    boothEl.addEventListener("click", () => {
      const seatId = boothEl.getAttribute("data-seat-id");
      const seat = SEATING_INVENTORY.find(s => s.id === seatId);
      if (seat) {
        currentBooking.seating = seat;
        renderFloorPlan();
        updateSummaryPreview();
      }
    });
  });
}

// 2. Render Date Chips
function renderDateChips() {
  const chipsContainer = document.getElementById("date-chips");
  const dateInput = document.getElementById("custom-date-picker");
  if (!chipsContainer) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const weekend = getNextWeekend();

  const dates = [
    { label: "Today", dateObj: today },
    { label: "Tomorrow", dateObj: tomorrow },
    { label: "Day After", dateObj: dayAfter },
    { label: "Weekend", dateObj: weekend }
  ];

  chipsContainer.innerHTML = dates.map((d, idx) => {
    const isSel = idx === 0;
    const dayName = d.dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayDate = d.dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    return `
      <div class="date-chip ${isSel ? 'selected' : ''}" data-date="${dayDate}">
        <span class="day">${d.label} (${dayName})</span>
        <span class="date-str">${dayDate}</span>
      </div>
    `;
  }).join("");

  chipsContainer.querySelectorAll(".date-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chipsContainer.querySelectorAll(".date-chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      currentBooking.formattedDate = chip.getAttribute("data-date");
      if (dateInput) dateInput.value = "";
      updateSummaryPreview();
    });
  });

  if (dateInput) {
    dateInput.addEventListener("change", (e) => {
      if (e.target.value) {
        chipsContainer.querySelectorAll(".date-chip").forEach(c => c.classList.remove("selected"));
        const picked = new Date(e.target.value);
        currentBooking.formattedDate = picked.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        updateSummaryPreview();
      }
    });
  }
}

function getNextWeekend() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
}

// 3. Render Time Slots
function renderTimeSlots(periodFilter = "night") {
  const container = document.getElementById("slots-grid");
  const tabBtns = document.querySelectorAll(".slot-cat-btn");
  if (!container) return;

  // Filter slots
  const filtered = TIME_SLOTS.filter(s => periodFilter === "all" || s.period === periodFilter);

  container.innerHTML = filtered.map(slot => {
    const isSelected = slot.time === currentBooking.timeSlot;
    return `
      <div class="time-slot ${isSelected ? 'selected' : ''}" data-slot-time="${slot.time}">
        <span class="slot-time">${slot.time}</span>
        <span class="slot-status ${slot.statusClass}">${slot.status}</span>
      </div>
    `;
  }).join("");

  // Tab filtering
  tabBtns.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-period") === periodFilter);
    btn.onclick = () => renderTimeSlots(btn.getAttribute("data-period"));
  });

  // Slot click
  container.querySelectorAll(".time-slot").forEach(slotEl => {
    slotEl.addEventListener("click", () => {
      container.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
      slotEl.classList.add("selected");
      currentBooking.timeSlot = slotEl.getAttribute("data-slot-time");
      updateSummaryPreview();
    });
  });
}

// 4. Guest Stepper
function setupGuestStepper() {
  const decBtn = document.getElementById("guest-dec-btn");
  const incBtn = document.getElementById("guest-inc-btn");
  const display = document.getElementById("guest-count-display");

  if (!display) return;

  if (decBtn) {
    decBtn.addEventListener("click", () => {
      if (currentBooking.guests > 1) {
        currentBooking.guests--;
        display.textContent = `${currentBooking.guests} ${currentBooking.guests === 1 ? 'Guest' : 'Guests'}`;
        updateSummaryPreview();
      }
    });
  }

  if (incBtn) {
    incBtn.addEventListener("click", () => {
      if (currentBooking.guests < 15) {
        currentBooking.guests++;
        display.textContent = `${currentBooking.guests} Guests`;
        updateSummaryPreview();
      }
    });
  }
}

// 5. Addons
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

// 6. Form input listeners
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

// 7. Update Live Summary preview
function updateSummaryPreview() {
  const summaryTitle = document.getElementById("summary-title");
  const summaryDetails = document.getElementById("summary-details");
  const summaryThumb = document.getElementById("summary-thumb");

  if (summaryTitle) summaryTitle.textContent = currentBooking.seating.name;
  if (summaryDetails) {
    const addonText = currentBooking.addons.length > 0 ? ` • +${currentBooking.addons.length} Add-ons` : '';
    summaryDetails.textContent = `${currentBooking.formattedDate} • ${currentBooking.timeSlot} • ${currentBooking.guests} Guests${addonText}`;
  }
  if (summaryThumb) {
    summaryThumb.src = currentBooking.seating.image;
  }
}

// 8. Handle Booking Submit & Generate Holographic Pass
function handleBookingSubmit() {
  const nameInput = document.getElementById("booking-name");
  const phoneInput = document.getElementById("booking-phone");

  if (!nameInput || !nameInput.value.trim()) {
    alert("Please enter your name to book the table/cabin.");
    if (nameInput) nameInput.focus();
    return;
  }

  if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
    alert("Please enter a valid phone number for booking confirmation.");
    if (phoneInput) phoneInput.focus();
    return;
  }

  currentBooking.name = nameInput.value.trim();
  currentBooking.phone = phoneInput.value.trim();
  currentBooking.refId = generateRefId();

  // Populate Pass modal
  document.getElementById("pass-ref-id").textContent = currentBooking.refId;
  document.getElementById("pass-guest-name").textContent = currentBooking.name;
  document.getElementById("pass-seating").textContent = currentBooking.seating.name;
  document.getElementById("pass-date-time").textContent = `${currentBooking.formattedDate} at ${currentBooking.timeSlot}`;
  document.getElementById("pass-party-size").textContent = `${currentBooking.guests} ${currentBooking.guests === 1 ? 'Guest' : 'Guests'}`;
  
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

function buildWhatsAppMessage(feastSummary) {
  let msg = `*NEW TABLE & CABIN RESERVATION*\n`;
  msg += `*Blue Cave Cafe Kanpur*\n\n`;
  msg += `🎫 *Booking Reference:* ${currentBooking.refId}\n`;
  msg += `👤 *Guest Name:* ${currentBooking.name}\n`;
  msg += `📞 *Contact Number:* ${currentBooking.phone}\n`;
  msg += `📅 *Date:* ${currentBooking.formattedDate}\n`;
  msg += `⏰ *Time Slot:* ${currentBooking.timeSlot}\n`;
  msg += `🪑 *Seating Selection:* ${currentBooking.seating.name}\n`;
  msg += `👥 *Number of Guests:* ${currentBooking.guests}\n`;
  
  if (currentBooking.addons.length > 0) {
    msg += `✨ *Special Add-ons:* ${currentBooking.addons.join(", ")}\n`;
  }
  
  if (currentBooking.note) {
    msg += `📝 *Special Request:* ${currentBooking.note}\n`;
  }

  if (feastSummary) {
    msg += `\n🍽️ *Pre-order Wishlist:*\n${feastSummary}\n`;
  }

  msg += `\nPlease confirm my reservation slot. Looking forward to visiting Blue Cave Cafe!`;
  return msg;
}

// Export booking details for other modules if needed
window.currentBooking = currentBooking;
