<template>
  <v-container fluid class="rounded-lg fill-height">
    <v-row no-gutters align="center">
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

      <v-col cols="12" md="6" class="pa-12 d-flex flex-column justify-center">
        <v-card
          v-if="!showQRCode"
          color="#ffffff"
          class="mx-auto pa-12 pb-8"
          elevation="0"
        >
          <v-form ref="form" v-model="valid" lazy-validation>
            <div
              class="text-h4 font-weight-bold mb-4 text-center"
              style="color: #000"
            >
              Welcome back!
            </div>
            <div
              class="text-body-2 font-weight-light mb-8 text-center"
              style="color: #707070"
            >
              Enhance your security and boost your efficiency with
              <strong>CyberQuantum</strong>. Get started now to protect your
              digital future.
            </div>

            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email]"
              :error-messages="emailErrors"
              placeholder="Username"
              variant="outlined"
              dense
              class="mb-4 rounded-xl"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password *"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required, rules.passwordStrength]"
              placeholder="Password"
              outlined
              dense
              class="mb-2 rounded-xl"
            ></v-text-field>

            <div class="d-flex justify-end mb-4">
              <a
                class="text-caption text-decoration-none"
                href="#"
                style="color: #707070"
              >
                Forgot Password?
              </a>
            </div>

            <v-btn
              color="black"
              size="large"
              block
              elevation="0"
              class="mb-6 rounded-lg"
              @click="sendLoginData"
            >
              Login
            </v-btn>

            <div class="text-center">
              <span class="text-caption" style="color: #707070"
                >Not a member?
              </span>
              <a class="text-decoration-none" href="#" style="color: #00bfa5">
                Register now
              </a>
            </div>
          </v-form>
        </v-card>

        <v-card
          v-else
          color="#ffffff"
          class="mx-auto pa-12 pb-8 w-100"
          elevation="10"
        >
          <div
            class="text-h5 text-center font-weight-bold mb-4"
            style="color: #000"
          >
            Verification Code
          </div>
          <div
            class="text-subtitle-2 text-center font-weight-light mb-4"
            style="color: #707070"
          >
            Please enter the verification code sent to your email.
          </div>

          <v-otp-input
            v-model="otpCode"
            :class="{ error: otpValidMessage === 'Invalid OTP Code.' }"
            class="mb-8"
            divider="•"
            length="6"
            variant="outlined"
          ></v-otp-input>

          <v-btn color="primary" block @click="validateOTP"> Verify OTP </v-btn>

          <div
            v-if="otpValidMessage"
            class="text-caption text-center mt-4"
            :style="{
              color: otpValidMessage === 'Invalid OTP Code.' ? 'red' : 'green',
            }"
          >
            {{ otpValidMessage }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const valid = ref(false);

const showPassword = ref(false);
const email = ref("");
const password = ref("");
const emailErrors = ref<string[]>([]);
const showQRCode = ref(false);
const otpCode = ref("");
const otpValidMessage = ref("");

const rules = {
  required: (value: string) => !!value || "Required.",
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value);
  },
  passwordStrength: (value: string) => {
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
};

const sendLoginData = async () => {
  if (valid) {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      if (!response.ok) {
        throw new Error(`error`);
      }
      showQRCode.value = true;
    } catch (e) {
      console.error("Error login:", e);
    }
  }
};

const validateOTP = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/auth/validate-totp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          otp: otpCode.value,
        }),
      }
    );

    const data = await response.json();
    otpValidMessage.value = data.message;
    console.log(data);
    if (data.status === "success") {
      otpCode.value = "";
      ///location.reload();
    } else {
      otpValidMessage.value = "Invalid OTP Code.";
    }
  } catch (error) {
    console.error("Error validating OTP:", error);
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
.error {
  border-color: red !important;
}
.text-blue:hover {
  color: #bbdefb;
}
.text-caption {
  color: rgba(0, 0, 0, 0.7);
}
</style>
