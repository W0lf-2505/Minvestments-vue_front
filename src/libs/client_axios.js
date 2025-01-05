// axios
import axios from 'axios'
import Cookies from "js-cookie";
export const axiosClientIns = axios.create({
    // You can add your headers here
    // ================================
    baseURL: import.meta.env.VITE_APP_Backend_API,
    timeout: 500000000,
    headers: {
        'X-XSS-Protection': 1,
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token', {domain: import.meta.env.VITE_APP_URL})},
})

// Vue.prototype.$http = axiosClientIns