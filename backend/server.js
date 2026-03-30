const express = require("express");
const cors = require("cors"); 

const app = express();

const userRouter = require("./src/routes/userRouter");
const movieRouter = require("./src/routes/movieRouter");
const genreRouter = require("./src/routes/genreRouter");
const countrieRouter = require("./src/routes/countrieRouter");
const reviewRouter = require("./src/routes/reviewRouter");

require("dotenv").config();


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://172.16.1.76:5173", "http://172.16.1.76:5174", "http://0.0.0.0:5173", "http://0.0.0.0:5174"],
  credentials: true
}));

app.use(express.json());

// routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genre", genreRouter);
app.use("/api/countrie", countrieRouter);
app.use("/api/review", reviewRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});