# Habit Tracker & Routine Maker

A responsive web application for tracking habits, creating routines, managing to-dos, and setting reminders.

## Features

- **User Authentication**
  - Login / Signup with Email/Password and Google
  - Secure session handling with Firebase Authentication

- **Routine Maker**
  - Create daily, weekly, and monthly routines
  - Edit, delete, and organize tasks
  - Responsive dashboard layout

- **To-Do List**
  - Add, edit, and delete tasks
  - Organize tasks by Daily, Weekly, and Monthly
  - Check/uncheck completed tasks

- **Habit Tracker**
  - Track habits with progress visualization
  - View completion percentages and streaks
  - Organize habits by frequency

- **Reminders & Notifications**
  - Set reminders for tasks and habits
  - Enable/disable notifications
  - Daily/weekly reminder options

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Backend & Auth:** Firebase (Auth + Firestore + FCM)
- **State Management:** React Context API
- **Routing:** React Router

## Project Structure

```
habit-tracker/
├── public/              # Static assets
│   ├── firebase-messaging-sw.js  # Service worker for notifications
│   └── manifest.json    # PWA manifest
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages
│   ├── services/        # Firebase and API services
│   └── utils/           # Utility functions
├── index.html           # HTML entry point
└── vite.config.js       # Vite configuration
```

## Firebase Configuration

The application uses Firebase for authentication, database, and notifications. The configuration is set up in `src/services/firebase.js`:

```javascript
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb18dFEugSNpCye_CAMCRRyQm00_KO7e0",
  authDomain: "to-dolist-83920.firebaseapp.com",
  projectId: "to-dolist-83920",
  storageBucket: "to-dolist-83920.firebasestorage.app",
  messagingSenderId: "956562472595",
  appId: "1:956562472595:web:39fbb1706daece64541766",
  measurementId: "G-YE2ZWHZGV9"
};
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To build the application for production:

```
npm run build
```

The built files will be in the `dist` directory.

## Additional Features

- **Dark Mode:** Toggle between light and dark themes
- **Data Export:** Export user data for backup
- **Responsive Design:** Mobile-first approach, works on all devices

## Demo

A static HTML demo is available at `demo.html` which showcases the UI design and interactions without requiring a Firebase account.

## License

This project is licensed under the MIT License.