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
    desc: "Creamy garlic butter blend, Italian herbs, sautéed sweet corn & mushrooms with aged parmesan.",
    isVeg: true,
    isPopular: true,
    tag: "Signature Bestseller",
    price: 240
  },
  {
    id: "m2",
    category: "pastas",
    name: "Fiery Arrabbiata Red Sauce Pasta",
    desc: "Tangy slow-cooked San Marzano style tomato salsa, spicy chili flakes, bell peppers & black olives.",
    isVeg: true,
    isPopular: false,
    tag: "Spicy Italian",
    price: 220
  },
  {
    id: "m3",
    category: "pastas",
    name: "Blue Cave Special Pink Rosa Pasta",
    desc: "The ultimate harmony of rich alfredo cheese & zesty tomato marinara topped with melting mozzarella.",
    isVeg: true,
    isPopular: true,
    tag: "Chef Special",
    price: 260
  },

  // Pizzas
  {
    id: "m4",
    category: "pizzas",
    name: "Paneer Tikka Supreme Cave Pizza",
    desc: "Charred marinated paneer, diced capsicum, red onions, mozzarella overload & tandoori drizzle.",
    isVeg: true,
    isPopular: true,
    tag: "Popular Choice",
    price: 350
  },
  {
    id: "m5",
    category: "pizzas",
    name: "Classic Italian Margherita",
    desc: "Thin-crust stone baked sourdough base, rich tomato concasse, melted mozzarella & fresh basil.",
    isVeg: true,
    isPopular: false,
    tag: "Authentic",
    price: 280
  },
  {
    id: "m6",
    category: "pizzas",
    name: "Farmhouse Veggie Overload",
    desc: "Golden corn, tender mushrooms, green peppers, black olives, jalapenos and extra cheese blend.",
    isVeg: true,
    isPopular: true,
    tag: "Loaded",
    price: 320
  },

  // Shakes & Blends
  {
    id: "m7",
    category: "shakes",
    name: "Legendary KitKat Freakshake",
    desc: "Loaded chocolate shake layered with crushed KitKat bars, chocolate swirl, vanilla cream & chocolate wafer.",
    isVeg: true,
    isPopular: true,
    tag: "Must Try",
    price: 220
  },
  {
    id: "m8",
    category: "shakes",
    name: "Oreo Overload Mudslide Shake",
    desc: "Dark chocolate fudge blended with crunchy Oreos, topped with whipped cream and cookie crunch.",
    isVeg: true,
    isPopular: false,
    tag: "Chocolate Lover",
    price: 190
  },
  {
    id: "m9",
    category: "shakes",
    name: "Handcrafted Cold Coffee Float",
    desc: "Fresh pulled double-shot espresso blended with chilled milk and topped with creamy vanilla ice cream.",
    isVeg: true,
    isPopular: true,
    tag: "Crowd Favorite",
    price: 160
  },

  // Mocktails & Coolers
  {
    id: "m10",
    category: "drinks",
    name: "Blue Cave Ocean Curacao Mojito",
    desc: "Signature electric blue refresher with lemon zest, fresh mint leaves, cane sugar & sparkling soda.",
    isVeg: true,
    isPopular: true,
    tag: "Cafe Signature",
    price: 150
  },
  {
    id: "m11",
    category: "drinks",
    name: "Classic Fresh Mint Mojito",
    desc: "Muddled fresh garden mint, juicy lime wedges, brown sugar syrup and ice cold effervescent fizz.",
    isVeg: true,
    isPopular: false,
    tag: "Refreshing",
    price: 130
  },
  {
    id: "m12",
    category: "drinks",
    name: "Crisp Green Apple Sparkler",
    desc: "Tart green apple essence, tangy citrus squeeze and fizzy sparkling soda with crushed ice.",
    isVeg: true,
    isPopular: false,
    tag: "Tangy Chill",
    price: 140
  },

  // Quick Bites & Starters
  {
    id: "m13",
    category: "bites",
    name: "Cheesy Peri-Peri Loaded Fries",
    desc: "Golden crispy skin-on potato fries dusted in spicy peri-peri seasoning and drenched in melted cheese sauce.",
    isVeg: true,
    isPopular: true,
    tag: "Bestseller",
    price: 180
  },
  {
    id: "m14",
    category: "bites",
    name: "Crispy Cottage Cheese Burger",
    desc: "Crispy coated paneer patty, chipotle aioli, iceberg lettuce, tomatoes & onions in a toasted brioche bun.",
    isVeg: true,
    isPopular: false,
    tag: "Hearty Snack",
    price: 160
  },
  {
    id: "m15",
    category: "bites",
    name: "Nachos Grande with Cheesy Salsa",
    desc: "Crunchy corn tortilla chips served with spicy salsa dip, sour cream and melted cheddar cheese drizzle.",
    isVeg: true,
    isPopular: true,
    tag: "Perfect with Games",
    price: 210
  }
];

