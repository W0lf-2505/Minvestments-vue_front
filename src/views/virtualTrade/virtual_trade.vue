<template>
    <div py-4 class="container-fluid">

        <div class="row">
            <div class="col-lg-11 col-sm-11 position-relative z-index-2">
                <div class="mb-4 card card-plain">
                    <div class="p-3 card-body">
                        <!-- v-if="keyneeded_counter" -->
                        <setup v-if="keyneeded_counter">

                        </setup>
                        
                        <div v-if="!keyneeded_counter">
                        <div v-if="s_token==undefined" class="container">
                            <br>
                            <h3>Welcome to Minvestments Trading Platform</h3>
                            <p>Please authenticate using ICICI Direct to continue:</p>
                            <VsudButton v-on:click.prevent="openPopup" id="signinButton" v-bind:disabled="signinButtonCounter" class="button">Sign In with ICICI Direct</VsudButton>
                            <br><br>
                            <p>If you have registered a new app you can update keys using the below key</p>
                            <VsudButton v-on:click.prevent="openapi" id="changeAPIButton" class="button">Change API keys</VsudButton>
                        </div>
                        
                        <div v-else>
                            <platform v-if="platform_counter">

                            </platform>

                        </div>

                    </div>

                    </div>
                </div>
            </div>

        </div>
        &nbsp;
    </div>
</template>

<script>
import VsudInput from "@/components/VsudInput.vue";
import VsudSwitch from "@/components/VsudSwitch.vue";
import VsudButton from "@/components/VsudButton.vue";
import Globe from "@/components/Globe.vue";
import Setup from "@/views/Tradebreeze/setup.vue"
import Platform from "@/views/virtualTrade/virtual_platform.vue"
import {axiosClientIns} from "@/libs/client_axios";
import Cookies from "js-cookie";


export default {
    name: "License",
    components: {
      Globe,
      Setup,
      Platform,
      VsudInput,
      VsudSwitch,
      VsudButton,
    },
    data: () => ({
        uid: Cookies.get('uid', {domain: import.meta.env.VITE_APP_Parent_Domain}),
        vite_username: Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_Parent_Domain}),
        keyneeded_counter: false,
        platform_counter: false,
        authlink: '',
        s_token: '',
        popupUrl: '',
        cookieName: 's_token',
        success_window: null,
        signinButtonCounter: true
        }

        
    ),
    async mounted() {
    this.s_token = Cookies.get('s_token')
    if(Cookies.get('s_token') == undefined){
        await axiosClientIns
        .post("/retrive_tradelink",{
            'filter': {"user":Cookies.get('vite_username')},
            'fields': {'api_key':1},
            'username': this.vite_username,
            'uid': this.uid
            }).then(response =>{
                if (response.data.status){
                    this.authlink = response.data.real_data['auth-link']
                    this.keyneeded_counter = false
                    this.signinButtonCounter = false
                    // Set the href attribute of the signinButton element
                }
                else{
                    this.keyneeded_counter = true
                }
            })
        }else{
        this.platform_counter = true

    }
    },
    
    methods:{
        
    cookiecheck(){
            if (Cookies.get('s_token')){
                this.platform_counter = true
                clearInterval(this.myInterval);
                window.location.reload()

            }
        },

        openPopup: async function () {{
            this.cookiecheck()
            this.myInterval = setInterval(this.cookiecheck, 1000);
            var url = this.authlink; // Replace with your URL
            var width = 600;
            var height = 400;
            var left = (screen.width - width) / 2;
            var top = (screen.height - height) / 2;
            var options = "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
            success_window = window.open(url, "_blank", options);
            }
        
        },
        openapi: async function () {{
            this.keyneeded_counter = true
            }
        
        },
    }
}
</script>
