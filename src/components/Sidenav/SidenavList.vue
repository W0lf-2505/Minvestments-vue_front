<template>
  <div
    id="sidenav-collapse-main"
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse
          collapse-ref="Platform"
          nav-text="Platform"
          class="active"
          :class="getRoute() === 'dashboard' ? 'active' : ''"
        >
          <template #icon>
            <icon name="dashboard" />
          </template>
          <template #list>


            <ul class="nav ms-4 ps-3">
              <!-- nav links @click.prevent="$store.dispatch('toggleSidebarPinned') -->
              <sidenav-item @click.prevent="makesidebarmini" :to="{ name: 'Default' }" mini-icon="D" text="Dashboard"/>
              <sidenav-item @click.prevent="makesidebarmini" :to="{ name: 'Portfolio' }" mini-icon="P" text="Portfolio"/>
              <!-- <sidenav-item :to="{ name: 'Analytics' }" mini-icon="A" text="Analytics" /> -->
              <sidenav-item @click.prevent="makesidebarmini" :to="{ name: 'Marketnews' }" mini-icon="M" text="Global News"/>
              <sidenav-item  @click.prevent="makesidebarmini" :to="{ name: 'Domesticnews' }" mini-icon="D" text="Domestic News"/>
              <!-- <sidenav-collapse-item refer="vrExamples" mini-icon="V" text="Virtual Reality">
                <template #nav-child-item> -->
              <sidenav-item  @click.prevent="makesidebarmini" :to="{ name: 'VR Default' }" mini-icon="V" text="VR Default"/>
                  <!-- <sidenav-item :to="{ name: 'VR Info' }" mini-icon="V" text="VR Info" />
                </template>
              </sidenav-collapse-item>
              <sidenav-item :to="{ name: 'CRM' }" mini-icon="C" text="CRM" /> -->
              
            </ul>
          </template>
        </sidenav-collapse>
      </li>

      
      <li v-if="tradekregatu" class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >Trade</h6>
      </li>
      <li v-if="tradekregatu" class="nav-item">
        <sidenav-collapse
          collapse-ref="Trading Platform"
          nav-text="Trading Platform"
          :class="getRoute() === ('traderplatform'||'optionchain') ? 'active' : ''"
        >
        <template #icon>
            <icon name="basic" />
          </template>
          <template #list>

            <ul class="nav ms-4 ps-3">
              <sidenav-item v-if="tradekregatu" @click.prevent="makesidebarmini" :to="{ name: 'traderplatform' }" mini-icon="T" text="Trade"/>
              <sidenav-item v-if="tradekregatu" @click.prevent="makesidebarmini" :to="{ name: 'virtual_platform' }" mini-icon="V" text="Virtual Trading"/>
              
            </ul>
          </template>
        </sidenav-collapse></li>

      <li v-if="adminhaitu" class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >Admin</h6>
      </li>
      <li v-if="adminhaitu" class="nav-item">
        <sidenav-collapse
          collapse-ref="Admin Control"
          nav-text="Admin Control"
          :class="getRoute() === 'listingusers' ? 'active' : ''"
        >
        <template #icon>
            <icon name="settings" />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <sidenav-item v-if="adminhaitu" @click.prevent="makesidebarmini" :to="{ name: 'listingusers' }" mini-icon="A" text="Users"/>
              
            </ul>


          </template>
        </sidenav-collapse></li>
    </ul>
  </div>
  
</template>
<script>
import Icon from "@/components/Icon.vue";
import SidenavItem from "./SidenavItem.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCard from "./SidenavCard.vue";
import SidenavCollapseItem from "./SidenavCollapseItem.vue";
import ability from "@/libs/acl/ability"

export default {
  name: "SidenavList",
  data(){
    return{
      makemini:false
    }
  },
  components: {
    Icon,
    SidenavItem,
    SidenavCollapse,
    SidenavCard,
    SidenavCollapseItem,
  },
  props: {
    cardBg: { type: String, default: "" },
  },
  data() {
    return {
      title: "MInvestments Platform",
      controls: "dashboardsExamples",
      isActive: "active",
      app_role: "",
      adminhaitu: false,
      tradekregatu: false,
    };
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
  makesidebarmini() {

    if (window.innerWidth < 993) {
      this.$store.dispatch('setSidebarPinned', false)
    }
  },
  },
  mounted() {
    if(ability.can('superu','root_jobs')){
      this.adminhaitu = true
    }else{
      this.adminhaitu = false
    }
    if(ability.can('manage','t_platform')){
      this.tradekregatu = true
    }else{
      this.tradekregatu = false
    }
  },
  
};
</script>
