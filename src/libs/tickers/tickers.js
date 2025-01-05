// src/store/globalStore.js
import { ref } from 'vue';
import { axiosClientIns } from "@/libs/client_axios";
import Cookies from "js-cookie";

// Define the global state
const globalArray = ref([]);
let arraypopulated = ref(true);

// Function to fetch data and update the global state
const fetchData = async () => {
    try {
        await axiosClientIns.post("/fetchtickers", {
            'username': Cookies.get('vite_username'),
            'uid': Cookies.get('uid')
        }).then(response => {
            const data = JSON.parse(response.data.real_data);
            globalArray.value = data; // Update the reactive variable
            arraypopulated = false
        } )
} catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const useTickersStore = () => {
    return {
        globalArray,
        fetchData,
        arraypopulated
    };
};
