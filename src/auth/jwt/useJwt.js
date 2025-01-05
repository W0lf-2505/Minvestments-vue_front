import useJwt from './core/useJwt'
import jwtDefaultConfig from "@/auth/jwt/core/jwtDefaultConfig";
import axios from 'axios'

const axiosIns = axios.create({
    // You can add your headers here
    // ================================
    //baseURL: 'https://user-management-backend.k8s.staging.swift-ai-dev.com',
    baseURL: import.meta.env.VITE_APP_Backend_API,
    method: 'POST',
    // timeout: 1000,
    headers: {'Content-Type': 'application/json',}
})

const { jwt } = useJwt(axiosIns, jwtDefaultConfig)
export default jwt
