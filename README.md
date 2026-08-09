# Taskpods

Taskpods is a modern, minimal, and highly professional task management web application designed to help you stay organized and boost productivity. 

Built with an ultra-clean UI, Taskpods focuses on speed, clarity, and a seamless user experience, utilizing a sleek monochromatic color palette with vibrant green (`#4CBB17`) accents and subtle glassmorphism effects.

## 🚀 Features

- **Modern Dashboard:** A unified view of your entire workspace, complete with task overviews, priority counts, and recent activity.
- **Task Management:** Create, edit, and organize tasks with ease. Set due dates, track progress, and assign priorities (Low, Medium, High).
- **Minimalist Aesthetic:** A distraction-free, light-mode interface inspired by premium design systems, featuring custom SVG icons and frosted glass overlays.
- **Responsive Design:** A fully responsive layout that looks and feels incredible on both desktop and mobile devices.
- **Dynamic Animations:** Smooth transitions and interactions powered by Framer Motion.
- **Smart Filtering & Sorting:** Instantly filter tasks by priority or due date, and easily sort completed tasks.

## 🛠 Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **State/Routing:** React Router DOM
- **HTTP Client:** Axios

### Backend
- **Environment:** Node.js + Express
- **Database ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)

## 🎨 Design Philosophy

Taskpods deviates from traditional heavy designs by adopting a **"Minimal Glass"** concept:
- **Distraction-Free:** Solid backgrounds, minimal elevations, and clean typography.
- **Targeted Color:** Utilizing a single vibrant green (`#4CBB17`) to indicate primary actions, selections, and important metrics.
- **Glassmorphism Elements:** Modal overlays, the navigation bar, and profile cards utilize a frosted glass effect (`backdrop-blur-md` with `bg-white/70`) to create depth without clutter.

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- Database (PostgreSQL / MongoDB) configured for Prisma

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ARokad-X/Taskpod.git
   cd Taskpod
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   # Configure your .env file with DATABASE_URL and JWT secrets
   npx prisma generate
   npx prisma db push
   npm start
   ```

3. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   # Configure your .env with VITE_API_URL=http://localhost:4000
   npm run dev
   ```

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
