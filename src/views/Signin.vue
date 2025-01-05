<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur blur-rounded my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-success"
          :dark-mode="true"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content main-content-bg">
    <section>
      <div class="page-header min-vh-75">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-6 d-flex flex-column">
              <div class="mt-8 card card-plain">
                <div class="pb-0 card-header text-start">
                  <h3 class="font-weight-bolder text-info text-gradient">Welcome back</h3>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form" class="text-start">
                    <label>Email</label>
                    <vsud-input v-model="userEmail" id="email" type="email" placeholder="Email" name="email" required/>
                    <label>Password</label>
                    <vsud-input v-model="password" id="password" type="password" placeholder="Password" name="password" required/>
                    <vsud-switch v-model="rememberme" @change="toggleSwitch" name="rememberme" id="rememberMe">Remember me</vsud-switch>
                    <div class="text-center">
                      <vsud-button
                        class="my-4 mb-2"
                        variant="gradient"
                        color="info"
                        full-width
                        v-on:click.prevent="logIn"
                      >Sign in</vsud-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdZTPK6lQszqS7U-KGy5lezuB8WJ5VvcqTePJiStycPiqLw0w/viewform"
                      class="text-info text-gradient font-weight-bold"
                      target="_blank"
                    >Sign up Request</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8">
                <div
                  class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                  :style="{
                    backgroundImage:
                      `url(${bgImg})`,
                  }"
                ></div>
        
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <app-footer />
</template>

<script>
import bgImg from '@/assets/img/custom/bull-bear.png';

import Navbar from "@/components/Navbar.vue";
import AppFooter from "@/components/Footer.vue";
import VsudInput from "@/components/VsudInput.vue";
import VsudSwitch from "@/components/VsudSwitch.vue";
import VsudButton from "@/components/VsudButton.vue";
import useJwt from "@/auth/jwt/useJwt";
import ability from "@/libs/acl/ability";
import {errorAlert, notAuthorizedAlert, notLoginAlert, somethingWentWrong, loginSuccess} from "@/libs/BasicAlert";
import {axiosJWTIns} from "@/libs/jwt_axios";
import Cookies from "js-cookie";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "SigninCover",
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    Navbar,
    AppFooter,
    VsudInput,
    VsudSwitch,
    VsudButton,
  },
  data: () => ({
    bgImg,
    userEmail: '',
    resetEmail: '',
    password: '',
    showError: false,
    allusers: [],
    errorMessage: '',
    is_resetflow: false,
    is_otp: false,
    otp:'',
    new_pass:'',
    repeat_pass:'', 
    rememberme: true
    }
    
  ),
  methods: {
    toggleSwitch() {
      this.rememberme = !this.rememberme; // Toggle the state (true to false, false to true)
    },
    logIn: async function () {
      await useJwt.login({
        email: this.userEmail,
        password: this.password,
      }).then(response => {
        this.errorMessage = ''
        this.showError = false
        if (response.data.status) {
          useJwt.setToken(response.data.access_token)
          useJwt.setRefreshToken(response.data.refresh_token)
          Cookies.set('authData', JSON.stringify(response.data))
          Cookies.set('vite_username', response.data.username)
          Cookies.set('full_name', response.data.full_name)
          if (this.rememberme){
            Cookies.set('email', response.data.email)
          }
          Cookies.set('uid', response.data.uid)
          Cookies.set('join_date', response.data.join_date)
          Cookies.set('undark', response.data.undark)
          ability.update(response.data.ability)
          loginSuccess()
          
        } else {
          errorAlert(response.data.message)
        }
      }).catch(error => {
        if (error.response.status == 401){
          notLoginAlert()
        } else if (error.response.status == 403){
          notAuthorizedAlert()
        } else {
          somethingWentWrong()
        }
      })
    },
    is_reset(){
      this.errorMessage = ''
      this.showError = false
      this.is_resetflow = !this.is_resetflow
    },
    is_otp_enabled(){
      this.errorMessage = ''
      this.showError = false
      this.is_otp = !this.is_otp
    },
    resetPassword(){
      this.errorMessage = ''
      this.showError = false
      axiosJWTIns.post('/reset-password', {
        'username': this.resetEmail,
      })
          .then(response => {
            this.errorMessage = ''
            this.errorMessage = response.data.message
            if (response.data.status) {
              this.is_otp = true
              this.is_resetflow = false
              this.errorMessage = ''
              this.errorMessage = response.data.message
              this.showError = true
            }else {
              this.errorMessage = ''
              this.errorMessage = response.data.message
              this.showError = true
            }
          })
          .catch(error => {
                if (error.response.status === 401) {
                  errorAlert(error.response.message)
                }
          })
    },
    updatePassword(){
      this.errorMessage = ''
      this.showError = false
      axiosJWTIns.post('/update-password', {
        'username': this.resetEmail,
        'otp': this.otp,
        'new_pass': this.new_pass,
        'repeat_pass': this.repeat_pass,
      })
          .then(response => {
            this.errorMessage = ''
            this.errorMessage = response.data.message
            this.showError = true
          })
          .catch(error => {
            this.errorMessage = ''
            this.errorMessage = error.response.data.message
            this.showError = true
          })
    }
  },
  beforeMount() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
    if (Cookies.get('email')){
      this.userEmail = Cookies.get('email')
    }
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
};
</script>
