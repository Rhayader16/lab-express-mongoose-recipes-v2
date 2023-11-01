const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe.model");

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION

const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get("/", (req, res) => {
  res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});
app.use("/recipes", require("./models/Recipe.model"));

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", async (res, req, next) => {
  const theRecipe = { ...req.body };
  Recipe.create(theRecipe)
    .then((createdRecipe) => {
      res.status(201).json(createdRecipe);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while creating a new recipe" });
    });
});
//  Iteration 4 - Get All Recipes
//  GET  /recipes route

app.get("/recipes", async (req, res, next) => {
  const query = {};
  Recipe.find(query)
    .then((allRecipes) => {
      res.status(200).json(allRecipes);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while getting all the recipes" });
    });
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const oneRecipe = await Recipe.findById(id);
    res.status(200).json(oneRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error while getting a single recipe" });
  }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put("/recipes/:id", async (req, res, next) => {
  const { recipeId } = req.params;
  const updateARecipe = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      updateARecipe,
      {
        new: true,
      }
    );
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Error while updating a recipe" });
  }
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete("/recipes/:id", (req, res, next) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while deleting a recipe" });
    });
});
// BONUS
//  Bonus: Iteration 9 - Create a Single User
//  POST  /users route

//  Bonus: Iteration 10 | Get a Single User
//  GET /users/:id route

//  Bonus: Iteration 11 | Update a Single User
//  GET /users/:id route

// Start the server
app.listen(3000, () => console.log("My first app listening on port 3000!"));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
