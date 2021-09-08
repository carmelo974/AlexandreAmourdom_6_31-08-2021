//importation de express
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const helmet = require("helmet");
const path = require("path");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://Alex_user:3xXAZcczpwRVSFW@cluster0.4jzwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

// app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauce", sauceRoutes);
app.use("/api/auth", userRoutes);

// //exportation de app.js pour y accéder depuis un autre fichier
module.exports = app;