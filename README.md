# Express + Prisma + MySQL Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
The `.env` file is already configured with:
- Username: `root`
- Password: `sankalp2006`
- Database: `classroom_db`
- Host: `localhost:3306`

Make sure your MySQL server is running.

### 3. Create Database (if it doesn't exist)
```bash
mysql -u root -p
# Enter password: sankalp2006
# Then run: CREATE DATABASE classroom_db;
```

### 4. Run Prisma Migrations
```bash
npm run prisma:migrate
```

### 5. Start the Server
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Available Scripts
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:studio` - Open Prisma Studio UI

## API Endpoints
- `GET /api/health` - Health check endpoint

## Project Structure
```
backend/
├── server.js          # Main server file
├── .env              # Environment variables
├── package.json      # Dependencies
└── prisma/
    └── schema.prisma # Database schema
```
# oo
