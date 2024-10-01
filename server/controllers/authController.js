const { validationResult } = require("express-validator");
const { authenticator, totp } = require("otplib");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const Users = require("../models/UsersModel");
const VerifyCode = require("../models/VerifyCodeModel");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

exports.verifyEmail = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { email } = req.body;

  const secretCode = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 5 * 60 * 1000;

  const message = `Hello,

Thank you for signing up for our service. Your verification code is: ${secretCode}

Please use this code to verify your email address. This code is valid for 5 minutes only.

Best regards,
Support Team`;

  await VerifyCode.create({
    email,
    verificationCode: secretCode,
    verificationCodeExpires: expiresAt,
  });

  await sendEmail({
    email,
    subject: "Your verification code (valid for 5 minutes)",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Verification code has been sent to your email!",
  });
};

exports.verifyCode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { email, verificationCode } = req.body;

  const codeEntry = await VerifyCode.findOne({ email, verificationCode });

  if (!codeEntry) {
    return next(new AppError("The verification code is invalid.", 400));
  }

  if (codeEntry.verificationCodeExpires < Date.now()) {
    await VerifyCode.deleteOne({ _id: codeEntry._id });
    return next(new AppError("The verification code has expired.", 400));
  }

  await VerifyCode.deleteMany({ email: codeEntry.email });

  res.status(200).json({
    status: "success",
    message: "Email verified successfully!",
  });
};

exports.generateTOTP = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const {
    firstName,
    lastName,
    email,
    password,
    websiteURL,
    companyName,
    companySize,
    role,
    sector,
    securityChallenge,
    existingSolutions,
    AnnualSecurityBudget,
  } = req.body;

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const secret = authenticator.generateSecret();

  console.log("first" + secret);

  const fakeSecret = rotateString(secret, wordToNumber());

  totp.options = { algorithm: "sha512", step: 30 };

  const otpauthURL = totp.keyuri(email, "Enqode", fakeSecret);

  console.log(otpauthURL);

  const hashedSecret = CryptoJS.AES.encrypt(
    secret,
    process.env.TOTP_SECRET
  ).toString();

  const newUser = new Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    websiteURL,
    companyName,
    companySize,
    role,
    sector,
    securityChallenge,
    existingSolutions,
    AnnualSecurityBudget,
    secret: hashedSecret,
  });

  await newUser.save();

  res.status(201).json({
    status: "success",
    qrCodeUrl: otpauthURL,
  });
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await Users.findOne({ email });
  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return next(new AppError("Invalid email or password", 401));
  }

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
  });
};

exports.validateTOTP = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  const { email, otp } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const bytes = CryptoJS.AES.decrypt(user.secret, process.env.TOTP_SECRET);

  const secret = bytes.toString(CryptoJS.enc.Utf8);

  console.log(secret, otp);

  const isValid = totp.check(otp, secret);

  if (!isValid) {
    return next(new AppError("Invalid OTP", 400));
  }

  res.status(200).json({
    status: "success",
    message: "OTP is valid",
  });
};

const wordToNumber = () => {
  const letters = process.env.TOTP_SECRET.toLowerCase().split("");
  let total = 0;

  for (let letter of letters) {
    if (letter >= "a" && letter <= "z") {
      total += letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
    }
  }

  while (total >= 10) {
    total = total
      .toString()
      .split("")
      .reduce((acc, digit) => acc + Number(digit), 0);
  }

  return total;
};

const rotateString = (str, steps) => {
  const length = str.length;
  const effectiveSteps = steps % length;

  const partToMove = str.slice(0, effectiveSteps);
  const remainingPart = str.slice(effectiveSteps);

  return remainingPart + partToMove;
};
