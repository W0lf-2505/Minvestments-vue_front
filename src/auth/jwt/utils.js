import useJwt from "@/auth/jwt/useJwt";
import ability from "@/libs/acl/ability";
import Cookies from 'js-cookie'
import Swal from "sweetalert2";

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = async () => {
    let authData = Cookies.get('authData', {domain: import.meta.env.VITE_APP_URL})
    let access_token = localStorage.getItem('access_token', {domain: import.meta.env.VITE_APP_URL})
    let uid = Cookies.get('uid', {domain: import.meta.env.VITE_APP_URL})
    let vite_username = Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_URL})
    return authData && access_token && uid && vite_username
}

export const getUserData = () => Cookies.get('authData', {domain: import.meta.env.VITE_APP_URL})
