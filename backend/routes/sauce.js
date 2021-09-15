const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// enregistrement des Sauces dans la BD
router.post("/", auth, multer, sauceCtrl.createSauce);

// modification sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// suppression d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// récupération d'une sauce spécifique
router.get("/:id", auth, sauceCtrl.getOneSauce);

// récupération de la liste de Sauces pour l'envoyer dans la BD
router.get("/", auth, sauceCtrl.getAllSauces);

// route pour like/dislike
router.post("/:id/like", auth, sauceCtrl.likeDislike);

module.exports = router;
