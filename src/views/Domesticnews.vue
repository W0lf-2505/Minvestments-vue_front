<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-lg-7 col-md-12 col-sm-12 position-relative z-index-2">
                <div class="mb-4 card card-plain">
                    <div class="p-3 card-body">
                        <div class="row">
                            <div class="col-lg-8">
                                <div class="d-flex flex-column h-100">
                                    <h2 class="mb-0 font-weight-bolder">Domestic News</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-for="(article, pl) in feed" :key='pl' class="mb-4 card card-plain">
                    <div class="p-3 card-body">
                        <div class="row">
                            <div class="col-lg-11">
                                <div class="d-flex flex-column h-100">
                                    <div @click="openPopup(article.href)">
                                        <!-- <h5 class="mb-1 font-weight-bolder" target="_blank" v-html="article"></h5> -->
                                        <h5 class="mb-0 font-weight-bolder">{{ article.title }}</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-1">
                                <div class="h-100">
                                    <a target="_blank" :href="article.href" width="70">

                                        <!-- <i class="ni ni-map-big" aria-hidden="true"></i> -->
                                        <i class="ni ni-button-play" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 row"><!-- charts --></div>

        <Popup ref="popup" />
        <!-- Use the ref attribute to reference the Popup component -->


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
import axios from 'axios';

export default {
    name: "MarketNews",
    components: {
        Globe,
    },
    data() {
        return {

            feed: [],
            newsData: [],
            popupUrl: '', // Data property for storing the URL

        }
    },
    async mounted() {

        await this.fetchData()
        this.feed = this.newsData

    },
    methods: {
        unique(list) {
            const uniqueList = [];
            const checkList = [];
            const re = /">.*|">.*/g;

            list.forEach((item) => {
                let x = item.replace(/\t/g, '').replace(/\n/g, '').replace('href', 'target="_blank" href');
                x = x.replace('<a target="_blank" href=', '{"href":').replace('title=', ',"title":');

                try {
                    let finalstrip = '';
                    x.split('" ').forEach(strip => {
                        if (strip.includes('href') || strip.includes('title')) {
                            finalstrip += strip + '" ';
                        }
                    });
                    x = finalstrip.trim() + '}';
                } catch (e) {
                    console.error(e);
                }

                x = x.replace(re, '"}');
                x = x + ',';

                if (!checkList.includes(x)) {
                    try{
                        checkList.push(x)
                    uniqueList.push(JSON.parse(x.replace('"},','"}')));
                    }
                    catch(error){
                        console.log(error)
                    }
                }
            });

            return uniqueList;
        },
        // Function to count occurrences of a substring in a string
        countOccurrences(string, substring) {
            return (string.match(new RegExp(substring, 'g')) || []).length;
        },

        async fetchData() {
            try {
                const response = await axios.get('https://www.moneycontrol.com/');
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.data, 'text/html');

                const listItems = doc.querySelectorAll('li');

                const data = [];

                listItems.forEach((li) => {
                    const anchors = li.querySelectorAll('a');
                    anchors.forEach((a) => {
                        const rawHtml = a.outerHTML;
                        if (rawHtml.includes('href="https://www.moneycontrol.com/news') && !rawHtml.includes('<img')) {
                            let modifiedHtml = rawHtml.replace(/onclick=".*?"/g, '');
                            // Check the conditions as per the original logic
                            if (this.countOccurrences(modifiedHtml, '-') > 2 && this.countOccurrences(modifiedHtml, '</') === 1) {
                                data.push(modifiedHtml);
                            }
                        }
                    });
                });
                const uniquedata = this.unique(data)
                this.newsData = Array.from(new Set(uniquedata));
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

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
        openPopup(url) {
            event.preventDefault(); // Prevent the default link behavior
            // this.$refs.popup.openPopup('https://www.google.com/search?q='+url); // Call the openPopup method of the Popup component
            this.$refs.popup.openPopup(url); // Call the openPopup method of the Popup component
        }
    },
}
</script>
