/*
=========================================================
* Vite Soft UI Dashboard PRO - v1.0.0
=========================================================
* Product Page: https://creative-tim.com/product/vite-soft-ui-dashboard-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
Coded by www.creative-tim.com
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/custom.css";
import "./assets/css/marketcss.css"
import "./assets/css/nucleo-svg.css";
import VueTilt from "vue-tilt.js";
import VueSweetalert2 from "vue-sweetalert2";
import SoftUIDashboard from "./soft-ui-dashboard";
import ability from "@/libs/acl/ability";
import { abilitiesPlugin } from "@casl/vue";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { notLoginAlert } from "@/libs/BasicAlert";
import { axiosJWTIns, validateToken } from "@/libs/jwt_axios"
import { isUserLoggedIn } from "@/auth/jwt/utils";
import { canNavigate } from "@/libs/acl/routeProtection"
import Popup from "@/components/Popup.vue"
import socketService from '@/libs/socket/socket.js';
import notificationService from "./libs/audio/audio";
import {useTickersStore} from "@/libs/tickers/tickers"

let s_token = Cookies.get('s_token');

const appInstance = createApp(App);

appInstance.use(store);
appInstance.use(VueTilt);
appInstance.use(VueSweetalert2);
appInstance.use(SoftUIDashboard);
appInstance.use(abilitiesPlugin, ability, Swal);
appInstance.component('Popup', Popup) // Register the Popup component globally

router.beforeEach(async (to, _, next) => {

    const isLoggedIn = await isUserLoggedIn()

    if (!canNavigate(to)) {

        if (!isLoggedIn) {

            return next({ name: 'Signin' })
        }
        return next({ name: 'unauthorized' })
    }
    if (to.meta.redirectIfLoggedIn && isLoggedIn) {
        console.log("CAN NEVIGAT")
        return next({ name: 'Default' })
    }
    return next()
})
router.afterEach(async (to) => {
    // here we are confirming token validation with ability from the backend
    const isLoggedIn = await isUserLoggedIn()
    if (isLoggedIn) {
        validateToken(to)
    } else {
        if (to.fullPath !== '/signin') {
            notLoginAlert()
        }
    }
})

function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}

if (s_token != undefined) {
    
    appInstance.use(socketService); // Register the service
    const { fetchData } = useTickersStore(); // ticker store fetch
    fetchData();

}

// Provide the notification service globally
appInstance.provide('notificationService', notificationService);


// app.mount('#app')
appInstance.use(router);
appInstance.mount("#app");
