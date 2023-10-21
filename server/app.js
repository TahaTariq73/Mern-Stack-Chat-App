const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error");
const path = require("path");

const app = express();

// Configuring environment variables 

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "server/config/config.env" });
}

// Using middlewares other tasks

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({
    extended: true
}))

// Routes

app.use("/api/v1", require("./routes/userRoute"));
app.use("/api/v1", require("./routes/chatRoute"));
app.use("/api/v1", require("./routes/messageRoute"));

// Deployment

app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
})

// Using middleware for errors

app.use(errorMiddleware);

module.exports = app;