CREATE TABLE Users (
	ID INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    PRIMARY KEY (ID)
);

CREATE TABLE Habits (
	ID INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    active BIT,
    userID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES Users(ID)
);

CREATE TABLE Completed (
	ID INT NOT NULL AUTO_INCREMENT,
    habitID INT,
    userID INT,
    completedDate DATE,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES Users(ID),
    FOREIGN KEY (habitID) REFERENCES Habits(ID)
);

CREATE TABLE Days (
	ID INT NOT NULL AUTO_INCREMENT,
    userID INT,
    completedDate DATE,
    PRIMARY KEY (ID),
    FOREIGN KEY (userID) REFERENCES Users(ID)
);