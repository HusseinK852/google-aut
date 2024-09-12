<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-container>
        <v-card class="pa-5" max-width="600">
          <v-card-title>Sign Up</v-card-title>

          <v-card-text>
            <v-form v-if="!showQRCode">
              <v-text-field
                v-model="email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>

              <v-btn @click="handleSignUp">Sign Up</v-btn>
            </v-form>

            <div v-if="showQRCode" class="text-center">
              <p>Scan this QR Code with Google Authenticator</p>
              <v-img
                :src="qrCodeUrl"
                alt="QR Code"
                max-width="200"
                class="mx-auto"
              ></v-img>

              <v-text-field
                v-model="otpCode"
                label="Enter OTP Code"
                required
              ></v-text-field>

              <v-btn @click="validateOTP">Validate OTP</v-btn>

              <p v-if="otpValidMessage" class="mt-2">{{ otpValidMessage }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");
const otpCode = ref("");
const qrCodeUrl = ref("");
const showQRCode = ref(false);
const otpValidMessage = ref("");

const handleSignUp = async () => {
  try {
    const response = await axios.post("http://localhost:8000/generate-totp", {
      email: email.value,
    });
    qrCodeUrl.value = response.data.qrCodeUrl;
    showQRCode.value = true;
  } catch (error) {
    console.error("Error during signup:", error);
  }
};

const validateOTP = async () => {
  try {
    const response = await axios.post("http://localhost:8000/validate-totp", {
      email: email.value,
      otp: otpCode.value,
    });
    otpValidMessage.value = response.data.message;
  } catch (error) {
    otpValidMessage.value = "Invalid OTP Code.";
    console.error("Error validating OTP:", error);
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mx-auto {
  margin: auto;
}
</style>
