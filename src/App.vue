<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card
          v-if="!showQRCode"
          color="#071438"
          class="mx-auto pa-12 pb-8 h-100"
          elevation="10"
          rounded="lg"
        >
          <v-img
            class="mx-auto my-6"
            max-width="180"
            src="https://www.dropbox.com/scl/fi/cffh9kt5pa0niuc7ak9zr/enqode_logo.png?rlkey=qnd5pm8s6ufp5hxzilfztmw6c&dl=1"
            contain
          ></v-img>

          <div class="text-h5 text-light mb-4">Welcome Back</div>

          <v-text-field
            v-model="email"
            :rules="[rules.required, rules.email]"
            :error-messages="emailErrors"
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            @blur="validateEmail"
            class="text-light"
          ></v-text-field>

          <div
            class="d-flex align-center justify-space-between mb-2"
            style="color: rgba(255, 255, 255, 0.8)"
          >
            Password

            <a
              class="text-caption text-decoration-none text-blue"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              style="color: #ffcc00"
            >
              Forgot Password?</a
            >
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
            color="deep-purple lighten-1"
            hide-details
            class="mt-2 mb-6 text-light"
          ></v-checkbox>

          <v-btn
            class="mb-8"
            color="purple darken-2"
            size="large"
            variant="elevated"
            block
            @click="sendLoginData"
            style="transition: all 0.3s ease"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            :elevation="hover ? 15 : 8"
          >
            Log In
          </v-btn>

          <v-card-text class="text-center">
            <a
              class="text-blue text-decoration-none"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              style="color: #ffcc00"
            >
              Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
            </a>
          </v-card-text>
        </v-card>
        <v-card
          v-else
          class="pa-12 pb-8 h-100"
          elevation="10"
          rounded="lg"
          color="#071438"
        >
          <v-sheet
            class="py-8 px-6 mx-auto ma-16 text-center"
            elevation="4"
            max-width="500"
            rounded="lg"
            width="100%"
            color="#fff"
          >
            <h3 class="text-h5">Verification Code</h3>

            <div class="text-subtitle-2 font-weight-light mb-3">
              Please enter the verification code found in the authentication
              app.
            </div>

            <v-otp-input
              v-model="otpCode"
              :class="{ error: otpValidMessage === 'Invalid OTP Code.' }"
              class="mb-8"
              divider="•"
              length="6"
              variant="outlined"
            ></v-otp-input>

            <div class="text-caption">
              <v-btn
                color="primary"
                size="x-small"
                text="Send New Code"
                variant="text"
                @click="validateOTP"
                >Send New Code</v-btn
              >
            </div>

            <div
              v-if="otpValidMessage"
              class="text-caption"
              :style="{
                color:
                  otpValidMessage === 'Invalid OTP Code.' ? 'red' : 'green',
              }"
            >
              {{ otpValidMessage }}
            </div>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="d-none d-md-block pa-0">
        <v-img
          src="https://pfst.cf2.poecdn.net/base/image/e21958dcd1ccc0968f070249d115657bcf1f600a24d124074357f5beba5b5aa2?w=1024&h=1024&pmaid=116851828"
          cover
          height="100%"
        >
          <div class="d-flex align-center justify-center fill-height">
            <div
              class="text-h2 font-weight-bold text-center"
              style="color: rgba(255, 255, 255, 0.85)"
            >
              Welcome.
            </div>
          </div>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const email = ref("");
const password = ref("");
const emailErrors = ref<string[]>([]);
const rememberMe = ref(false);
const showQRCode = ref(false);
const otpCode = ref("");
const otpValidMessage = ref("");
const hover = ref(false);

const rules = {
  required: (value: string) => !!value || "Required.",
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value);
  },
};

const validateEmail = () => {
  emailErrors.value = [];
  if (!email.value) {
    emailErrors.value.push("Email is required.");
  }
  if (!rules.email(email.value)) {
    emailErrors.value.push("Invalid email format.");
  }
};

const sendLoginData = async () => {
  validateEmail();
  if (emailErrors.value.length > 0) {
    alert(emailErrors.value.join(", "));
  } else {
    showQRCode.value = true;
  }
};

const validateOTP = async () => {
  try {
    const response = await fetch("http://localhost:8000/validate-totp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        otp: otpCode.value,
      }),
    });

    const data = await response.json();
    otpValidMessage.value = data.message;
    console.log(data);
    if (data) {
      otpCode.value = "";
      location.reload();
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
    otpValidMessage.value = "Invalid OTP Code.";
  }
};
</script>

<style>
.text-light {
  color: #ffffff !important;
}

.h-100 {
  height: 100%;
}

.text-blue:hover {
  color: #bbdefb;
}

.text-caption {
  color: rgba(255, 255, 255, 0.7);
}

.error {
  border-color: red !important;
}
</style>
