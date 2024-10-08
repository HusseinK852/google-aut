<template>
  <v-container fluid class="rounded-lg fill-height">
    <v-row no-gutters align="center">
      <v-col cols="12" md="6" class="pa-12">
        <v-stepper v-model="step" class="custom-stepper">
          <v-stepper-header>
            <v-stepper-item value="1" :complete="step > 0"></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item value="2" :complete="step > 1"></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item value="3" :complete="step > 2"></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item value="4" :complete="step > 3"></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item value="5"></v-stepper-item>
          </v-stepper-header>

          <!-- Step 1: Create your account -->
          <v-card flat v-if="step === 0">
            <v-card-title class="text-center">Create your account</v-card-title>
            <v-card-subtitle class="text-center">
              <v-divider class="my-4"></v-divider>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="firstName"
                      label="First name"
                      :rules="[rules.required]"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="lastName"
                      label="Last name"
                      :rules="[rules.required]"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="email"
                  label="Email address"
                  hint="Use your work email"
                  :rules="[rules.required, rules.emailFormat]"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[rules.required, rules.passwordStrength]"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="passwordConfirm"
                  label="Confirm Password"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  :append-inner-icon="
                    showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  @click:append-inner="
                    showPasswordConfirm = !showPasswordConfirm
                  "
                  :rules="[rules.required, rules.passwordMatch]"
                  outlined
                ></v-text-field>
              </v-form>
            </v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="firstStep" class="bg-primary">Next</v-btn>
            </v-card-actions>
          </v-card>

          <!-- Step 2: Verify email -->

          <v-card class="mx-auto text-center pa-10" v-if="step === 1">
            <v-icon
              color="teal-darken-2"
              icon="mdi-email"
              size="large"
            ></v-icon>
            <v-card-title class="justify-center mb-5">
              VERIFY YOUR EMAIL ADDRESS
            </v-card-title>
            <v-divider />
            <v-card-title class="px-4 text-center my-5 text-subtitle-1">
              A verification code has been sent to
              <br /><strong>{{ email }}</strong>
            </v-card-title>
            <v-card-subtitle style="white-space: normal; color: black">
              Please check your inbox and enter the verification code below to
              verify your email address. The code will expire in
              {{ formattedExpirationTime }}.
            </v-card-subtitle>
            <v-divider class="my-4"></v-divider>
            <v-otp-input
              v-model="emailCode"
              class="mb-8"
              :error="codeError"
              :error-messages="codeError ? 'Invalid verification code' : ''"
              divider="•"
              length="6"
              variant="outlined"
            ></v-otp-input>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="success" @click="verifyCode">Verify</v-btn>
            </v-card-actions>
          </v-card>

          <!-- Step 3: Website Information -->

          <v-card flat v-if="step === 2">
            <v-card-title class="text-center">
              It's great to meet you.
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="websiteURL"
                  :rules="[rules.required]"
                  label="Website URL"
                  prepend-inner-icon="mdi-web"
                  append-inner-icon="mdi-check-circle-outline"
                  outlined
                ></v-text-field>

                <v-text-field
                  v-model="companyName"
                  :rules="[rules.required]"
                  label="Company Name"
                  prepend-inner-icon="mdi-domain"
                  append-inner-icon="mdi-check-circle-outline"
                  outlined
                ></v-text-field>
                <v-select
                  v-model="companySize"
                  :rules="[rules.required]"
                  :items="companySizeOptions"
                  label="How many people work at your company?"
                  outlined
                ></v-select>

                <v-select
                  v-model="role"
                  :rules="[rules.required]"
                  :items="roleOptions"
                  label="What is your role in the company?"
                  outlined
                ></v-select>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="nextStep" class="bg-primary">Next</v-btn>
            </v-card-actions>
          </v-card>

          <!-- step 4 -->
          <v-card flat v-if="step === 3">
            <v-card-title class="text-center">
              Your account has been created successfully!
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-select
                  v-model="sector"
                  :rules="[rules.required]"
                  :items="sectorOptions"
                  label="What sector do you work in?"
                  outlined
                ></v-select>

                <v-select
                  v-model="AnnualSecurityBudget"
                  :rules="[rules.required]"
                  :items="AnnualSecurityBudgetOptions"
                  label="What is your annual budget?"
                  outlined
                ></v-select>

                <label class="text-subtitle-1"
                  >What are the security challenges you face?</label
                >
                <v-chip-group
                  v-model="securityChallenge"
                  column
                  multiple
                  mandatory
                  class="mb-5"
                >
                  <v-chip
                    v-for="option in securityChallengeOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </v-chip>
                </v-chip-group>

                <label class="text-subtitle-1"
                  >What are the existing Solutions?</label
                >
                <v-chip-group
                  v-model="existingSolutions"
                  column
                  multiple
                  mandatory
                >
                  <v-chip
                    v-for="solution in existingSolutionsOptions"
                    :key="solution"
                    :value="solution"
                  >
                    {{ solution }}
                  </v-chip>
                </v-chip-group>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="handleSignUp" class="bg-primary">Next</v-btn>
            </v-card-actions>
          </v-card>

          <!-- Step 4: QR Code Display -->
          <v-card flat v-if="step === 4">
            <v-card-title class="text-center">
              Scan the QR Code with your Google Authenticator
            </v-card-title>
            <v-card-text class="text-center">
              <v-img :src="qrCodeUrl" max-width="300" class="qr-code"></v-img>
              <p class="my-4">
                Use this QR Code to set up two-factor authentication.
              </p>
            </v-card-text>
          </v-card>
        </v-stepper>
      </v-col>
      <v-col cols="12" md="6" class="d-none d-md-block pa-0">
        <v-img
          src="https://pfst.cf2.poecdn.net/base/image/e21958dcd1ccc0968f070249d115657bcf1f600a24d124074357f5beba5b5aa2?w=1024&h=1024&pmaid=116851828"
          cover
          height="100%"
        >
          <div class="d-flex align-center justify-center fill-height">
            <v-img
              class="mx-auto my-6"
              max-width="280"
              src="https://www.dropbox.com/scl/fi/cffh9kt5pa0niuc7ak9zr/enqode_logo.png?rlkey=qnd5pm8s6ufp5hxzilfztmw6c&dl=1"
              contain
            ></v-img>
          </div>
        </v-img>
      </v-col>
    </v-row>
    <!-- <v-btn @click="prevStep" class="bg-primary">Next</v-btn> -->
  </v-container>
