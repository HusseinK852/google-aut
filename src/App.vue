<template>
  <v-container fluid class="pa-0">
    <v-alert
      v-if="NonExistentCompany"
      text="We're sorry, but we were unable to create your account. Please contact us at info@enqode.io for assistance."
      title="Warning"
      type="warning"
      class="position-fixed top-0 w-100"
      style="z-index: 9"
    />
    <v-row no-gutters>
      <v-col cols="12" md="6" v-if="page === 'login'">
        <v-card
          color="#071438"
          class="mx-auto pa-12 pb-8 h-100"
          elevation="8"
          rounded="0"
        >
          <v-img
            class="mx-auto my-6"
            max-width="228"
            src="https://www.dropbox.com/scl/fi/cffh9kt5pa0niuc7ak9zr/enqode_logo.png?rlkey=qnd5pm8s6ufp5hxzilfztmw6c&dl=1"
          >
          </v-img>

          <div class="text-subtitle-1 text-light">Account</div>

          <v-text-field
            v-model="email"
            :rules="[rules.required, rules.email]"
            :error-messages="emailErrors"
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            class="text-light"
          ></v-text-field>

          <div
            class="text-subtitle-1 text-light d-flex align-center justify-space-between"
          >
            Password
            <a
              class="text-caption text-decoration-none text-blue"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              Forgot Password?
            </a>
          </div>

          <v-text-field
            v-model="password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            class="text-light"
          ></v-text-field>

          <v-checkbox
            v-model="rememberMe"
            label="Remember me"
            color="blue"
            hide-details
            class="mt-2 mb-6 text-light"
          >
          </v-checkbox>

          <v-btn
            class="rounded-xl pa-6"
            color="purple"
            size="large"
            variant="flat"
            block
            @click="sendLoginData"
          >
            Log In
          </v-btn>

          <v-card-actions class="d-flex justify-center mt-6">
            <span>Don't have an account?</span>
            <span
              class="cursor-pointer"
              style="color: purple"
              @click="page = 'signup'"
              >Sign up</span
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" v-else>
        <v-card
          color="#071438"
          class="mx-auto pa-12 pb-8 h-100"
          elevation="8"
          rounded="0"
        >
          <v-img
            class="mx-auto my-6"
            max-width="228"
            src="https://www.dropbox.com/scl/fi/cffh9kt5pa0niuc7ak9zr/enqode_logo.png?rlkey=qnd5pm8s6ufp5hxzilfztmw6c&dl=1"
          >
          </v-img>

          <v-stepper
            v-model="step"
            :items="stepperItems"
            show-actions
            style="background-color: #071438; color: #fff"
            alt-labels
            :disabled="validDisabled"
            :hide-actions="hideActions"
            :next-text="loadingBtn"
          >
            <!-- Step 1: Create your account -->
            <template v-slot:item.1>
              <v-card flat color="#071438" class="mx-auto pa-6" rounded="0">
                <v-card-subtitle class="text-center">
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="profile.firstName"
                          label="First name"
                          :rules="[rules.required]"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="profile.lastName"
                          label="Last name"
                          :rules="[rules.required]"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-text-field
                      v-model="profile.email"
                      label="Email address"
                      hint="Use your work email"
                      :rules="[rules.required, rules.email]"
                      outlined
                    ></v-text-field>

                    <v-text-field
                      v-model="profile.companyName"
                      label="Company name"
                      :rules="[rules.required]"
                      outlined
                    >
                    </v-text-field>

                    <v-row>
                      <v-col cols="6">
                        <v-select
                          v-model="profile.companySize"
                          :items="companySizes"
                          label="Company size"
                          :rules="[rules.required]"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="6">
                        <v-select
                          v-model="profile.role"
                          :items="roles"
                          label="Role"
                          :rules="[rules.required]"
                          outlined
                        >
                        </v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-subtitle>
              </v-card>
            </template>

            <!-- Step 2: Choose your security challenges -->
            <template v-slot:item.2>
              <v-card flat color="#071438" class="mx-auto pa-6" rounded="0">
                <v-card-subtitle class="text-center">
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-select
                      v-model="profile.sector"
                      :items="sectors"
                      label="Sector"
                      :rules="[rules.required]"
                      outlined
                    ></v-select>

                    <v-select
                      v-model="profile.securityChallenges"
                      :items="securityChallenges"
                      label="Security Challenges"
                      :rules="[rules.required]"
                      outlined
                      multiple
                    ></v-select>

                    <v-select
                      v-model="profile.existingSolutions"
                      :items="existingSolutions"
                      label="Existing Solutions"
                      :rules="[rules.required]"
                      outlined
                      multiple
                    ></v-select>

                    <v-select
                      v-model="profile.annualBudget"
                      :items="budgetRanges"
                      label="Annual Budget"
                      :rules="[rules.required]"
                      outlined
                    ></v-select>
                  </v-form>
                </v-card-subtitle>
              </v-card>
            </template>

            <!-- Step 3: Authenticate via QR Code -->
            <template v-slot:item.3>
              <v-card
                class="mx-auto text-center pa-10"
                flat
                color="#071438"
                rounded="0"
              >
                <v-icon
                  color="teal-darken-2"
                  icon="mdi-qrcode"
                  size="large"
                ></v-icon>
                <v-card-title class="justify-center mb-5">
                  AUTHENTICATE VIA QR CODE
                </v-card-title>
                <v-divider />
                <v-card-subtitle class="px-4 text-center my-5 text-subtitle-1">
                  Scan the QR code below to authenticate your account.
                </v-card-subtitle>
                <v-img src=""></v-img>
              </v-card>
            </template>
          </v-stepper>
          <v-card-actions class="d-flex justify-center mt-6">
            <span>Do you already have an account?</span>
            <span
              class="cursor-pointer"
              style="color: purple"
              @click="page = 'login'"
              >Log in</span
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="d-none d-md-block pa-0">
        <v-img
          src="https://pfst.cf2.poecdn.net/base/image/e21958dcd1ccc0968f070249d115657bcf1f600a24d124074357f5beba5b5aa2?w=1024&h=1024&pmaid=116851828"
          cover
          height="100%"
        >
          <div class="d-flex align-center justify-center fill-height">
            <div class="text-h2 font-weight-bold text-center text-white">
              Welcome.
            </div>
          </div>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    UnprofessionalEmail: false,
    NonExistentCompany: false,
    checkingCompany: false,
    loading: false,
    valid: false,
    visible: false,
    email: "",
    password: "",
    emailErrors: [],
    rememberMe: false,
    page: "login",
    stepperItems: [
      {
        title: "Create your account",
        subtitle: "Enter your personal and company details",
      },
      {
        title: "Choose your security challenges",
        subtitle: "Select your sector and security preferences",
      },
      {
        title: "Authenticate via QR Code",
      },
    ],
    step: 1,
    expirationTime: 0,
    emailCode: "",
    codeError: false,
    qrCode: "",
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      companySize: "",
      role: "",
      sector: "",
      securityChallenges: [],
      existingSolutions: [],
      annualBudget: "",
    },
    companySizes: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    roles: ["CISO", "CIO", "CTO", "CEO", "CFO", "COO", "Other"],
    sectors: [
      "Technology",
      "Finance",
      "Healthcare",
      "Manufacturing",
      "Retail",
      "Education",
      "Government",
      "Other",
    ],
    securityChallenges: [
      "Data Breaches",
      "Insider Threats",
      "Compliance",
      "Cloud Security",
      "Ransomware",
      "Phishing",
      "IoT Security",
      "Other",
    ],
    existingSolutions: [
      "Firewalls",
      "Antivirus",
      "SIEM",
      "DLP",
      "IAM",
      "Encryption",
      "EDR",
      "Other",
    ],
    budgetRanges: [
      "$0 - $50,000",
      "$50,001 - $100,000",
      "$100,001 - $500,000",
      "$500,001 - $1,000,000",
      "$1,000,001+",
    ],
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const personalEmailPattern =
          /^(.*?@gmail\.com|.*?@hotmail\.com|.*?@yahoo\.com|.*?@outlook\.com)$/i;

        if (!pattern.test(value)) {
          return "Invalid e-mail.";
        }

        if (personalEmailPattern.test(value)) {
          return "This is a personal email, please use a company email.";
        }

        return true;
      },

      passwordStrength: (value) => {
        const lengthValid = value.length >= 8;
        const lowercaseValid = /[a-z]/.test(value);
        const uppercaseValid = /[A-Z]/.test(value);
        const numberValid = /[0-9]/.test(value);
        const symbolValid = /[^A-Za-z0-9]/.test(value);

        if (!lengthValid) return "Password must be at least 8 characters long.";
        if (!lowercaseValid) return "Password must include lowercase letters.";
        if (!uppercaseValid) return "Password must include uppercase letters.";
        if (!numberValid) return "Password must include numbers.";
        if (!symbolValid) return "Password must include symbols.";
        return true;
      },
    },
  }),
  methods: {
    async checkCompany() {
      this.step--;
      this.loading = true;
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/checkCompany?companyName=${this.profile.companyName}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.status === "error") {
          this.showAlert();
        } else {
          this.NonExistentCompany = false;
          this.checkingCompany = true;
          this.step += 1;
          this.loading = false;
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        this.showAlert();
      } finally {
        this.loading = false;
      }
    },
    sendLoginData() {
      if (this.password && this.email) {
        this.send({
          event: "click",
          name: "login",
          payload: {
            email: this.email,
            password: this.password,
          },
        });
      }
    },
    showAlert() {
      this.NonExistentCompany = true;
      this.loading = false;

      setTimeout(() => {
        this.NonExistentCompany = false;
      }, 5000);
    },
    async sendSignUpData() {
      // this.send({
      //   event: "click",
      //   name: "submitProfile",
      //   payload: {
      //     profile: this.profile,
      //   },
      // });
    },

    resetProfileForm() {
      Object.keys(this.profile).forEach((key) => {
        if (Array.isArray(this.profile[key])) {
          this.profile[key] = [];
        } else {
          this.profile[key] = "";
        }
      });
    },
  },
  computed: {
    loadingBtn() {
      if (this.loading) {
        return "Checking";
      } else {
        return "next";
      }
    },
    hideActions() {
      return this.step === 3;
    },
    validDisabled() {
      if (!this.valid) {
        if (this.step === 1) {
          return true;
        }
        return "next";
      }
      if (this.loading) {
        return true;
      }
      return false;
    },
  },
  watch: {
    async step(newStep) {
      if (newStep === 2) {
        if (!this.checkingCompany) {
          await this.checkCompany();
        }
      }
      if (newStep === 3) {
        await this.sendSignUpData();
      }
    },
  },
};
</script>

<style>
.text-light {
  color: #ffffff !important;
}

.h-100 {
  height: 100%;
}

.v-card {
  border: none;
}

.v-messages__message {
  color: #ffffff;
}
</style>
