# Expense Tracker

A full-stack expense tracking application built with React, GraphQL, and Node.js.

## Project Structure

```
expense-tracker/
├── backend/          # Backend API (GraphQL + Express)
├── frontend/         # React frontend application
├── package.json      # Root package.json for managing both projects
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   
   **Backend** (`backend/env.example` → `backend/.env`):
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Frontend** (`frontend/env.example` → `frontend/.env`):
   ```env
   VITE_NODE_ENV=development
   VITE_GRAPHQL_URL=http://localhost:5000/graphql
   ```

### Development

**Run both frontend and backend:**
```bash
npm run dev
```

**Run individually:**
```bash
# Backend only
npm run dev:backend

# Frontend only  
npm run dev:frontend
```

### Production

**Build frontend:**
```bash
npm run build:frontend
```

**Start backend:**
```bash
npm run start:backend
```

## Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build:frontend`
3. Set output directory: `frontend/dist`
4. Set environment variables in Vercel dashboard

## Environment Variables

### Backend
- `MONGO_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret for session encryption
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend
- `VITE_NODE_ENV`: Environment (development/production)
- `VITE_GRAPHQL_URL`: Backend GraphQL endpoint URL

## API Endpoints

- `GET /health` - Health check
- `POST /graphql` - GraphQL endpoint

## Technologies Used

### Backend
- Node.js
- Express
- Apollo Server (GraphQL)
- MongoDB with Mongoose
- Passport.js (Authentication)
- Express Session

### Frontend
- React
- Vite
- Apollo Client
- Tailwind CSS
- React Router
- Chart.js
- Framer Motion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request