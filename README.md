💍 VitaRing — Smart Ring Heart Rate Monitor

A health monitoring web application that tracks and visualizes real-time heart rate (BPM) from a wearable ring device Built under hackathon constraints at Dakahlia Hackathon 2026

🎯 Overview
VitaRing is a health monitoring platform that reads heart rate data from a smart ring sensor, processes it in real time, and delivers live BPM readings, health zone classification, trend history, and anomaly alerts — all in a clean, medically-inspired web interface.
Built and deployed in a single session at Dakahlia Hackathon 2026

🫀 How It Works
Ring Sensor (BPM signal)
        ↓
  Web App (React / TypeScript)
        ↓
  ┌─────────────────────────────┐
  │  Real-Time BPM Display      │
  │  Health Zone Classification │
  │  Session History Chart      │
  │  Anomaly Alerts             │
  └─────────────────────────────┘
        ↓
  Supabase (data persistence)

📊 Health Zones
ZoneBPM RangeMeaning😴 Below Normal< 60May indicate bradycardia✅ Resting60 – 100Healthy resting heart rate🏃 Fat Burn100 – 140Light to moderate exercise💪 Cardio140 – 170Intense aerobic activity🔴 Peak> 170High intensity — monitor closely

✨ Features

💓 Live BPM display with animated pulse indicator
📈 Session history chart — BPM trend over time
🔔 Health alerts for abnormal readings (too high / too low)
🌙 Dark mode UI optimized for readability
📱 Fully responsive — mobile and desktop
☁️ Supabase backend — data persists across sessions


🛠️ Tech Stack
LayerTechnologyFrontendReact, TypeScript, Tailwind CSSBackend / DBSupabase (PostgreSQL + Auth)Build ToolViteTestingVitestDeploymentLovable AI platform

🚀 Getting Started
bash# Clone the repo
git clone https://github.com/svicko71/vitaring.git
cd vitaring

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key

# Start development server
npm run dev

🏆 Hackathon Context
Built at Dakahlia Hackathon 2026 under strict time constraints — conceptualized, built, and deployed live within the hackathon window. Demonstrates the ability to ship a working health-tech product under pressure.

🔮 Roadmap

 Bluetooth ring device integration (Web Bluetooth API)
 HRV (Heart Rate Variability) analysis
 Sleep tracking mode
 PDF health report export
 Doctor-sharing / telemedicine link feature
 Mobile app (React Native)


👤 Author
Youssef Salama — Computer Vision & Edge AI Engineer
LinkedIn · GitHub


⚠️ Disclaimer: VitaRing is a prototype and is not a certified medical device. Do not use for clinical diagnosis
