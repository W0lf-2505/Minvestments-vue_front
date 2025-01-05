<template>
  <nav v-bind="$attrs" id="navbarBlur" class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" :class="$store.state.isRTL ? 'top-1 position-sticky z-index-sticky' : ''
    " data-scroll="true">
    <div class="px-3 py-1 container-fluid">
      <!-- <breadcrumbs :current-page="currentRouteName" :text-white="textWhite" /> -->
      <div class="sidenav-toggler sidenav-toggler-inner d-xl-block d-none" :class="$store.state.isRTL ? 'me-3' : ''">
        <a href="#" class="p-0 nav-link text-body" @click.prevent="$store.dispatch('toggleSidebarPinned')">

          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line" :class="textWhite ? 'bg-white' : ''"></i>
            <i class="sidenav-toggler-line" :class="textWhite ? 'bg-white' : ''"></i>
            <i class="sidenav-toggler-line" :class="textWhite ? 'bg-white' : ''"></i>
          </div>
        </a>
      </div>
      <div id="navbar" class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="$store.state.isRTL ? 'px-0' : 'me-sm-4'">
        <div class="pe-md-3 d-flex align-items-center" :class="$store.state.isRTL ? 'me-md-auto' : 'ms-md-auto'">
        </div>
        <ul v-if="profilename != null" class="hide navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">

          </li>
          <li class="px-3 nav-item d-flex align-items-center">

          </li>
          <li class="nav-item dropdown d-flex align-items-center">
              <span class="px-0 dropdown-toggle text-dark font-weight-bolder d-flex align-items-center" type="button"
                id="dropdownMenuButton2" data-bs-toggle="dropdown1" aria-expanded="false" @click="showDrop = !showDrop">{{ profilename }}</span>

              <ul v-if="showDrop" class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4 show" aria-labelledby="dropdownMenuButton2">
                <li class="mb-2"><a class="dropdown-item" href="javascript:;" onclick="window.location.href='/#/profile/overview'">My
                    Profile</a></li>
                <li class="px-3 nav-item d-flex align-items-center mb-2">
                  <div class="d-flex">
                    Darkmode
                  </div>
                  <div class="form-check form-switch ps-3">
                    <input id="toggleDarkMode" v-model="isDarkMode" v-on:click="DarkModesave"
                      class="mt-1 form-check-input" :class="$store.state.isRTL ? 'float-end  me-auto' : ' ms-auto'"
                      type="checkbox" />
                  </div>
                </li>
                <li class="mb-2"><a class="dropdown-item" href="javascript:;" onclick="window.location.href='/#/license'">License</a>
                </li>
                <li class="mb-2"><a class="dropdown-item" v-on:click="signout">Sign Out</a></li>
              </ul>
          </li>
          <!-- <li v-else class="nav-item d-flex align-items-center">
            <router-link
              :to="{ name: 'Signin' }"
              class="px-0 nav-link font-weight-bold"
              :class="textWhite ? textWhite : 'text-body'"
            >
              <i class="fa fa-user" :class="$store.state.isRTL ? 'ms-sm-2' : 'me-sm-1'"></i>
              <span v-if="$store.state.isRTL" class="d-sm-inline d-none">يسجل دخول</span>
              <span v-else class="d-sm-inline d-none">Sign In</span>
            </router-link>
          </li> -->
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a id="iconNavbarSidenav" href="#" class="p-0 nav-link text-body"
              @click.prevent="$store.dispatch('toggleSidebarPinned')">
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
          &nbsp;&nbsp;&nbsp;
          <!-- <li class="px-3 nav-item d-flex align-items-center"> -->
            <!-- <a
              class="p-0 nav-link"
              :class="textWhite ? textWhite : 'text-body'"
              @click="$store.dispatch('showConfigurator')"
            >
              <i class="cursor-pointer fa fa-cog fixed-plugin-button-nav"></i>
            </a> -->
            <!-- <a
          href="#"
          class="p-0 nav-link text-body"
          @click.prevent="$store.dispatch('toggleSidebarPinned')"
        >
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line" :class="textWhite ? 'bg-white' : ''"></i>
            <i class="sidenav-toggler-line" :class="textWhite ? 'bg-white' : ''"></i>
            <i class="sidenav-toggler-line" :class="textWhite ? 'bg-white' : ''"></i>
          </div>
        </a> -->
          <!-- </li> -->
          <li class="nav-item dropdown d-flex align-items-center" :class="$store.state.isRTL ? 'ps-2' : 'pe-2'">
            <a id="dropdownMenuButton1" href="#" class="p-0 nav-link" :class="[
              textWhite ? textWhite : 'text-body',
              showMenu ? 'show' : '',
            ]" data-bs-toggle="dropdown2" aria-expanded="false" @click="showMenu = !showMenu">
              <i class="cursor-pointer fa fa-bell"></i>
            </a>
            <ul v-if="showMenu" class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4 show"
              aria-labelledby="dropdownMenuButton1">
              <li class="mb-2">
                <a class="dropdown-item border-radius-md" href="javascript:;">

                </a>
              </li>

            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import Breadcrumbs from "./Breadcrumbs.vue";
import Cookies from "js-cookie";
import { mapGetters } from "vuex";
import { axiosClientIns } from "@/libs/client_axios";

export default {
  name: "Navbar",

  components: {
    Breadcrumbs
  },
  props: {
    textWhite: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showMenu: false,
      profilename: '',
      access_token: '',
      showDrop: false
    };
  },
  computed: {
    ...mapGetters([
      "darkMode",
    ]),
    currentRouteName() {
      return this.$route.name;
    },
    isDarkMode: {
      get() { return this.darkMode },
      set(val) { this.$store.dispatch('setDarkMode', val) },

    },
  },
  mounted() {

    this.profilename = Cookies.get('full_name')
    // Check the cookie value and update the computed property isDarkModeCookie
    const cookieValue = this.getCookie("undark");
    this.isDarkMode = cookieValue === "true";
  },
  methods: {
    signout() {
      Cookies.remove('authData')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('full_name')
      Cookies.remove('uid')
      Cookies.remove('full_name')
      Cookies.remove('vite_username')
      Cookies.remove('join_date')
      Cookies.remove('s_token')
      Cookies.remove('s_intract')
      Cookies.remove('s2_intract')
      Cookies.remove('v_intract')
      Cookies.remove('v2_intract')
      this.$router.push('/')
    },
    DarkModesave() {
      axiosClientIns
        .post("/user_settings", {
          'filter': { "user": Cookies.get('vite_username') },
          'fields': { "darkMode": !this.darkMode },
          'username': Cookies.get('vite_username'),
          'uid': Cookies.get('uid')
        }).then(response => {
          Cookies.set("undark", this.darkMode)
        })
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    },

    setCookie(name, value, daysToExpire) {
      const date = new Date();
      date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value};${expires};path=/`;
    },



  },
};
</script>
