<template>
    
    <div class="overlay">
        <div style="padding:30px">
            <span>Success! Your action has been completed.</span>
            <span>You can close this window</span>
        </div></div>
</template>

<script>
import Cookies from "js-cookie";

export default {
    name: "Successlog",
    props: ['modelValue'],
    emits: ['update:modelValue'],
    components: {
    },
    data() {
    return {
        uid: Cookies.get('uid', {domain: import.meta.env.VITE_APP_Parent_Domain}),
        vite_username: Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_Parent_Domain}),
        url: '',
        apisession: ''
        }
        
    },

    methods:{
        // Function to retrieve the value of the 'apisession' query parameter from the URL
        getApiSessionFromUrl: function() {
            // Get the URL of the current page
            this.url = window.location.href;

            // Get the fragment identifier from the URL
            const fragmentIndex = this.url.indexOf('#');
            const fragment = fragmentIndex !== -1 ? this.url.slice(fragmentIndex + 1) : '';

            // Extract the query string from the fragment identifier
            const queryStringIndex = fragment.indexOf('?');
            const queryString = queryStringIndex !== -1 ? fragment.slice(queryStringIndex + 1) : '';

            // Parse the query string to extract the query parameters
            const params = new URLSearchParams(queryString);

            // Retrieve the value of the 'apisession' parameter
            const apiSessionValue = params.get('apisession');

            return apiSessionValue;
        }
    },

    

    
        
    mounted() {
        
        // Retrieve the apisession value
        this.apisession = this.getApiSessionFromUrl();
        if (this.apisession !== null && this.apisession !== '') {
            // Do something with the apisession value
            Cookies.set('s_token', this.apisession)
            window.close()

        } else {
            console.log("Session Token not found or empty in the URL.");
        }


    },
};

</script>
