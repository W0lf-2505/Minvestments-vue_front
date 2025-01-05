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
          :class="getRoute() === 'dashboards' ? 'active' : ''"
        >
          <template #icon>
            <icon name="dashboard" />
          </template>
          <template #list>
            <ul class="nav ms-4 ps-3">
              <!-- nav links -->
              <sidenav-item :to="{ name: 'Default' }" mini-icon="D" text="Dashboard" />
              <!-- <sidenav-item :to="{ name: 'Automotive' }" mini-icon="A" text="Automotive" />
              <sidenav-item :to="{ name: 'Smart Home' }" mini-icon="S" text="Smart Home" />
              <sidenav-collapse-item refer="vrExamples" mini-icon="V" text="Virtual Reality">
                <template #nav-child-item>
                  <sidenav-item :to="{ name: 'VR Default' }" mini-icon="V" text="VR Default" />
                  <sidenav-item :to="{ name: 'VR Info' }" mini-icon="V" text="VR Info" />
                </template>
              </sidenav-collapse-item>
              <sidenav-item :to="{ name: 'CRM' }" mini-icon="C" text="CRM" /> -->
            </ul>
          </template>
        </sidenav-collapse>
      </li>
    </ul>
  </div>
  
</template>
<script>
import Icon from "@/components/Icon.vue";
import SidenavItem from "./SidenavItem.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCard from "./SidenavCard.vue";
import SidenavCollapseItem from "./SidenavCollapseItem.vue";

export default {
  name: "SidenavList",
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
    };
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
  },
};
</script>