// Table Feast Wishlist State
let selectedFeast = [];

document.addEventListener("DOMContentLoaded", () => {
  initMoodSwitcher();
  initLiveKanpurStatus();
  renderMenu("all");
  initMenuTabs();
  init3DTilt();
  initMobileMenu();
  initQuickViewModal();
  initAmbientCanvas();
});

// 0. Ambient Canvas (Gentle Particles/Steam Drift)
function initAmbientCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener("resize", resize);
  resize();

  // Create initial particles
  const numParticles = window.innerWidth < 768 ? 20 : 40; // less on mobile
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: (Math.random() * 0.5 + 0.1) * -1, // drift up
      speedX: (Math.random() * 0.4 - 0.2), // slight horizontal drift
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Get current theme color for particles
    const theme = document.documentElement.getAttribute("data-theme");
    let r, g, b;
    if (theme === "amber") { r=255; g=183; b=3; }
    else if (theme === "violet") { r=247; g=37; b=133; }
    else { r=0; g=212; b=255; } // default blue

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      // Reset if off screen
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

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
function renderMenu(category = "all", skipAnimation = false) {
  const container = document.getElementById("menu-grid");
  if (!container) return;

  const items = category === "all" ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === category);

  if (skipAnimation) {
    renderCards(container, items, false);
    return;
  }

  // Apply out animation first
  const existingCards = container.querySelectorAll('.menu-card');
  if (existingCards.length > 0) {
    existingCards.forEach(card => card.classList.add('filtering-out'));

    setTimeout(() => {
      renderCards(container, items);
    }, 300); // match transition duration
  } else {
    renderCards(container, items);
  }
}

function renderCards(container, items, animate = true) {
  container.innerHTML = items.map(item => {
    const qty = selectedFeast.filter(f => f.id === item.id).length;
    return `
      <div class="menu-card tilt-card ${animate ? 'filtering-in' : ''}" data-item-id="${item.id}">
        <div class="menu-card-top">
          <span class="diet-tag" title="100% Vegetarian"></span>
          ${item.isPopular ? `<span class="popular-badge">★ ${item.tag}</span>` : `<span class="sub-tag">${item.tag}</span>`}
        </div>
        <div class="menu-item-content" onclick="openQuickView('${item.id}')" style="cursor: pointer; flex: 1;">
          <h4 class="menu-item-title">${item.name}</h4>
          <p class="menu-item-desc">${item.desc}</p>
          <p class="menu-item-price" style="font-weight: 700; color: var(--accent-primary); margin-bottom: 10px;">₹${item.price}</p>
        </div>
        <div class="menu-card-bottom">
          <span class="menu-item-badge"><i class="fa-solid fa-utensils"></i> Add to Table</span>
          <button class="add-feast-btn" onclick="addToFeast('${item.id}', event)" title="Add to table wishlist">
            ${qty > 0 ? `<b>${qty}</b>` : `+`}
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Re-apply 3D tilt
  init3DTilt();

  if (animate) {
    // Remove filtering-in class after animation
    setTimeout(() => {
      const cards = container.querySelectorAll('.menu-card');
      cards.forEach(card => card.classList.remove('filtering-in'));
    }, 400);
  }
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
window.addToFeast = function(itemId, event, customOptions = null, customPrice = null) {
  if (event) {
    event.stopPropagation(); // prevent opening modal if clicking +
  }

  const item = MENU_ITEMS.find(m => m.id === itemId);
  if (!item) return;

  const newItem = {
    id: itemId,
    name: item.name,
    basePrice: item.price,
    finalPrice: customPrice !== null ? customPrice : item.price,
    options: customOptions || {}
  };

  selectedFeast.push(newItem);
  showToast(`${item.name} added to wishlist!`);

  updateFeastBar();
  renderMenu(document.querySelector(".menu-tab.active")?.getAttribute("data-category") || "all", true);
};

function updateFeastBar() {
  const bar = document.getElementById("feast-summary-bar");
  const countEl = document.getElementById("feast-item-count");

  const totalCount = selectedFeast.length;

  if (bar && countEl) {
    if (totalCount > 0) {
      bar.classList.add("active");
      countEl.textContent = `${totalCount} item${totalCount > 1 ? 's' : ''} in Feast Wishlist`;

      // Trigger bounce animation
      bar.classList.remove("bounce");
      void bar.offsetWidth; // Trigger reflow to restart animation
      bar.classList.add("bounce");
    } else {
      bar.classList.remove("active");
    }
  }

  updateCartDrawerUI();
}

// Cart Drawer Logic
window.toggleCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
    if (drawer.classList.contains('active')) {
      updateCartDrawerUI();
    }
  }
};

window.removeFromCart = function(index) {
  selectedFeast.splice(index, 1);
  updateFeastBar();
  renderMenu(document.querySelector(".menu-tab.active")?.getAttribute("data-category") || "all", true);
};

function updateCartDrawerUI() {
  const itemsContainer = document.getElementById('cart-drawer-items');
  const subtotalEl = document.getElementById('cart-subtotal');

  if (!itemsContainer || !subtotalEl) return;

  if (selectedFeast.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-cart-arrow-down" style="font-size: 3rem; color: var(--border-glow); margin-bottom: 1rem;"></i>
        <p>Your feast wishlist is empty.</p>
      </div>
    `;
    subtotalEl.textContent = '₹0';
    return;
  }

  let subtotal = 0;
  itemsContainer.innerHTML = selectedFeast.map((item, index) => {
    subtotal += item.finalPrice;
    const optsStr = Object.keys(item.options).length > 0
      ? Object.entries(item.options).map(([k,v])=>v).join(', ')
      : 'Standard';

    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-opts">${optsStr}</span>
        </div>
        <div class="cart-item-price">
          <span>₹${item.finalPrice}</span>
          <button class="cart-close-btn" style="font-size: 0.9rem;" onclick="removeFromCart(${index})" title="Remove item">✕</button>
        </div>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = `₹${subtotal}`;
}

// Toast Notifications
function showToast(message, icon = 'fa-check-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300); // Wait for transition
  }, 3000);
}

// Quick View Modal Logic
let currentModalItem = null;
let currentModalPrice = 0;
let modalOptionsCost = 0;

function initQuickViewModal() {
  const modal = document.getElementById('quick-view-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const addBtn = document.getElementById('modal-add-to-feast');
  const optionChips = document.querySelectorAll('.option-chip');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (currentModalItem) {
        // Collect selected options
        const customOptions = {};
        const activeChips = document.querySelectorAll('.option-chip.active');
        activeChips.forEach(chip => {
          const group = chip.closest('.option-group');
          if (group && group.style.display !== 'none') {
             const groupName = group.querySelector('label').textContent;
             customOptions[groupName] = chip.textContent.split(' (+')[0]; // Store base name
          }
        });

        const finalPrice = currentModalPrice + modalOptionsCost;
        addToFeast(currentModalItem.id, null, customOptions, finalPrice);
        modal.classList.remove('active');
      }
    });
  }

  optionChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const group = e.target.closest('.option-group');
      const siblings = group.querySelectorAll('.option-chip');
      siblings.forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');

      calculateModalPrice();
    });
  });
}

