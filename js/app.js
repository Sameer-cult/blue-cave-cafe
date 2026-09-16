/**
 * BLUE CAVE CAFE — Core Application Script
 * Theme controller, Kanpur live status, menu wishlist, 3D tilt effects
 */

// Curated Menu Inventory
const MENU_ITEMS = [
  // Pastas
  {
    id: "m1",
    category: "pastas",
    name: "Classic White Sauce Alfredo Penne",
    desc: "Creamy garlic butter blend, Italian herbs, sautéed sweet corn & mushrooms with aged parmesan. (Customer #1 Favorite)",
    isVeg: true,
    isPopular: true,
    tag: "Signature Bestseller"
  },
  {
    id: "m2",
    category: "pastas",
    name: "Fiery Arrabbiata Red Sauce Pasta",
    desc: "Tangy slow-cooked San Marzano style tomato salsa, spicy chili flakes, bell peppers & black olives.",
    isVeg: true,
    isPopular: false,
    tag: "Spicy Italian"
  },
  {
    id: "m3",
    category: "pastas",
    name: "Blue Cave Special Pink Rosa Pasta",
    desc: "The ultimate harmony of rich alfredo cheese & zesty tomato marinara topped with melting mozzarella.",
    isVeg: true,
    isPopular: true,
    tag: "Chef Special"
  },

  // Pizzas
  {
    id: "m4",
    category: "pizzas",
    name: "Paneer Tikka Supreme Cave Pizza",
    desc: "Charred marinated paneer, diced capsicum, red onions, mozzarella overload & tandoori drizzle.",
    isVeg: true,
    isPopular: true,
    tag: "Popular Choice"
  },
  {
    id: "m5",
    category: "pizzas",
    name: "Classic Italian Margherita",
    desc: "Thin-crust stone baked sourdough base, rich tomato concasse, melted mozzarella & fresh basil.",
    isVeg: true,
    isPopular: false,
    tag: "Authentic"
  },
  {
    id: "m6",
    category: "pizzas",
    name: "Farmhouse Veggie Overload",
    desc: "Golden corn, tender mushrooms, green peppers, black olives, jalapenos and extra cheese blend.",
    isVeg: true,
    isPopular: true,
    tag: "Loaded"
  },

  // Shakes & Blends
  {
    id: "m7",
    category: "shakes",
    name: "Legendary KitKat Freakshake",
    desc: "Loaded chocolate shake layered with crushed KitKat bars, chocolate swirl, vanilla cream & chocolate wafer.",
    isVeg: true,
    isPopular: true,
    tag: "Must Try"
  },
  {
    id: "m8",
    category: "shakes",
    name: "Oreo Overload Mudslide Shake",
    desc: "Dark chocolate fudge blended with crunchy Oreos, topped with whipped cream and cookie crunch.",
    isVeg: true,
    isPopular: false,
    tag: "Chocolate Lover"
  },
  {
    id: "m9",
    category: "shakes",
    name: "Handcrafted Cold Coffee Float",
    desc: "Fresh pulled double-shot espresso blended with chilled milk and topped with creamy vanilla ice cream.",
    isVeg: true,
    isPopular: true,
    tag: "Crowd Favorite"
  },

  // Mocktails & Coolers
  {
    id: "m10",
    category: "drinks",
    name: "Blue Cave Ocean Curacao Mojito",
    desc: "Signature electric blue refresher with lemon zest, fresh mint leaves, cane sugar & sparkling soda.",
    isVeg: true,
    isPopular: true,
    tag: "Cafe Signature"
  },
  {
    id: "m11",
    category: "drinks",
    name: "Classic Fresh Mint Mojito",
    desc: "Muddled fresh garden mint, juicy lime wedges, brown sugar syrup and ice cold effervescent fizz.",
    isVeg: true,
    isPopular: false,
    tag: "Refreshing"
  },
  {
    id: "m12",
    category: "drinks",
    name: "Crisp Green Apple Sparkler",
    desc: "Tart green apple essence, tangy citrus squeeze and fizzy sparkling soda with crushed ice.",
    isVeg: true,
    isPopular: false,
    tag: "Tangy Chill"
  },

  // Quick Bites & Starters
  {
    id: "m13",
    category: "bites",
    name: "Cheesy Peri-Peri Loaded Fries",
    desc: "Golden crispy skin-on potato fries dusted in spicy peri-peri seasoning and drenched in melted cheese sauce.",
    isVeg: true,
    isPopular: true,
    tag: "Bestseller"
  },
  {
    id: "m14",
    category: "bites",
    name: "Crispy Cottage Cheese Burger",
    desc: "Crispy coated paneer patty, chipotle aioli, iceberg lettuce, tomatoes & onions in a toasted brioche bun.",
    isVeg: true,
    isPopular: false,
    tag: "Hearty Snack"
  },
  {
    id: "m15",
    category: "bites",
    name: "Nachos Grande with Cheesy Salsa",
    desc: "Crunchy corn tortilla chips served with spicy salsa dip, sour cream and melted cheddar cheese drizzle.",
    isVeg: true,
    isPopular: true,
    tag: "Perfect with Games"
  }
];

