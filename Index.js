import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import mysql from "mysql2/promise";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// create a new MySQL connection
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

//Grab first user from Users table
async function getUser() {
  try {
    const [userInfo, userFields] = await connection.query(
      "SELECT * FROM Users"
    );
    if (userInfo[0]) {
      return userInfo[0];
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

//Grabbing active habits from Habits table
async function getHabits() {
  try {
    const [habitInfo, habitFields] = await connection.query(
      `SELECT * FROM Habits  WHERE userID=${user.ID} AND active=1`
    );
    return habitInfo;
  } catch (err) {
    console.log(err);
  }
};

//Grabbing habits completed for the day
async function getCompleted() {
  try {
    const [completedInfo, completedFields] = await connection.query(
      `SELECT Habits.name, Completed.habitID, Completed.ID FROM Habits INNER JOIN Completed ON Completed.habitID = Habits.ID WHERE Completed.userID=${
        user.ID
      } AND Completed.completedDate='${date.toISOString().slice(0, 10)}'`
    );
    return completedInfo;
  } catch (err) {
    console.log(err);
  }
};

//Adding a completion of a habit for the day
async function addCompletedDay() {
  try {
    await connection.query(
      `INSERT INTO Days (userID, completedDate) VALUES (${user.ID}, '${date
        .toISOString()
        .slice(0, 10)}')`
    );
  } catch (err) {
    console.log(err);
  }
};

//Deleting a completed habit for the day
async function deleteCompletedDay() {
  try {
    await connection.query(
      `DELETE FROM Days WHERE completedDate='${date
        .toISOString()
        .slice(0, 10)}'`
    );
  } catch (err) {
    console.log(err);
  }
}

//Getting completed days for the checked month
async function getMonthDates(mon, yr) {
  let firstDay = new Date(yr, mon, 1);
  let lastDay = new Date(yr, mon + 1, 0);

  try {
    const [monthInfo, monthFields] = await connection.query(
      `SELECT * FROM Days WHERE userID=${
        user.ID
      } AND completedDate BETWEEN '${firstDay
        .toISOString()
        .slice(0, 10)}' AND '${lastDay.toISOString().slice(0, 10)}'`
    );
    return monthInfo;
  } catch (err) {
    console.log(err);
  }
}

//Getting completed days for the week
async function getWeekDates() {
  try {
    const [weekInfo, weekFields] = await connection.query(
      `SELECT * FROM Days WHERE userID=${
        user.ID
      } AND completedDate BETWEEN '${date.getFullYear()}-${date.getMonth()}-${
        date.getDate() - date.getDay()
      }' AND '${date.toISOString().slice(0, 10)}'`
    );
    return weekInfo;
  } catch (err) {
    console.log(err);
  }
}

//Getting the status of completion for today
async function getToday() {
  try {
    const [todayInfo, todayFields] = await connection.query(
      `SELECT * FROM Days WHERE userID=${user.ID} AND completedDate='${date
        .toISOString()
        .slice(0, 10)}'`
    );
    return todayInfo;
  } catch (err) {
    console.log(err);
  }
}

//Creating variables
let user = await getUser();
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();
let habits;
let completed;
let monthDates;
let monthCompletions;
let todayStatus;
let weekDates;
let weekCompletions;
let habitsToDo;

//Home page
app.get("/", async (req, res) => {
  //If no user exists -> render start up page
  if (!user) {
    res.render("getStarted.ejs");
  } else {
    habits = await getHabits();

    //If no habits exist -> render first habit page
    if (habits.length === 0) {
      res.render("firstHabit.ejs");
    } else {
      completed = await getCompleted();
      monthDates = await getMonthDates(month, year);

      //Initiating array for month completions and marking true for the days that were completed
      monthCompletions = [];
      for (let i = 0; i < 31; i++) {
        monthCompletions.push(false);
      }
      monthDates.forEach(
        (item) => (monthCompletions[item.completedDate.getDate() - 1] = true)
      );

      //Getting todays completion status and then getting completion days for the week
      todayStatus = await getToday();
      weekDates = await getWeekDates();
      weekCompletions = [false, false, false, false, false, false, false];
      weekDates.forEach(
        (item) => (weekCompletions[item.completedDate.getDay()] = true)
      );

      //Filtering habits left to do for the day
      habitsToDo = habits.filter(
        (item) => !completed.find((element) => element.habitID === item.ID)
      );

      //Completing the day if all habits done and un-completing if not
      if (habitsToDo.length === 0 && todayStatus.length === 0) {
        await addCompletedDay();
      } else if (habitsToDo.length !== 0 && todayStatus.length === 1) {
        await deleteCompletedDay();
      }

      res.render("index.ejs", {
        user: user,
        habits: habitsToDo,
        completed: completed,
        completedDays: monthCompletions,
        week: weekCompletions,
        date: date,
      });
    }
  }
});

//Page to add, edit, and delete habits
app.get("/manage", async (req, res) => {
  habits = await getHabits();

  res.render("manage.ejs", {
    habits: habits,
  });
});

//Route to mark habit as complete for the day
app.post("/update", async (req, res) => {
  let habitID = req.body.id;
  try {
    await connection.query(
      `INSERT INTO Completed (habitID, userID, completedDate) VALUES (${habitID}, ${
        user.ID
      }, '${date.toISOString().slice(0, 10)}')`
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//Route to un-mark a habit as complete for the day
app.post("/delete", async (req, res) => {
  let completedID = req.body.id;
  try {
    await connection.query(`DELETE FROM Completed WHERE ID=${completedID}`);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//Route to mark a habit as inactive
app.post("/deleteHabit", async (req, res) => {
  let habitID = req.body.id;
  try {
    await connection.query(
      `UPDATE Habits SET active = 0 WHERE ID = ${habitID}`
    );
    res.redirect("/manage");
  } catch (err) {
    console.log(err);
  }
});

//Route to edit name of habit
app.post("/editHabit", async (req, res) => {
  let habitID = parseInt(req.body.id);
  let newName = req.body.habitName;
  try {
    await connection.query(
      `UPDATE Habits SET name = '${newName}' WHERE ID=${habitID}`
    );
    res.redirect("/manage");
  } catch (err) {
    console.log(err);
    ß;
  }
});

//Route to add a habit
app.post("/addHabit", async (req, res) => {
  try {
    await connection.query(
      `INSERT INTO Habits (name, userID) VALUES ('${req.body.habitName}', ${user.ID})`
    );
    res.redirect("/manage");
  } catch (err) {
    console.log(err);
  }
});

//Route to set selected month from calendar
app.post("/setMonth", async (req, res) => {
  month = parseInt(req.body.month);
  year = parseInt(req.body.year);

  monthDates = await getMonthDates(month, year);
  monthCompletions = [];
  for (let i = 0; i < 31; i++) {
    monthCompletions.push(false);
  }

  monthDates.forEach(
    (item) => (monthCompletions[item.completedDate.getDate() - 1] = true)
  );

  res.send(monthCompletions);
});

//Route to create a user
app.post("/createUser", async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  try {
    await connection.query(
      `INSERT INTO Users (firstName, lastName) VALUES ('${firstName}', '${lastName}')`
    );
    user = await getUser();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//Catching all remaining requests and sending 404 status
app.get("*", function (req, res) {
  res.send("Whoops, page not found 404").status(404);
});

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
