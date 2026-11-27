# NexTalk

NexTalk is a real-time messaging application built using the MERN stack and Socket.IO. It allows users to communicate through chat, with support for online status and typing indicators.

The project has two separate applications: a React frontend and a Node.js backend. Both can be developed and deployed independently.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Real-time communication:** Socket.IO
- **Authentication:** JWT with HttpOnly cookies

## Prerequisites

Make sure you have the following installed:

- Node.js 20 or later
- npm
- MongoDB (local installation or MongoDB Atlas)

## Getting Started

**1. Clone the repository**

```sh
git clone <your-repository-url>
cd NexTalk
```

**2. Install dependencies**

Run these commands from the project root:

```sh
npm install
npm --prefix client install
npm --prefix server install
```

**3. Configure environment variables**

Create a `.env` file inside the `server` directory using `.env.example` as a reference.

Add your MongoDB connection string and a secure JWT secret of at least 32 characters.
Set `CLIENT_URL` to a comma-separated list of allowed frontend origins, such as
`http://localhost:5173,https://nex-talk-theta.vercel.app`. Configure this variable
in the backend hosting environment as well as in the local `.env` file.

You can also create `client/.env` using the provided example file if you need to change the API or Socket.IO URLs.

**4. Start the application**

Make sure MongoDB is running, then execute:

```sh
npm run dev
```

The application will be available at:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

To start the frontend or backend separately:

```sh
npm run dev:client
npm run dev:server
```

## Project Structure

```text
NexTalk/
├── client/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── socket/
│       └── utils/
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── sockets/
│       └── utils/
└── package.json
```

## How It Works

The frontend communicates with the backend through REST APIs and Socket.IO.

- **Authentication:** Handles signup, login, logout, and user sessions.
- **Conversations:** Loads conversation lists and message history through REST APIs.
- **Messaging:** Uses Socket.IO to send and receive messages in real time.
- **Typing status:** Notifies other users when someone is typing.
- **Online status:** Keeps track of users connecting and disconnecting.

The backend handles API requests through routes and controllers. Shared business logic is maintained in services, while Socket.IO handles real-time events.

MongoDB stores user accounts, conversations, and messages using Mongoose models.

## Message Flow

When a user sends a message, the following process takes place:

```text
MessageInput.jsx
      |
      v
useChat.sendMessage()
      |
      v
socket.emit("message:send")
      |
      v
sockets/chatHandler.js
      |
      v
messageService.createMessage()
      |
      v
Save message in MongoDB
      |
      v
Emit "message:new" to conversation room
      |
      v
hooks/useChat.js
      |
      v
Update messages in React
```

Both REST and Socket.IO message sending use the same `messageService.createMessage()` function.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register a user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/users` | Search users |
| PATCH | `/api/users/me` | Update profile |
| GET | `/api/conversations` | Get conversations |
| POST | `/api/conversations` | Create a conversation |
| GET | `/api/messages/:conversationId` | Get conversation messages |
| POST | `/api/messages/:conversationId` | Send a message |

## Socket.IO Events

**Client to server:**

- `conversation:join`
- `message:send`
- `typing:start`
- `typing:stop`

**Server to client:**

- `message:new`
- `typing:update`
- `presence:online`
- `presence:offline`
- `message:error`

## Authentication and Security

The application uses JWT authentication with HttpOnly cookies. The same authentication mechanism is used for REST API requests and Socket.IO connections.

Before deploying the application, configure the allowed origins, environment variables, database credentials, and security settings properly.

## Future Improvements

The application can be extended with additional features such as file sharing, group chats, message reactions, and notifications.
