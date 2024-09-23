const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const authRoutes = require("./routes/authRoutes");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit repeated requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Body parser
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// CORS
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/api/v1/auth", authRoutes);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
