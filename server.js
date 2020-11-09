require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require("./movidex.json");

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
      movie_.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // if (type) {
  //   resArray = resArray.filter(
  //     (pokemon_) => pokemon_.type.includes(type)
  //   );
  // }

  res.json(resArray);
}

app.get("/movie", handleGetMovie);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
