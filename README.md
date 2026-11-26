# NexTalk

NexTalk is a real-time chat starter with a Vite/React client and an Express,
MongoDB, and Socket.IO server. The two applications are separate npm projects,
so they can be developed and deployed independently.

## Requirements

- Node.js 20 or newer
- npm
- MongoDB (local or hosted)

## Setup

1. Install dependencies for the root scripts and each application:

   ```sh
   npm install
   npm --prefix client install
   npm --prefix server install
   ```

   Alternatively, run `npm install` from inside each project folder separately.
2. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and a
   private, randomly generated `JWT_SECRET` of at least 32 characters.
3. Copy `client/.env.example` to `client/.env` if you want to override the
   local API and Socket.IO URLs.
4. Start MongoDB, then run both applications:

   ```sh
   npm run dev
   ```

   The Vite client is available at http://localhost:5173 and the API listens on
   http://localhost:5000. To run just one application, use `npm run dev:client`
   or `npm run dev:server`.

## Architecture

- **Client:** `client/src/api/` contains the HTTP boundary; React contexts own
  authentication and the app-wide socket; `hooks/useChat.js` owns conversation
  and message data plus chat socket listeners.
- **Server:** routes/controllers handle HTTP, services contain shared business
  logic, and `sockets/` handles authenticated real-time events. Both REST and
  Socket.IO message sending use `messageService.createMessage()`.
- **Persistence:** Mongoose models represent users, conversations, and messages.
  Conversation history is indexed by conversation and newest-first creation
  time.
- **Authentication:** REST and Socket.IO authenticate using the same
  HttpOnly JWT cookie. Configure matching client/server origins when deploying.

### Message delivery

```text
MessageInput.jsx
  └─ socket.emit("message:send", { conversationId, content })
       └─ sockets/chatHandler.js
            └─ messageService.createMessage()
                 ├─ save Message and update Conversation.lastMessage
                 └─ io.to("conv:<id>").emit("message:new", message)
                      └─ hooks/useChat.js appends message to React state
```

### Transport choices

| Concern | Transport | Reason |
| --- | --- | --- |
| Signup, login, logout, current user | REST | Standard request/response and cookie auth |
| Conversation list and history | REST | Initial loads and paginated history |
| Send and receive messages | Socket.IO | Immediate bidirectional delivery |
| Typing and online status | Socket.IO | Ephemeral presence events |

## API and socket events

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`
- `GET /api/users?search=...`, `PATCH /api/users/me`
- `GET /api/conversations`, `POST /api/conversations`
- `GET /api/messages/:conversationId?limit=50&before=<date>`
- Socket client events: `conversation:join`, `message:send`,
  `typing:start`, `typing:stop`
- Socket server events: `message:new`, `typing:update`, `presence:online`,
  `presence:offline`, `message:error`

The starter provides text messages and basic typing/presence events. Validate
production origins, secrets, rate limits, and deployment settings before
exposing an instance publicly.
