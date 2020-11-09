require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIEDEX = require("./moviedex.js");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log("validate bearer token middleware");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  // move to the next middleware
  next();
});

function handleGetMovie(req, res) {
  const { genre, country, avg_vote } = req.query;
  let resArray = MOVIEDEX;

  if (genre) {
    resArray = resArray.filter((movie_) =>
      movie_.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    resArray = resArray.filter((movie_) =>
      movie_.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote) {
    resArray = resArray.filter((movie_) =>
      Number(avg_vote) <= movie_.avg_vote
    );
  }

  res.json(resArray);
}

app.get("/movie", handleGetMovie);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
