const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const { Builder, By } = require("selenium-webdriver");
require("dotenv").config();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Body parser
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// CORS
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/api/v1/checkCompany", async (req, res, next) => {
  let driver;
  try {
    const companyName = req.query.companyName;

    if (!companyName) {
      return res
        .status(400)
        .json({ status: "fail", message: "Company name is required" });
    }

    driver = await new Builder().forBrowser("chrome").build();

    // Navigate to the Crunchbase page
    await driver.get(`https://www.crunchbase.com/organization/${companyName}`);

    // Find the element with the specified classes
    const element = await driver.findElement(
      By.css(
        ".component--field-formatter.field-type-enum.accent.highlight-color-contrast-light.ng-star-inserted"
      )
    );

    const elementText = await element.getText();

    res.status(200).json({
      status: "success",
      data: elementText,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch company data" });
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
});

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
