<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-lg-7 col-md-12 col-sm-12 position-relative z-index-2">
                <div class="mb-4 card card-plain">
                    <div class="p-3 card-body">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="d-flex flex-column h-100">
                                    <h2 class="mb-0 font-weight-bolder">Global News</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-for="(article, pl) in feed" :key="pl" class="mb-4 card card-plain">
                    <div class="p-3 card-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="d-flex flex-column h-100">
                                    <h5 class="mb-1 font-weight-bolder">{{article.title}}</h5>
                                    <h6 class="mb-0 font-weight-bolder">{{article.summary}}</h6>
                                </div>
                            </div>
                            <div class="col-lg-6">

                                    <h6 class="mb-0 font-weight-bolder text-xs" >{{article.authors[0]}}  -  {{formatTime(article.time_published)}}</h6>
                                    <h6><a :href="article.url" target="_blank">read more...</a></h6>
                            </div>
                            <div class="col-lg-6">
                                
                            </div>
                            <div class="col-lg-12">
                                Securities sentiments below -
                            </div>
                            <div v-for="(ticker, no) in article.ticker_sentiment" :key="no" class="text-sm shadow-blur col-lg-4">
                                {{ ticker.ticker }} - {{ ticker.ticker_sentiment_label }}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 row"><!-- charts --></div>

        <!-- <Popup ref="popup" /> Use the ref attribute to reference the Popup component
  -->

        <div class="row pinned-md">
            <div class="col-12">
          <!-- globe -->
          <globe width="700" height="600" />
        </div>
      </div>
    </div>
</template>

<script>
import Globe from "@/components/Globe.vue";
import {axiosClientIns} from "@/libs/client_axios";
import Cookies from 'js-cookie';

export default {
    name: "MarketNews",
    components: {
        Globe,
    },
    data(){
        return{
            uid: Cookies.get('uid', {domain: import.meta.env.VITE_APP_Parent_Domain}),
            vite_username: Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_Parent_Domain}),
        
            rawData: [],
            allData: [],
            feed: [],
            popupUrl: '', // Data property for storing the URL

        }
    },
    mounted() {
        axiosClientIns
            .post("/alphamarket/NEWS_SENTIMENT&topics=financial_markets",{
            'username': this.vite_username,
            'uid': this.uid
            }).then(response =>{
                this.rawData = JSON.parse(response.data.real_data)
                this.allData = JSON.parse(response.data.real_data)
                this.feed = this.allData.feed
            })
    },
    methods: {
        formatTime(time) {
            // Assuming time is "20231024T104500"
            const date = new Date(`${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}T${time.slice(9, 11)}:${time.slice(11, 13)}:${time.slice(13)}`);

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(2);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            },
        openPopup(url){
            event.preventDefault(); // Prevent the default link behavior
            this.$refs.popup.openPopup('https://www.google.com/search?q='+url); // Call the openPopup method of the Popup component
        }
    },
}
</script>
