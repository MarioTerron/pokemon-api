// BASE SETUP
// =============================================================================

// call the packages we need
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3030; // set our port
const DB = process.env.DB || "mongodb://localhost:27017/demoPokemon"

const Pokemon = require("./app/models/pokemon");

// configure app
app.use(morgan("dev")); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================

// create our router
const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
  // do logging
  console.log("Something is happening..");
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get("/", (req, res) => {
  res.json({ message: "Hey! Welcome to our API!" });
});

// on routes that end in /pokemons
// ----------------------------------------------------
router
  .route("/pokemons")

  // create a pokemon (accessed at POST http://localhost:8080/pokemon)
  .post((req, res) => {
    const { name, pokedexId, imgUrl } = req.body; // set the pokemon name (comes from the request)
    const pokemon = new Pokemon({ name, pokedexId, imgUrl }); // create a new instance of the Pokemon model

    pokemon.save((err) => {
      if (err) res.send(err);

      res.json({ message: "Pokemon created!" });
    });
  })

  // get all the pokemons (accessed at GET http://localhost:8080/api/pokemons)
  .get((req, res) => {
    const filter = {'_id': 0, '__v': 0};

    Pokemon.find({}, filter, (err, pokemons) => {
      if (err) res.send(err);

      res.json(pokemons);
    });
  });

// on routes that end in /pokemon/:pokedexId
// ----------------------------------------------------
router
  .route("/pokemon/:pokedexId")

  // get the pokemon with that pokedexId
  .get((req, res) => {
    const { pokedexId } = req.params;
    const filter = {'_id': 0, '__v': 0};

    Pokemon.find({ pokedexId }, filter, (err, pokemon) => {
      if (err) res.send(err);
      res.json(pokemon);
    });
  })

  // update the pokemon with this pokemonId
  .put((req, res) => {
    const { pokedexId } = req.params;
    Pokemon.findOne({ pokedexId }, (err, pokemon) => {
      if (err) res.send(err);

      const { name } = req.body;
      pokemon.name = name;
      
      pokemon.save(function(err) {
        if (err) res.send(err);

        res.json({ message: "Pokemon updated!" });
      });
    });
  })

  // delete the pokemon with this pokemonId
  .delete((req, res) => {
    const { pokedexId } = req.params;

    Pokemon.remove({ pokedexId }, (err, pokemon) => {
      if (err) res.send(err);

      res.json({ message: "Successfully deleted" });
    });
  });

// REGISTER OUR ROUTES -------------------------------
app.use("/api", router);

// START THE SERVER
// =============================================================================
console.log(`➡ Connecting to ${DB}`)
mongoose.connect(DB);
app.listen(PORT);
console.log(`➡ Listening on port ${PORT}`)

