require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const helmet = require('helmet');
const POKEDEX = require("./movidex.json");

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

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get("/types", handleGetTypes);

function handleGetPokemon(req, res) {
  const { name, type } = req.query;

  if (type) {
    if (!validTypes.includes(type)) {
      res.status(400).send("Invalid Request. Enter a Valid type");
    }
  }

  let resArray = POKEDEX.pokemon;
  if (name) {
    resArray = POKEDEX.pokemon.filter((pokemon_) =>
      pokemon_.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (type) {
    resArray = resArray.filter(
      (pokemon_) => pokemon_.type.includes(type)
    );
  }

  res.json(resArray);
}

app.get("/pokemon", handleGetPokemon);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
