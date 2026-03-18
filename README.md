# CampusRide 🚲

A full-stack two-sided bike rental marketplace built for VIT AP University students.

## Live Demo
- Frontend: [coming soon]
- Backend: [coming soon]

## Features

### Renter
- Browse available bikes with search and filters
- Real-time availability calendar
- Book bikes for specific dates
- View booking status and history
- Rate and review after rental

### Owner
- List bikes with photos
- Accept or reject booking requests
- Track earnings and commission
- Real-time booking notifications

### Admin
- View platform stats
- Manage users and listings
- Set custom commission rate

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Real-time | Socket.io |
| Storage | Cloudinary |
| Auth | JWT + bcrypt |
| Email | Nodemailer |
| Deploy FE | Vercel |
| Deploy BE | Render |

## Setup Instructions

### Prerequisites
- Node.js v18+
- Git

### Backend
```bash
cd server
npm install
# Add .env file with required variables
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Environment Variables

**server/.env**
```
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret
DATABASE_URL=your_supabase_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
```

## Screenshots
[Add screenshots here]

## Team
Built for ACM VIT AP — Upfront Open Source Challenge