window.openQuickView = function(itemId) {
  const item = MENU_ITEMS.find(m => m.id === itemId);
  if (!item) return;

  currentModalItem = item;
  currentModalPrice = item.price;

  document.getElementById('modal-item-title').textContent = item.name;
  document.getElementById('modal-item-desc').textContent = item.desc;

  // Reset options to defaults
  document.querySelectorAll('.option-group').forEach(group => {
    const chips = group.querySelectorAll('.option-chip');
    chips.forEach(c => c.classList.remove('active'));
    if (chips.length > 0) chips[0].classList.add('active');
  });

  // Conditionally hide milk and sweetness for non-drinks
  const isDrink = item.category === 'shakes' || item.category === 'drinks';
  const milkGroup = document.getElementById('milk-options-group');
  const sweetnessGroup = document.getElementById('sweetness-options-group');

  if (milkGroup) milkGroup.style.display = isDrink ? 'block' : 'none';
  if (sweetnessGroup) sweetnessGroup.style.display = isDrink ? 'block' : 'none';

  calculateModalPrice();

  const modal = document.getElementById('quick-view-modal');
  modal.classList.add('active');
};

function calculateModalPrice() {
  modalOptionsCost = 0;
  const activeChips = document.querySelectorAll('.option-chip.active');
  activeChips.forEach(chip => {
    // Only add cost if the group is visible
    const group = chip.closest('.option-group');
    if (!group || group.style.display !== 'none') {
      modalOptionsCost += parseInt(chip.getAttribute('data-price') || 0);
    }
  });

  const totalPrice = currentModalPrice + modalOptionsCost;
  document.getElementById('modal-total-price').textContent = `₹${totalPrice}`;
}

// Helper to export feast summary to booking WhatsApp message
window.getSelectedFeastSummary = function() {
  let summary = [];

  // Group by exact item configuration to show quantities
  const grouped = {};
  selectedFeast.forEach(item => {
    const optsStr = Object.keys(item.options).length > 0
      ? ` (${Object.entries(item.options).map(([k,v])=>v).join(', ')})`
      : '';
    const key = `${item.name}${optsStr}`;
    grouped[key] = (grouped[key] || 0) + 1;
  });

  Object.entries(grouped).forEach(([desc, qty]) => {
    summary.push(`• ${qty}x ${desc}`);
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
      nav.classList.toggle("nav-open");
    });

    // Auto-close menu when tapping any link
    nav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
      });
    });
  }
}
