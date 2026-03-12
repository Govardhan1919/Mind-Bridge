# Mind-Bridge

Mind-Bridge is a comprehensive mental health support platform designed specifically for students. It bridges the gap between students seeking help and professional therapists, providing a safe and accessible environment for mental wellness.

## 🚀 Key Features

- **Student Dashboard**: Track mental wellness and upcoming sessions.
- **Therapist Dashboard**: Manage student appointments and session notes.
- **Booking System**: Seamlessly schedule one-on-one sessions with therapists.
- **Support Groups**: Join community-led groups for shared experiences and peer support.
- **Resource Center**: Access curated articles, exercises, and tools for mental well-being.
- **Admin Panel**: Manage users, therapists, and platform settings.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: Shadcn UI
- **State Management**: TanStack Query (React Query)

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Govardhan1919/Mind-Bridge.git
   cd Mind-Bridge
   ```

2. **Frontend Setup**:
   ```sh
   npm install
   npm run dev
   ```

3. **Backend Setup**:
   ```sh
   cd backend
   npm install
   # Create a .env file based on .env.example and configure DATABASE_URL
   npm run setup-db
   npm run dev
   ```

## 📄 License

This project is licensed under the ISC License.
