// axios
import axios from 'axios'
import {notAuthorizedAlert, notLoginAlert, somethingWentWrong, catchError} from "@/libs/BasicAlert";
import useJwt from "@/auth/jwt/useJwt";
import {isUserLoggedIn} from "@/auth/jwt/utils";
import Cookies from "js-cookie";

export const axiosJWTIns = axios.create({
    // You can add your headers here
    // ================================
    baseURL: import.meta.env.VITE_APP_Backend_API,
    timeout: 10000,
    headers: {
        'X-XSS-Protection': 1,
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
    }
})

export const validateToken = (to) => {
    let username = Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_URL})
    let uid = Cookies.get('uid', {domain: import.meta.env.VITE_APP_URL})
    if (isUserLoggedIn) {
        axiosJWTIns.defaults.headers.post['Authorization'] = 'Bearer ' + localStorage.getItem('access_token', {domain: import.meta.env.VITE_APP_URL})
        axiosJWTIns.post('/jwt/validate', {
            'resource': to.meta.resource,
            'action': to.meta.action,
            'username': username,
            'uid': uid
        })
            .then(response => {
                console.log("validation response received")
                if (response.data.valid_token) {
                    if (response.data.access) {
                    } else {
                        notAuthorizedAlert()
                    }
                } else {
                    console.log("calling refresh token 1")
                    refreshToken()
                }
            }).catch(error => catchError(error))
    } else {
        window.location.href = '/signin'
    }
}

export const refreshToken = (to) => {
    let username = Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_URL})
    let uid = Cookies.get('uid', {domain: import.meta.env.VITE_APP_URL})
    axiosJWTIns.defaults.headers.post['Authorization'] = 'Bearer ' + Cookies.get('access_token', {domain: import.meta.env.VITE_APP_URL})
    axiosJWTIns.post('/jwt/refresh-token', {
        'username': username,
        'uid': uid
    })
        .then(response => {
            if (response.data.status) {
                if (response.data.access_token) {
                    useJwt.setToken(response.data.access_token)
                    setTimeout(window.location.href = "/", 1000)
                } else {
                    console.log("calling refresh token 5")
                    notAuthorizedAlert()
                }
            } else {
                console.log("calling refresh token 4")
                notLoginAlert()
            }
        }).catch(error => catchError(error))
}


