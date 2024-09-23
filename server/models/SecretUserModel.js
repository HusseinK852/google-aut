const mongoose = require("mongoose");

const secretUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  secret: {
    type: String,
    required: [true, "Secret is required"],
  },
});

const SecretUser = mongoose.model("SecretUser", secretUserSchema);

module.exports = SecretUser;
