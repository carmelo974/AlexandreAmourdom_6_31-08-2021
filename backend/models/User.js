const mongoose = require("mongoose");

// mongoose-unique-validator pré-valide les info avant enregistrement
const uniqueValidator = require("mongoose-unique-validator");
const sanitizePlugin = require("express-mongo-sanitize");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// éviter d'avoir plusieurs users avec la même adresse mail
userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitizePlugin);

module.exports = mongoose.model("User", userSchema);
