# CareFlow AI — Intelligent Hospital Appointment & Queue Optimization System

[![React](https://img.shields.io/badge/Frontend-React_18_%2B_TypeScript-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Backend-Express_%2B_Node-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

**CareFlow AI** is a comprehensive, full-stack hospital intelligence and queue optimization platform. It transforms the conventional, tedious hospital registration and queue experience into an autonomous, AI-guided patient journey.

---

## 🚀 Key Features

### 1. 🤖 3D Animated AI Robot Doctor Concierge
- **Interactive Assistant**: Greets patients upon login with an interactive 3D robot doctor assistant.
- **Micro-Interactions**: Features natural biological breathing and hovering, dynamic ground shadow, rotating holographic floor ring, heartbeat chest LED, and clipboard scanner sheen.
- **Contextual Guidance**: Dynamically explains available hospital services on hover and responds to clicks with clinical guidance.

### 2. 🧠 Clinical AI Doctor Recommendation Engine
- **Symptom & Disease Analysis**: Evaluates patient-described symptoms across 50+ medical conditions, severity levels, and matching clinical departments.
- **Specialist Matching**: Analyzes urgency, probable diagnosis, and automatically recommends the most qualified doctor across the network with rationale and confidence scores.

### 3. 🎫 Smart Appointments & Queue Token Window
- **Digital Pass & Token Display**: Real-time consultation pass with token number, estimated wait time, room number, and doctor details.
- **Consultation Persistence & Rebooking History**: Seamlessly archives past consultations when rebooking with a new specialist without requiring logout.

### 4. 🚑 24/7 Emergency Medical & Ambulance Dispatch
- **Instant Dispatch**: Live GPS route tracking with ETA countdowns and hospital destination mapping via Leaflet & OpenStreetMap.
- **Emergency Hotlines**: Direct integration with 24/7 clinical helpdesks and emergency rooms.

### 5. 🏥 Hospital Vibe Dark Mode & Light Mode
- **Clinical Telemetry Dark Mode**: Inspired by modern ICU vital signs consoles and surgical theaters, featuring deep telemetry midnight hues (`#060d1d` to `#0b1a36`), subtle 44px clinical grids, bioluminescent teal/cyan ambient lighting, and frosted glass cards.
- **Instant Persistence**: Theme selection stored in `localStorage` with fluid transition states.

### 6. 📺 Multi-Role Experience
- **Patient Portal**: Autonomous onboarding, AI triage, appointments, and prescriptions.
- **Doctor Portal**: Real-time consultation queue, patient status toggles (In Consultation, Completed, No Show), and digital prescription writing.
- **Admin Dashboard**: Live hospital throughput, departmental wait-time analytics, and queue statistics.
- **Lobby TV Board**: Public waiting room display with audio-visual token callouts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS Design System (Glassmorphism & Neumorphism), Lucide React, Leaflet Maps.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: SQLite with `better-sqlite3` and automatic transactional seeding.

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Souvik7661/CareFlow.git
   cd CareFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173`
   - Backend API runs on `http://localhost:5001`

---

## 📄 License
MIT License. Developed for Smart India Hackathon (SIH).
