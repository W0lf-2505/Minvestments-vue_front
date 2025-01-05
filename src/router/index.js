import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from '../views/NotFound.vue';
import Dashboard from "../views/Dashboard.vue";
import License from "../views/License.vue"
import Signin from "../views/Signin.vue";
import Portfolio from "../views/Portfolio.vue";
import Marketnews from "../views/Marketnews.vue";
import Domesticnews from "../views/Domesticnews.vue";
import Overview from "../views/profile/Overview.vue";

import TradeBreeze from "../views/Tradebreeze/breeze.vue"
import Virtual_Platform from "../views/virtualTrade/virtual_trade.vue"

import SuccessLog from "../views/Tradebreeze/successlog.vue"

import Adduser from "../components/Adduser.vue";
import VRDefault from "../components/VRDefault.vue";
import Analytics from "@/components/analytics/Analytics.vue";


const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
    meta: { title: '/', resource: 'dashboard', action: 'manage' },
  },
  {
    path: "/dashboard",
    name: "Default",
    component: Dashboard,
    meta: { title: 'Default', resource: 'dashboard', action: 'manage' },
  },

  {
    path: "/signin",
    name: "Signin",
    component: Signin,
    meta: { title: 'Login', resource: 'auth', redirectIfLoggedIn: true }
  },

  {
    path: "/license",
    name: "License",
    component: License,
    meta: { title: 'License', resource: 'dashboard', action: 'manage'}
  },

  {
    path: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
    meta: { title: 'Portfolio', resource: 'dashboard', action: 'manage' }
  },

  {
    path: "/marketnews",
    name: "Marketnews",
    component: Marketnews,
    meta: { title: 'Marketnews', resource: 'dashboard', action: 'manage' }
  },

  {
    path: "/domesticnews",
    name: "Domesticnews",
    component: Domesticnews,
    meta: { title: 'Domesticnews', resource: 'dashboard', action: 'manage' }
  },

  {
    path: "/listingusers",
    name: "listingusers",
    component: Adduser,
    meta: { title: 'listingusers', resource: 'root_jobs', action: 'superu' },
  },
  {
    path: "/traderplatform",
    name: "traderplatform",
    component: TradeBreeze,
    meta: {title: 'traderplatform', resource: 't_platform', action: 'manage'}
  },
  {
    path: "/virtual",
    name: "virtual_platform",
    component: Virtual_Platform,
    meta: {title: 'virtual_platform', resource: 't_platform', action: 'manage'}
  },
  {
    path: "/authsuccess",
    name: "authsuccess",
    component: SuccessLog,
    meta: {title: 'authsuccess', resource: 't_platform', action: 'manage'}
  },

  {
    path: "/analytics",
    name: "Analytics",
    component: Analytics,
    meta: { title: 'Analytics', resource: 'dashboard', action: 'manage' },
  },
  {
    path: "/vr_dashboard",
    name: "VR Default",
    component: VRDefault,
    meta: { title: 'Default', resource: 'dashboard', action: 'manage' },
  },
  {
     path: "/profile/overview",
     name: "Profile Overview",
     component: Overview,
     meta: { title: 'Default', resource: 'dashboard', action: 'manage' },
   },
  
  { path: '/:catchAll(.*)*', name: 'unauthorized', component: NotFound, meta: { title: 'Login', resource: 'dashboard', action: 'manage' } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active",
});

export default router;
