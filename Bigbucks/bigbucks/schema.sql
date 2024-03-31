DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS HistoricalStockData;

CREATE TABLE user (
    UserId INTEGER PRIMARY KEY AUTOINCREMENT,
    UserName TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    Email TEXT NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    PhoneNumber TEXT NOT NULL,
    AccountBalance DECIMAL NOT NULL,
    ROLE TEXT NOT NULL,
);

CREATE TABLE stocks (
    StockID INTEGER PRIMARY KEY AUTOINCREMENT,
    TickerSymbol TEXT NOT NULL UNIQUE,
    CompanyName TEXT NOT NULL
);

CREATE TABLE transactions (
    TransactionID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    StockID INTEGER NOT NULL,
    TransactionType TEXT NOT NULL CHECK(TransactionType IN ('BUY', 'SELL')),
    Quantity INTEGER NOT NULL,
    PricePerShare REAL NOT NULL,
    TransactionDate DATETIME NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (StockID) REFERENCES Stocks(StockID)
);

CREATE TABLE HistoricalStockData (
    StockID INTEGER NOT NULL,
    Date DATE NOT NULL,
    OpenPrice REAL NOT NULL,
    ClosePrice REAL NOT NULL,
    HighPrice REAL NOT NULL,
    LowPrice REAL NOT NULL,
    Volume INTEGER NOT NULL,
    PRIMARY KEY (StockID, Date),
    FOREIGN KEY (StockID) REFERENCES Stocks(StockID)
);
