// app.js fait appel aux fonctions dans l'API ( accés aux img, route User, route Sauce)
//importation de express ( framework basé sur node.js)
const express = require("express");
// helmet protège l'application de certaines vulnérabilités (sécurise http, protection XSS, sécurise les en-têtes...)
const helmet = require("helmet");
const mongoose = require("mongoose");

const path = require("path");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// pour éviter de stocker des informations sensibles au sein de l'application
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
// middleware Header gère les problèmes de sécurité comme CORS, cela permet à ttes les demandes de tte origine d'accéder à l'API
app.use((req, res, next) => {
  // ressoures partagées depuis tte les origines
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    // indication des headers utilisés
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    // indication des méthodes autorisées pr les requête http
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// //exportation de app.js pour y accéder depuis un autre fichier
module.exports = app;
