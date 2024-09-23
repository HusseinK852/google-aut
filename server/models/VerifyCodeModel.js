const mongoose = require("mongoose");

const verifyCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  verificationCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  verificationCodeExpires: {
    type: Date,
    required: [true, "Verification code expiration date is required"],
  },
});

const VerifyCode = mongoose.model("VerifyCode", verifyCodeSchema);

module.exports = VerifyCode;
