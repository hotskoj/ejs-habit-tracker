# Habit Tracker

Welcome to the Habit Tracker! This web application allows users to track their daily habits and visualize their progress over time. Built with Node.js, Express.js, MySQL, and EJS, the Habit Tracker offers a user-friendly interface to help you stay motivated and accountable.

## Features

- **Habit Management:** Add, edit, and delete habits.
- **Daily Tracking:** Record daily progress for each habit.
- **Progress Visualization:** View weekly and monthly progress.
- **Responsive Design:** Accessible on both desktop and mobile devices.

## Technologies Used

- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Web application framework for Node.js.
- **MySQL:** Relational database to store user and habit data.
- **EJS:** Templating engine for rendering HTML.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MySQL](https://www.mysql.com/) (v5.7 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hotskoj/habit-tracker.git
   cd ejs-habit-tracker
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up your MySQL database:
   - Create a new database called `myHabit`.
   - Import the provided `schema.sql` file to set up the tables.

4. Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE = database name
   PASSWORD = 'database password
   ```

5. Start the application:
   ```bash
   npm start
   ```

6. Visit `http://localhost:3000` in your web browser.

## Usage

- **Sign Up:** Create a new account.
- **Add Habits:** Navigate to the "Manage Habits" page to create new habits.
- **Track Progress:** Mark habits as completed daily and view your progress on the home page.
- **View Progress:** See weekly and monthly reports to see how you're doing.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a Pull Request.

Feel free to reach out with any questions or feedback. Happy tracking!