// Table Feast Wishlist State
let selectedFeast = {};

document.addEventListener("DOMContentLoaded", () => {
  initMoodSwitcher();
  initLiveKanpurStatus();
  renderMenu("all");
  initMenuTabs();
  init3DTilt();
  initMobileMenu();
});

// 1. Interactive Mood Lighting Switcher
function initMoodSwitcher() {
  const moodBtns = document.querySelectorAll(".mood-btn");
  moodBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-set-theme");
      moodBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (theme === "default") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
    });
  });
}

// 2. Real-time Cafe Open Status (Kanpur Time 11:00 AM – 11:00 PM)
function initLiveKanpurStatus() {
  const statusEl = document.getElementById("live-status-pill");
  const hoursDesc = document.getElementById("hours-status-text");

  function update() {
    // Current time in Indian Standard Time (UTC+5.5)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    // Cafe hours: 11:00 (11) to 23:00 (23)
    const isOpen = (hours >= 11 && hours < 23);

    if (statusEl) {
      if (isOpen) {
        statusEl.innerHTML = `<span class="pulse-dot"></span> Open Now • Closes 11:00 PM`;
        statusEl.style.color = "#34d399";
        statusEl.style.borderColor = "rgba(16, 185, 129, 0.3)";
      } else {
        statusEl.innerHTML = `<span class="pulse-dot" style="background: #fbbf24; box-shadow: 0 0 10px #fbbf24;"></span> Closed Now • Opens at 11:00 AM`;
        statusEl.style.color = "#fbbf24";
        statusEl.style.borderColor = "rgba(251, 191, 36, 0.3)";
      }
    }

    if (hoursDesc) {
      hoursDesc.textContent = isOpen 
        ? `Open today until 11:00 PM • Serving in Saket Nagar, Kanpur`
        : `Currently closed • Opens at 11:00 AM tomorrow`;
    }
  }

  update();
  setInterval(update, 60000); // Check every minute
}

// 3. Render Menu Items
function renderMenu(category = "all") {
  const container = document.getElementById("menu-grid");
  if (!container) return;

  const items = category === "all" ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === category);

  container.innerHTML = items.map(item => {
    const qty = selectedFeast[item.id] || 0;
    return `
      <div class="menu-card tilt-card" data-item-id="${item.id}">
        <div class="menu-card-top">
          <span class="diet-tag" title="100% Vegetarian"></span>
          ${item.isPopular ? `<span class="popular-badge">★ ${item.tag}</span>` : `<span class="sub-tag">${item.tag}</span>`}
        </div>
        <div>
          <h4 class="menu-item-title">${item.name}</h4>
          <p class="menu-item-desc">${item.desc}</p>
        </div>
        <div class="menu-card-bottom">
          <span class="menu-item-badge"><i class="fa-solid fa-utensils"></i> Add to Table</span>
          <button class="add-feast-btn" onclick="addToFeast('${item.id}')" title="Add to table wishlist">
            ${qty > 0 ? `<b>${qty}</b>` : `+`}
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Re-apply 3D tilt
  init3DTilt();
}

// 4. Menu Tabs Filter
function initMenuTabs() {
  const tabs = document.querySelectorAll(".menu-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderMenu(tab.getAttribute("data-category"));
    });
  });
}

// 5. Build Your Cave Feast Wishlist
window.addToFeast = function(itemId) {
  selectedFeast[itemId] = (selectedFeast[itemId] || 0) + 1;
  updateFeastBar();
  renderMenu(document.querySelector(".menu-tab.active")?.getAttribute("data-category") || "all");
};

function updateFeastBar() {
  const bar = document.getElementById("feast-summary-bar");
  const countEl = document.getElementById("feast-item-count");

  let totalCount = 0;
  Object.entries(selectedFeast).forEach(([id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === id);
    if (item && qty > 0) {
      totalCount += qty;
    }
  });

  if (bar && countEl) {
    if (totalCount > 0) {
      bar.classList.add("active");
      countEl.textContent = `${totalCount} item${totalCount > 1 ? 's' : ''} in Feast Wishlist`;
    } else {
      bar.classList.remove("active");
    }
  }
}

// Helper to export feast summary to booking WhatsApp message
window.getSelectedFeastSummary = function() {
  let summary = [];

  Object.entries(selectedFeast).forEach(([id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === id);
    if (item && qty > 0) {
      summary.push(`• ${qty}x ${item.name}`);
    }
  });

  if (summary.length === 0) return "";
  return summary.join("\n");
};

// 6. Interactive 3D Card Tilt Effect
function init3DTilt() {
  const cards = document.querySelectorAll(".tilt-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

// 7. Mobile Navigation Toggle
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isVisible = nav.style.display === "flex";
      nav.style.display = isVisible ? "none" : "flex";
      nav.style.flexDirection = "column";
      nav.style.position = "absolute";
      nav.style.top = "80px";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.background = "rgba(6, 9, 17, 0.98)";
      nav.style.padding = "24px";
      nav.style.borderBottom = "1px solid var(--border-subtle)";
    });
  }
}
