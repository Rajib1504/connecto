# Connecto --- Real-Time Chat Application

A one-to-one real-time chat application built with React, TypeScript,
Express, Bun, PostgreSQL, Drizzle ORM, and Socket.IO.

## Live Demo

-   **Frontend:** https://connecto-chat-app.vercel.app/
-   **Backend:** https://connecto-chat-app-backend.onrender.com/

## Features

-   User signup and signin
-   Password hashing with bcrypt
-   JWT authentication stored in an HTTP-only cookie
-   Protected routes and session restoration
-   Registered users list with pagination/infinite scrolling
-   One-to-one conversations
-   Real-time message delivery using Socket.IO
-   PostgreSQL message persistence
-   Previous conversation history with cursor pagination
-   Message timestamps

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React
Router, Axios, Socket.IO Client, React Hot Toast, Lucide React.

**Backend:** Bun, Express, TypeScript, PostgreSQL (Neon), Drizzle ORM,
Socket.IO, JWT, bcrypt, Zod, cookie-parser.

## Project Structure

``` text
connecto/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   └── schema/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── types/
│   ├── server.ts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── layout/
    │   ├── lib/
    │   ├── pages/
    │   └── router/
    └── package.json
```

## Prerequisites

-   [Bun](https://bun.sh/)
-   PostgreSQL database (for example, [Neon](https://neon.tech/))
-   Git

## Getting Started

Clone the repository:

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

### Backend setup

``` bash
cd backend
bun install
```

Create `backend/.env`:

``` env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_random_secret_at_least_32_characters
CLIENT_URL=http://localhost:5173
```

Generate and run database migrations:

``` bash
bun run db:generate
bun run db:migrate
```

Start the backend:

``` bash
bun run dev
```

The backend listens on the configured port (5000 in this example). The
production start script is:

``` bash
bun run start
```

### Frontend setup

Open another terminal:

``` bash
cd frontend
bun install
```

Create `frontend/.env`:

``` env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

``` bash
bun run dev
```

Vite normally serves the frontend at `http://localhost:5173`.

Build the frontend:

``` bash
bun run build
```

## Environment Variables

### Backend

  -----------------------------------------------------------------------
  Variable                            Description
  ----------------------------------- -----------------------------------
  `PORT`                              Local server port. Render provides
                                      the port in deployment; do not
                                      manually set it in the Render
                                      dashboard.

  `NODE_ENV`                          `development` locally and
                                      `production` in deployment.

  `DATABASE_URL`                      PostgreSQL connection string.

  `JWT_SECRET`                        Strong JWT signing secret; use a
                                      random value of at least 32
                                      characters.

  `CLIENT_URL`                        Exact frontend origin allowed by
                                      CORS, without a trailing slash.
  -----------------------------------------------------------------------

### Frontend

  Variable         Description
  ---------------- --------------------------------------------
  `VITE_API_URL`   Backend API base URL, including `/api/v1`.

Never commit real credentials, database URLs, JWT secrets, or `.env`
files.

## API Overview

API base path: `/api/v1`

  -----------------------------------------------------------------------------------------------------
  Method                  Endpoint                                              Purpose
  ----------------------- ----------------------------------------------------- -----------------------
  `POST`                  `/auth/signup`                                        Register a user

  `POST`                  `/auth/signin`                                        Sign in and set the
                                                                                authentication cookie

  `POST`                  `/auth/logout`                                        Log out and clear the
                                                                                authentication cookie

  `GET`                   `/auth/me`                                            Get the authenticated
                                                                                user

  `GET`                   `/users?page=1&limit=20`                              Get registered users,
                                                                                excluding the current
                                                                                user

  `GET`                   `/messages/:receiverId?limit=30&before=<messageId>`   Retrieve chat history
                                                                                with optional cursor
                                                                                pagination

  `POST`                  `/messages`                                           Send and persist a
                                                                                message
  -----------------------------------------------------------------------------------------------------

Protected endpoints require the authentication cookie.

### Send message request

``` json
{
  "receiverId": 2,
  "content": "Hello!"
}
```

### Socket.IO event

After a message is successfully saved, the backend emits `new-message`
to the receiver's room. Each authenticated socket joins a room named
`user:<userId>`.

## Database

The application uses PostgreSQL with Drizzle ORM.

Main tables:

-   **users** --- user identity and authentication fields.
-   **messages** --- sender ID, receiver ID, message content, and
    creation timestamp.

Messages reference users through sender and receiver IDs. Conversations
are represented by messages exchanged between two users; the current
implementation does not require a separate conversations table.

Schema definitions and migration files are maintained in the backend
project.

## Deployment

### Backend --- Render

Live URL: https://connecto-chat-app-backend.onrender.com/

Configure the Render Web Service with:

-   **Root directory:** `backend`
-   **Build command:** `bun install`
-   **Start command:** `bun run start`

Set these environment variables in Render:

``` env
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://connecto-chat-app.vercel.app
```

Do not manually add `PORT` in the Render dashboard; Render provides it.

### Frontend --- Vercel

Live URL: https://connecto-chat-app.vercel.app/

Configure the Vercel project with:

-   **Root directory:** `frontend`
-   **Build command:** `bun run build`
-   **Output directory:** `dist`

Set this environment variable in Vercel:

``` env
VITE_API_URL=https://connecto-chat-app-backend.onrender.com/api/v1
```

Redeploy the relevant service after changing environment variables.

### Production CORS and cookies

Because the frontend and backend are hosted on different domains:

-   Backend CORS must allow the exact frontend origin and enable
    credentials.
-   Axios and Socket.IO client connections must send credentials.
-   In production, the authentication cookie must use `httpOnly: true`,
    `secure: true`, and `sameSite: "none"`.
-   Use matching cookie options when clearing the cookie during logout.

## Testing

Use two separate browser sessions:

1.  Sign in as User A in one browser.
2.  Sign in as User B in another browser (for example, an incognito
    window).
3.  Open User B's conversation in User A's browser.
4.  Send a message from User A to User B.
5.  Confirm User B receives it without refreshing.
6.  Reply from User B and confirm User A receives it instantly.
7.  Refresh both browsers and confirm previous messages load.
8.  Test logout and verify protected pages require authentication.

## Submission Checklist

-   Include frontend and backend source code.
-   Include database schema and migration files.
-   Include this `README.md`.
-   Include `.env.example` files with placeholder values only.
-   Exclude `node_modules`, build output directories, and real `.env`
    files.
-   Never publish database credentials or JWT secrets.

## Optional Features

Real-time notifications/unread counts and group chat are optional bonus
features in the assignment. They are not required for the core
one-to-one chat application.
