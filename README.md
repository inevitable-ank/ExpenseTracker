# MERN GraphQL Expense Tracker

A full-stack expense tracker application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Apollo GraphQL for data management and queries. This application allows users to manage their expenses securely with authentication, real-time updates, and error handling on both server and client sides.

## Features
- **MERN Stack:** Built using MongoDB, Express.js, React.js, and Node.js.
- **GraphQL with Apollo:** Utilizes Apollo Client for state management and queries with a GraphQL API.
- **Authentication:** User authentication with Passport.js, storing sessions in MongoDB.
- **Error Handling:** Comprehensive error handling on both the client and server.
- **Cron Jobs:** Automates tasks and schedules operations via cron jobs.
- **Global State Management:** Handles global app state with Apollo Client.

## Tech Stack
### Frontend
- **React.js:** For the user interface and component structure.
- **Apollo Client:** To manage global state and handle GraphQL queries and mutations.

### Backend
- **Node.js & Express.js:** Server-side framework and routing.
- **GraphQL & Apollo Server:** For API endpoints, queries, and mutations.
- **MongoDB:** Database for storing user data and expenses.
- **Passport.js:** For user authentication and session management.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/inevitable-ank/graphql-expense-tracker.git
    cd graphql-expense-tracker
    ```

2. Install dependencies:
    ```bash
    npm build
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following environment variables:
    ```bash
    MONGO_URI=your-mongodb-uri
    SESSION_SECRET=your-secret-key
    NODE_ENV=development
    PORT=4000
    ```

4. Start the backend:
    ```bash
    npm start
    ```

5. Start the frontend (in a separate terminal):
    ```bash
    cd frontend
    npm start
    ```

## Usage
1. Sign up or log in to the application.
2. Add, edit, or delete expenses from your dashboard.
3. View and manage all your expenses with real-time updates.
4. The app schedules tasks like expense summary reports using cron jobs.

## Error Handling
Both server and client sides feature robust error handling mechanisms. The app returns user-friendly error messages and handles system failures gracefully.

## Future Improvements
- Add unit and integration tests.
- Enhance user experience with additional filtering and sorting options.
- Add support for multiple currencies.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
