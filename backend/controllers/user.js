// bcrypt hash le mdp utilisateur
const bcrypt = require("bcrypt");

// jsonwebtoken atttribut un token à l'utilisateur lors de sa connexion
const jwt = require("jsonwebtoken");

const hash = require("hash.js")

const User = require("../models/User");

// sauvegarde un nouvel utilisateur
exports.signup = (req, res, next) => {
  const emailHash = hash.sha256().update(req.body.email).digest("hex")
  bcrypt
  // recuperation du hash de password et salte (10) correspond au nombre d'execution de l'algorithme de hashage
    .hash(req.body.password, 10)
    .then((hash) => {
      // recuperation du hash de password pour enregistrment du nouvel utilisateur
      const user = new User({
        email: emailHash,
        password: hash,
      });
      user
      // enregistrement du nouvel utilisateur dans la BD
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};


// connexion d'un utilisateur, si le mdp est valide envoi d'un token 
exports.login = (req, res, next) => {
  const emailHash = hash.sha256().update(req.body.email).digest("hex")
  // recherche de l'utilisateur ds la BD 
  User.findOne({ email: emailHash })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // bcrypt.compare compare les hash dans la requête et mdp utilisateur
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // si ok envoie d'un token 
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
