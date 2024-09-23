const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.post(
  "/sign-up/verify-email",
  body("email").isEmail().withMessage("Invalid email address"),
  catchAsync(authController.verifyEmail)
);

router.post(
  "/verify-code",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("verificationCode")
      .isNumeric()
      .withMessage("Invalid verification code"),
  ],
  catchAsync(authController.verifyCode)
);

router.post(
  "/sign-up",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("websiteURL").notEmpty().isURL().withMessage("Invalid website URL"),
    body("companyName").notEmpty().withMessage("Company name is required"),
    body("companySize").notEmpty().withMessage("Company size is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("sector").notEmpty().withMessage("Sector is required"),
    body("securityChallenge")
      .notEmpty()
      .withMessage("Security challenge is required"),
    body("existingSolutions")
      .notEmpty()
      .withMessage("Existing solutions are required"),
    body("AnnualSecurityBudget")
      .notEmpty()
      .withMessage("Annual security budget is required"),
  ],
  catchAsync(authController.generateTOTP)
);

router.post(
  "/log-in",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  catchAsync(authController.login)
);

router.post(
  "/validate-totp",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("otp").notEmpty().withMessage("OTP is required"),
  ],
  catchAsync(authController.validateTOTP)
);

module.exports = router;
