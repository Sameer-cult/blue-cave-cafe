# Blue Cave Cafe — Kanpur

Official responsive website & interactive table/cabin booking system for **Blue Cave Cafe**, Juhi Colony, Saket Nagar, Kanpur.

- **Google Maps Listing**: [Blue Cave Cafe on Google Maps](https://maps.app.goo.gl/FhzFkEpKPFTYTrDH7)
- **Direct Phone & WhatsApp**: `+91 63076 93972` (`6307-693972`)
- **Address**: 127/991, W-1, Juhi Colony, Saket Nagar, Kanpur, Uttar Pradesh 208014 (Near Kidwai Nagar Police Station / VSICS)

---

## 🚀 Key Features

1. **Interactive Seating Floor Plan**: Visual interactive selection between Cabin A (Starlight Love Cave), Cabin B (Secret Rock Retreat), Cabin C (Neon Party Vault), and Table Zone (Board Game Lounge).
2. **Smart Time-Slot Booking Engine**: Real-time slots categorized by Lunch (11:30 AM - 2:30 PM), Sunset (4:00 PM - 6:00 PM), and Night Ambiance (7:00 PM - 10:00 PM) with live availability indicators.
3. **VIP Digital Reservation Pass with QR Code**: Generates an animated pass with unique booking ID (e.g. `#BCC-4829`) and scan-ready QR code.
4. **Direct WhatsApp Reservation Integration**: 1-Click WhatsApp button that pre-fills the guest's name, date, time slot, cabin, and add-ons and dispatches directly to **+91 63076 93972**.
5. **Interactive Mood Lighting Switcher**: Visitors can toggle the cafe's atmosphere in real time between Electric Blue, Romantic Candlelight Amber, and Cyber Neon Violet.
6. **"Build Your Cave Feast" Table Wishlist**: Interactive menu filter with 3D tilt cards and live bill estimator.
7. **Real Google Maps Photos**: Authentic photography extracted directly from their verified Google Maps listing and store presence.
8. **Real-Time Kanpur Status**: Automatically detects if the cafe is currently open or closed based on Indian Standard Time (11:00 AM – 11:00 PM).

---

## 🌐 How to Deploy to Vercel

### Method 1: Instant Deploy via Terminal (Recommended)
Run the following command in this directory:
```bash
npx vercel
```
- Follow the prompts:
  - `Set up and deploy?` Type `y`
  - `Which scope?` Select your Vercel account
  - `Link to existing project?` Type `n`
  - `Project name?` Type `blue-cave-cafe`
  - `In which directory is code located?` Press Enter (`./`)
  - Vercel will immediately build and output your live production URL!

### Method 2: Deploy via GitHub + Vercel Dashboard
1. Create a new GitHub repository: `blue-cave-cafe`.
2. Push this repo:
   ```bash
   git remote add origin https://github.com/<your-username>/blue-cave-cafe.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), select the repository, and click **Deploy**!

---

## 💻 Local Testing
To preview locally at any time:
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.
