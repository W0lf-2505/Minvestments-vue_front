<template>
  <aside
    id="sidenav-main"
    :data-color="sidebarColor"
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="$store.state.isRTL ? 'me-3 rotate-caret' : 'ms-3'"
  >
    <div class="sidenav-header">
      <i
        id="iconSidenav"
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
      ></i>
      <router-link class="m-0 navbar-brand" :to="{ name: '/' }">
        <img v-if="darkMode" :src="logodark" class="navbar-brand-img h-100" alt="main_logo_dark" />
        <img v-else :src="logo" class="navbar-brand-img h-100" alt="main_logo" />
        <span class="ms-1 font-weight-bold">MInvestments Platform</span>
      </router-link>
    </div>
    <hr class="mt-0 horizontal dark" />
    <sidenav-list :card-bg="customClass" />
  </aside>
</template>
<script>
import { mapGetters } from "vuex";
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/brand-logo/logo-without-bg.png";
import logodark from "@/assets/img/brand-logo/logo-without-bg-dark.png";
import { isDate } from 'date-fns';
import Cookies from "js-cookie";

export default {
  name: "Index",
  components: {
    SidenavList,
  },
  props: {
    customClass: { type: String, default: "" },
  },
  data() {
    return {
      logo,
      logodark,
      color: "success",
      isDark: false,
    };
  },
  computed: {
    ...mapGetters(["sidebarColor",
      "darkMode",]),
    
    set(){
      this.isDark = this.darkMode;
    }
      

  },
  mounted() {
    this.isDark = Cookies.get('undark')
  },
};
</script>
