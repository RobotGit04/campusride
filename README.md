# CampusRide

A full-stack two-sided bike rental marketplace built for VIT AP University students.

## Live Demo

- **Frontend:** [campusride-theta.vercel.app](https://campusride-theta.vercel.app)
- **Backend:** [campusride-api-usy6.onrender.com](https://campusride-api-usy6.onrender.com)
- **GitHub:** [github.com/RobotGit04/campusride](https://github.com/RobotGit04/campusride)
- **Demo Video:** [Watch on Google Drive](https://drive.google.com/your-link-here)

## Problem Statement

VIT AP University sits far from the city. Students need bikes on weekends but have no reliable way to find them. Owners have no way to advertise availability. CampusRide solves this with a real-time two-sided marketplace connecting bike owners and student renters on campus.

## Features

### Renter

- Browse available bikes with search and filters
- Real-time availability calendar with booked dates blocked
- Book bikes for specific dates
- View booking status — Pending, Confirmed, Active, Completed
- Rate and review after rental
- Real-time notifications when booking is confirmed

### Owner

- List bikes with photos via Cloudinary
- Accept or reject booking requests
- Track earnings, commission deducted, net payout per booking
- Real-time notifications when new booking arrives

### Admin

- Platform stats — total users, bikes, bookings, active rentals
- Suspend or unsuspend users and listings
- Set custom commission percentage
- View all bookings and total commission collected

## Tech Stack

| Layer | Technology |

|-------|------------|
| Frontend | React.js + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Real-time | Socket.io |
| Storage | Cloudinary |
| Auth | JWT + bcrypt |
| Email | Nodemailer |
| Security | Helmet + express-rate-limit |
| Deploy FE | Vercel |
| Deploy BE | Render |

## Setup Instructions

### Prerequisites

- Node.js v18+
- Git

### Backend Setup

Navigate to the server folder and install dependencies:

    cd server
    npm install --legacy-peer-deps
    npm run dev

### Frontend Setup

Navigate to the client folder and install dependencies:

    cd client
    npm install --legacy-peer-deps
    npm run dev

### Environment Variables

Create a `server/.env` file with the following variables:

    PORT=5000
    CLIENT_URL=http://localhost:5173
    JWT_SECRET=your_secret
    DATABASE_URL=your_supabase_url
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    EMAIL_USER=your_gmail
    EMAIL_PASS=your_app_password

## Bonus Features Implemented

- Search and filter with instant results
- Email confirmation on booking confirmed
- Admin can set custom commission percentage
- PWA support — installable on mobile home screen

## Design

See the `/design/` folder in this repository for wireframes and UI screenshots.

## Team

Built for ACM VIT AP — Upfront Open Source Challenge
