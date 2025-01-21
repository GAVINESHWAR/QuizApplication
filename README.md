# Quiz Application

A React-based interactive quiz application that fetches questions from the Open Trivia Database API and provides a user-friendly interface for taking timed quizzes.

## Overview

This application is built as a responsive, single-page React application that allows users to:
- Start a quiz by entering their email
- Answer 15 questions within a 30-minute time limit
- Navigate between questions freely
- Track their progress and review answers
- See a detailed report of their performance

### Key Components

1. **Start Screen**
   - Email validation
   - Initial quiz setup

2. **Quiz Interface**
   - Timer display
   - Question navigation panel
   - Question display with multiple choice answers
   - Progress tracking

3. **Report Screen**
   - Final score display
   - Question-by-question review
   - Comparison of user answers with correct answers

## Installation and Setup

1. Clone the repository:
```bash
git clone [your-repository-url]
cd quiz-application
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:
```bash
npm run build
```

## Assumptions

1. Network Connectivity
   - Users have stable internet connection to fetch questions
   - API endpoint remains accessible

2. Browser Compatibility
   - Users are using modern browsers that support ES6+ features
   - Application is optimized for Chrome, Firefox, Safari, and Edge

3. User Interaction
   - Users will complete the quiz in one session
   - Users will provide valid email addresses
   - Users understand English as the quiz language

## Challenges and Solutions

1. **Timer Implementation**
   - Challenge: Maintaining accurate countdown and handling auto-submission
   - Solution: Implemented useEffect hook with interval for precise timing and cleanup

2. **State Management**
   - Challenge: Managing multiple states across components
   - Solution: Utilized React's useState hook efficiently with structured state objects

3. **Question Navigation**
   - Challenge: Implementing a flexible navigation system while tracking progress
   - Solution: Created a navigation panel with visual indicators for visited/answered questions

4. **API Integration**
   - Challenge: Handling API responses and error cases
   - Solution: Implemented proper error handling and loading states for better UX

5. **Responsive Design**
   - Challenge: Making the application work across different screen sizes
   - Solution: Used CSS for responsive layouts and flexible components

## Technical Details

- Built with React.js
- No external UI libraries used
- Pure CSS for styling
- Responsive design principles
- API integration

## Deployment

The application is deployed on Netlify and can be accessed at https://quizapplicationavineshwar.netlify.app/.

## Future Improvements

1. Adding user authentication
2. Implementing different quiz categories
3. Adding a leaderboard system
4. Supporting multiple languages
5. Adding animation effects
6. Implementing offline support

## Repository Structure

```
quiz-application/
├── src/
│   ├── App.jsx
│   ├── Quiz.jsx
│   └── main.jsx
├── public/
│   └── index.html
├── package.json
└── README.md
```
