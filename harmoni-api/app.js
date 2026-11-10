require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MySQLStore = require("express-mysql-session")(session);

const authApiRoute = require("./routes/api/authApiRoute");
const profileApiRoute = require("./routes/api/profileApiRoute");
const interestApiRoute = require("./routes/api/interestApiRoute");
const discoverApiRoute = require("./routes/api/discoverApiRoute");
const userApiRoute = require("./routes/api/userApiRoute");
const likeApiRoute = require("./routes/api/likeApiRoute");
const matchApiRoute = require("./routes/api/matchApiRoute"); // tin nhắn (MSG) lồng trong route match
const blockApiRoute = require("./routes/api/blockApiRoute");
const reportApiRoute = require("./routes/api/reportApiRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép React (http://localhost:5173) gọi API kèm cookie session
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
});

app.use(
  session({
    name: "harmoni_sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

function logger(req, res, next) {
  console.log(req.method, req.originalUrl);
  next();
}

app.use(logger);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Harmoni API đang chạy", data: null });
});

// gắn route vào các api
app.use("/api/auth", authApiRoute);
app.use("/api/profile", profileApiRoute);
app.use("/api/interests", interestApiRoute);
app.use("/api/discover", discoverApiRoute);
app.use("/api/users", userApiRoute);
app.use("/api/likes", likeApiRoute);
app.use("/api/matches", matchApiRoute);
app.use("/api/blocks", blockApiRoute);
app.use("/api/reports", reportApiRoute);

app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: "Không tìm thấy API này", data: null });
});

app.listen(PORT, () => {
  console.log(`Harmoni API đang chạy tại http://localhost:${PORT}`);
});
