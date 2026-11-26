# Function Use Cases

This guide explains the main functions by the job they do in NexTalk. It
describes the existing code; it does not add comments to source files or change
how the application behaves.

## How a request moves through the app

- A browser page calls a client API function or emits a Socket.IO event.
- An API request reaches a server route, passes authentication when required,
  and is handled by a controller.
- Controllers use services for shared application logic and return a response.
- Socket events use the same message service as the HTTP API where applicable.

## Client

### App and account

- [`App`](../client/src/App.jsx) sets up the app-wide providers and routes.
- `AppRoutes` in the same file chooses the page for each URL and protects
  signed-in pages.
- [`AuthProvider`](../client/src/context/AuthContext.jsx) keeps the current
  user in shared state, restores the session, and exposes login, signup, and
  logout actions.
- [`useAuth`](../client/src/hooks/useAuth.js) lets components access that
  shared authentication state and its actions.
- [`getMe`, `login`, `signup`, and `logout`](../client/src/api/authApi.js)
  make the corresponding account API requests.
- `submit` in [`Login.jsx`](../client/src/pages/Login.jsx) and
  [`Register.jsx`](../client/src/pages/Register.jsx) sends the form data through
  the authentication actions and handles the result.

### Conversations and messages

- [`useChat`](../client/src/hooks/useChat.js) owns the conversation and message
  state for the chat screen. It loads conversations and history, listens for
  incoming messages and typing updates, and exposes actions to open a
  conversation, send a message, and announce typing.
- [`getConversations`, `createConversation`, and `getMessages`](../client/src/api/conversationApi.js)
  fetch the conversation list, start or find a direct conversation, and load
  message history.
- [`searchUsers` and `updateProfile`](../client/src/api/userApi.js) search for
  other users and save profile changes.
- `handleSearch` and `startConversation` in
  [`Sidebar.jsx`](../client/src/components/chat/Sidebar.jsx) support finding a
  person and opening a conversation with them.
- `submit` and `updateContent` in
  [`MessageInput.jsx`](../client/src/components/chat/MessageInput.jsx) send the
  typed message and keep the input content in sync with typing notifications.
- [`Chat.jsx`](../client/src/pages/Chat.jsx) connects the chat state to the
  page layout and the selected conversation.
- `ChatWindow`, `ConversationItem`, `MessageBubble`, `MessageList`,
  `TypingIndicator`, `Avatar`, `EmptyState`, and `Loader` are display
  components. They render chat content, status, and reusable UI; they do not
  own the server-side business rules.

### Live connection

- [`createSocket`](../client/src/socket/socket.js) creates one credentialed
  Socket.IO client for the browser.
- [`SocketProvider`](../client/src/context/SocketContext.jsx) connects that
  socket and keeps online-user state shared across the app.
- [`useSocket`](../client/src/hooks/useSocket.js) gives components access to
  the shared socket.

## Server

### Account and access

- `signup`, `login`, and `getMe` in
  [`authController.js`](../server/src/controllers/authController.js) translate
  account HTTP requests into service calls and HTTP responses. `logout` clears
  the authentication cookie.
- `signup`, `login`, and `getMe` in
  [`authService.js`](../server/src/services/authService.js) validate account
  data, hash or check passwords, and return the user information needed by the
  app.
- [`protect`](../server/src/middleware/authMiddleware.js) checks the
  authentication cookie and attaches the signed-in user to the request.
- [`generateToken` and `setAuthCookie`](../server/src/utils/generateToken.js)
  create the JWT and put it in the browser's authentication cookie.

### Users and conversations

- [`searchUsers` and `updateProfile`](../server/src/controllers/userController.js)
  handle the user search and profile-update API requests.
- [`getConversations`, `createConversation`, and `getMessages`](../server/src/controllers/conversationController.js)
  handle conversation-list, conversation-creation, and message-history
  requests.
- [`listConversations` and `findOrCreateConversation`](../server/src/services/conversationService.js)
  retrieve a user's conversations and find or create a direct conversation.

### Messages

- [`createMessage`](../server/src/services/messageService.js) checks access and
  message content, saves a message, and updates the conversation's latest
  message.
- `getMessages` in the same file checks access and returns a page of history.
- `markAsRead` records that a participant has read the messages.
- `requireParticipant` is the shared access check used by those service
  functions to make sure the conversation exists and belongs to the user.
- [`sendMessage`](../server/src/controllers/messageController.js) handles the
  HTTP message-send request by calling the message service.

### Live events and shared helpers

- [`initSocket`](../server/src/sockets/index.js) creates the Socket.IO server,
  installs socket authentication, and connects incoming sockets to the chat
  handlers.
- [`authenticateSocket`](../server/src/sockets/authSocket.js) verifies the
  browser's authentication cookie before allowing a socket connection.
- [`registerChatHandlers`](../server/src/sockets/chatHandler.js) joins users
  to conversation rooms and handles message, typing, presence, and disconnect
  events.
- [`connectDB`](../server/src/config/db.js) opens the MongoDB connection
  during server startup.
- [`asyncHandler`](../server/src/utils/asyncHandler.js) forwards rejected
  asynchronous route handlers to Express error handling.
- [`requireBodyFields`](../server/src/middleware/validate.js) checks that
  required request-body fields are present.
- [`notFound` and `errorHandler`](../server/src/middleware/errorHandler.js)
  turn missing routes and application errors into HTTP error responses.
- [`formatTime`](../client/src/utils/formatTime.js) converts a timestamp into
  the time label shown in the chat interface.
