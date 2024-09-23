const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  websiteURL: {
    type: String,
    match: [
      /(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?/i,
      "Invalid URL",
    ],
    required: [true, "Website URL is required"],
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
  },
  companySize: {
    type: String,
    required: [true, "Company size is required"],
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["CISO", "CIO", "CTO", "CEO", "CFO", "COO", "Other"],
  },
  sector: {
    type: String,
    required: [true, "Sector is required"],
    enum: [
      "Technology",
      "Finance",
      "Healthcare",
      "Manufacturing",
      "Retail",
      "Education",
      "Government",
      "Other",
    ],
  },
  securityChallenge: {
    type: [String],
    required: [true, "Security challenge is required"],
    enum: [
      "Data Breaches",
      "Insider Threats",
      "Compliance",
      "Cloud Security",
      "Ransomware",
      "Phishing",
      "IoT Security",
      "Other",
    ],
  },
  existingSolutions: {
    type: [String],
    required: [true, "Existing solutions are required"],
    enum: [
      "Firewalls",
      "Antivirus",
      "SIEM",
      "DLP",
      "IAM",
      "Encryption",
      "EDR",
      "Other",
    ],
  },
  AnnualSecurityBudget: {
    type: String,
    required: [true, "Annual security budget is required"],
    enum: [
      "$0 - $50,000",
      "$50,001 - $100,000",
      "$100,001 - $500,000",
      "$500,001 - $1,000,000",
      "$1,000,001+",
    ],
  },
  secret: {
    type: String,
    required: [true, "Secret is required"],
  },
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
