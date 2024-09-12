const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const { totp, authenticator } = require("otplib");
const QRCode = require("qrcode");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const catchAsync = require("./utils/catchAsync");

const SecretUser = require("./model/SecretUsersModel");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(mongoSanitize());

app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

app.use(express.json());

totp.options = {
  step: 30,
  window: 1,
};

app.post(
  "/generate-totp",
  catchAsync(async (req, res, next) => {
    const email = req.body.email;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const secret = authenticator.generateSecret();

    const newUser = new SecretUser({ email, secret });

    try {
      await newUser.save();
    } catch (err) {
      return next(new AppError("Email already exists", 400));
    }

    const otpauthURL = `otpauth://totp/Enqode:${email}?secret=${secret}&issuer=Enqode&period=30`;

    QRCode.toDataURL(otpauthURL, (err, data_url) => {
      if (err) {
        return next(new AppError("Error generating QR code", 500));
      }

      res.status(200).json({
        status: "success",
        qrCodeUrl: data_url,
      });
    });
  })
);

app.post(
  "/validate-totp",
  catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    console.log(email, otp);
    if (!email || !otp) {
      console.log("no email");
      return next(new AppError("Email and OTP are required", 400));
    }

    const user = await SecretUser.findOne({ email });

    if (!user) {
      console.log("no user");
      return next(new AppError("User not found", 404));
    }

    const isValid = authenticator.check(otp, user.secret);

    if (isValid) {
      console.log("OTP is valid");
      res.status(200).json({
        status: "success",
        message: "OTP is valid",
      });
    } else {
      return next(new AppError("Invalid OTP", 400));
    }
  })
);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
