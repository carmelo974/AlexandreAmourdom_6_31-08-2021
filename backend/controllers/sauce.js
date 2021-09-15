// logique métier 
// récupération du "models" de sauce
const Sauce = require("../models/Sauce");
// fs "file system" permet de créer, lire, écrire, copier, renommer, supprimer des fichiers
const fs = require("fs");



// permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // les données envoyées par le front-end sont stockées sous la forme form-data dans une variable 
  const sauceObject = JSON.parse(req.body.sauce);
  // suppression de l'id généré par le front-end, mongooseDB crée l'id lors de la création de la sauce
  delete sauceObject._id;
  // instance du modèle sauce
  const sauce = new Sauce({
    ...sauceObject,
    // URL complète de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersDisLiked: [" "],
  });
  // sauvegarde de la sauce dans la BD
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};



exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};


// supression de la sauce
exports.deleteSauce = (req, res, next) => {
  // avant de supprimer l'objet, récupération de l'url de l'image 
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // le split permet de récupèrer le nom du fichier
      const filename = sauce.imageUrl.split("/images/")[1];
      // avec le nom du fichier unlink supprime le fichier
      fs.unlink(`images/${filename}`, () => {
        // suppression du fichier dans la BD

        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};


// permet de récupérer une seule sauce 
exports.getOneSauce = (req, res, next) => {
  // findOne permet de vérifier si l'id de la sauce et le même que dans les paramètres de requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};


// recupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
  // find recupère toutes les sauces dans la BD
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};



//controller permettant de liker/disliker une sauce
 exports.likeDislike = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  //pour liker une sauce
  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      { $push: { usersLiked: userId }, $inc: { likes: +1 } }
    )
      .then(() => res.status(200).json({ message: "J'aime" }))
      .catch((error) => res.status(400).json({ error }));
  }
  
  //pour annuler un like/dislike
  if (like === 0)
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          // Si il s'agit d'annuler un like
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersLiked: userId,
              },
              $inc: {
                likes: -1,
              }, // On incrémente de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Like retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
        if (sauce.usersDisliked.includes(userId)) {
          // Si il s'agit d'annuler un dislike
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              }, // On incrémente de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Dislike retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
      })
      .catch((error) =>
        res.status(404).json({
          error,
        })
      );
      if (like === -1) {
        Sauce.updateOne( // S'il s'agit d'un dislike
            {
              _id: sauceId
            }, {
              $push: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: +1
              }, // On incrémente de 1
            }
          )
          .then(() => {
            res.status(200).json({
              message: 'Dislike ajouté !'
            })
          })
          .catch((error) => res.status(400).json({
            error
          }))
      }
};