</template>

<script>
import QRCode from "qrcode";

export default {
  data() {
    return {
      form: null,
      step: 0,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      showPassword: false,
      passwordConfirm: "",
      showPasswordConfirm: false,
      expirationTime: 0,
      emailCode: "",
      websiteURL: "",
      companyName: "",
      companySize: "",
      role: "",
      sector: "",
      securityChallenge: "",
      existingSolutions: "",
      AnnualSecurityBudget: "",
      valid: false,
      qrCodeUrl: "",
      codeError: false,
      timer: null,
      companySizeOptions: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],
      roleOptions: ["CISO", "CIO", "CTO", "CEO", "CFO", "COO", "Other"],
      sectorOptions: [
        "Technology",
        "Finance",
        "Healthcare",
        "Manufacturing",
        "Retail",
        "Education",
        "Government",
        "Other",
      ],
      securityChallengeOptions: [
        "Data Breaches",
        "Insider Threats",
        "Compliance",
        "Cloud Security",
        "Ransomware",
        "Phishing",
        "IoT Security",
        "Other",
      ],
      existingSolutionsOptions: [
        "Firewalls",
        "Antivirus",
        "SIEM",
        "DLP",
        "IAM",
        "Encryption",
        "EDR",
        "Other",
      ],
      AnnualSecurityBudgetOptions: [
        "$0 - $50,000",
        "$50,001 - $100,000",
        "$100,001 - $500,000",
        "$500,001 - $1,000,000",
        "$1,000,001+",
      ],
    };
  },
  methods: {
    async firstStep() {
      const check = await this.$refs.form.validate();
      if (check) {
        try {
          const response = await fetch(
            "http://localhost:8000/api/v1/auth/sign-up/verify-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: this.email,
              }),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.step += 1;
        } catch (e) {
          console.error("Error during first step:", e);
        }
      }
    },
    async verifyCode() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/auth/verify-code",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              verificationCode: this.emailCode,
            }),
          }
        );
        if (!response.ok) {
          this.codeError = true;
          this.emailCode = "";
          return;
        }
        this.codeError = false;
        this.step += 1;
      } catch (e) {
        console.error("Error during verify code:", e);
        this.codeError = true;
      }
    },
    async nextStep() {
      const check = await this.$refs.form.validate();
      if (check) {
        this.step += 1;
      }
    },
    prevStep() {
      this.step -= 1;
    },
    async handleSignUp() {
      const check = await this.$refs.form.validate();
      if (check) {
        try {
          const response = await fetch(
            "http://localhost:8000/api/v1/auth/sign-up",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                websiteURL: this.websiteURL,
                companyName: this.companyName,
                companySize: this.companySize,
                role: this.role,
                sector: this.sector,
                securityChallenge: this.securityChallenge,
                existingSolutions: this.existingSolutions,
                AnnualSecurityBudget: this.AnnualSecurityBudget,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          const secretRegex = /secret=([A-Z0-9]+)/;
          const match = data.qrCodeUrl.match(secretRegex);

          if (match && match[1]) {
            const originalSecret = match[1];
            console.log("Extracted secret:", originalSecret);

            const newSecret = this.reverseRotateString(
              originalSecret,
              this.wordToNumber("NoMoreExcuses")
            );

            const updatedUrl = data.qrCodeUrl.replace(
              secretRegex,
              `secret=${newSecret}`
            );

            console.log("Updated QR code URL with new secret:", updatedUrl);

            QRCode.toDataURL(updatedUrl, { errorCorrectionLevel: "H" })
              .then((url) => {
                this.qrCodeUrl = url;
              })
              .catch((err) => {
                console.error(err);
              });

            this.step += 1;
          } else {
            console.error("No secret found in qrCodeUrl.");
          }
        } catch (error) {
          console.error("Error during signup:", error);
        }
      }
    },
    wordToNumber(word) {
      const letters = word.toLowerCase().split("");
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
    },
    reverseRotateString(str, steps) {
      const length = str.length;
      const effectiveSteps = steps % length;

      const partToMove = str.slice(-effectiveSteps);
      const remainingPart = str.slice(0, length - effectiveSteps);

      return partToMove + remainingPart;
    },
  },
  computed: {
    rules() {
      return {
        required: (value) => !!value || "This field is required.",
        passwordMatch: (value) =>
          value === this.password || "Passwords do not match.",
        emailFormat: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value) || "Invalid email format.";
        },
        passwordStrength: (value) => {
          const lengthValid = value.length >= 8;
          const lowercaseValid = /[a-z]/.test(value);
          const uppercaseValid = /[A-Z]/.test(value);
          const numberValid = /[0-9]/.test(value);
          const symbolValid = /[^A-Za-z0-9]/.test(value);

          if (!lengthValid)
            return "Password must be at least 8 characters long.";
          if (!lowercaseValid)
            return "Password must include lowercase letters.";
          if (!uppercaseValid)
            return "Password must include uppercase letters.";
          if (!numberValid) return "Password must include numbers.";
          if (!symbolValid) return "Password must include symbols.";
          return true;
        },
      };
    },
    formattedExpirationTime() {
      const minutes = Math.floor(this.expirationTime / 60);
      const seconds = this.expirationTime % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },
  watch: {
    step(newStep, oldStep) {
      if (newStep === 1) {
        this.expirationTime = 300;
        this.timer = setInterval(() => {
          if (this.expirationTime > 0) {
            this.expirationTime--;
          } else {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      } else {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style scoped>
.buttons {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
.v-stepper-items {
  height: 900px;
}
.v-card-text {
  padding: 16px;
}
.v-select {
  margin-bottom: 16px;
}
.qr-code {
  margin: auto;
}
</style>
<v-row>
  <v-col cols="6">
    <v-select
      v-model="profile.sector"
      :items="sectors"
      label="Sector"
      :rules="[rules.required]"
      outlined
    ></v-select>
  </v-col>
  <v-col cols="6">
    <v-select
      v-model="profile.securityChallenges"
      :items="securityChallenges"
      label="Security Challenges"
      :rules="[rules.required]"
      outlined
    ></v-select>
  </v-col>
</v-row>
<v-row>
  <v-col cols="6">
    <v-select
      v-model="profile.existingSolutions"
      :items="existingSolutions"
      label="Existing Solutions"
      :rules="[rules.required]"
      outlined
    ></v-select>
  </v-col>
  <v-col cols="6">
    <v-select
      v-model="profile.annualBudget"
      :items="budgetRanges"
      label="Annual Budget"
      :rules="[rules.required]"
      outlined
    ></v-select>
  </v-col>
</v-row>
