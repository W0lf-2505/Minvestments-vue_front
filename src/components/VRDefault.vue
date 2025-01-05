<template>
  <!-- Navbar -->
  <div>
    <navbar
      :min-nav="navbarMinimize"
      :toggle="toggleConfigurator"
      :class="
        $store.state.isNavFixed ? $store.state.navbarFixed_class : ''
      "
    />
  </div>
  <!-- End Navbar -->
  <div
    class="mx-3 mt-3 border-radius-xl position-relative"
    :style="{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
    }"
  >
    <sidenav :custom_class="cardBackgroundMaskColor" :class="isTransparent" class="fixed-start" />

    <main class="mt-1 main-content border-radius-lg">
      <div class="section min-vh-85 position-relative transform-scale-0 transform-scale-md-6">
        <div class="container ms-n0 ms-md-n5">
          <div class="row">
            <div class="mb-4 col-lg-7 mb-lg-0 position-relative z-index-2">
              <div class="mb-4 card card-plain">
                <div class="p-3 card-body">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="d-flex flex-column h-100">
                        <h2
                          class="font-weight-bolder mb-0mt-4 fadeIn1 fadeInBottom"
                        >General Statistics</h2>
                        <div class="d-flex align-items-center">
                          <h6 class="mb-0 font-weight-bolder fadeIn4 fadeInBottom">Account Creation - {{join_date}}</h6>
                          <!-- <a
                            class="mt-1 mb-0 text-sm text-primary font-weight-bold icon-move-right ms-4 fadeIn4 fadeInBottom"
                            href="javascript:;"
                          >
                            Read More
                            <i class="text-sm fas fa-arrow-right ms-1" aria-hidden="true"></i>
                          </a> -->
                        </div>
                        <h1 class="mb-0 font-weight-bolder fadeIn4 fadeInBottom">{{full_name}}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4 col-md-6 col-12">
                  <card
                    :title="stats.money.title"
                    :value="stats.money.value"
                    :percentage="stats.money.percentage"
                    :icon-class="stats.money.iconClass"
                    :icon-background="stats.iconBackground"
                    :percentage-color="stats.money.percentageColor"
                    direction-reverse
                  ></card>
                  <card
                    :title="stats.users.title"
                    :value="stats.users.value"
                    :percentage="stats.users.percentage"
                    :icon-class="stats.users.iconClass"
                    :icon-background="stats.iconBackground"
                    :percentage-color="stats.users.percentageColor"
                    direction-reverse
                  ></card>
                <!-- </div>
                <div class="mt-4 col-lg-4 col-md-6 col-12 mt-md-0"> -->
                  <card
                    :title="stats.clients.title"
                    :value="stats.clients.value"
                    :percentage="stats.clients.percentage"
                    :icon-class="stats.clients.iconClass"
                    :icon-background="stats.iconBackground"
                    :percentage-color="stats.clients.percentageColor"
                    direction-reverse
                  ></card>
                  <card
                    :title="stats.sales.title"
                    :value="stats.sales.value"
                    :icon-class="stats.sales.iconClass"
                    :icon-background="stats.iconBackground"
                    direction-reverse
                  ></card>
                </div>
                <div class="mt-4 col-lg-7 col-md-6 col-12 mt-md-0">

                <div class="col-12 col-md-10">
                  <div class="card">
                    <div class="p-3 pb-0 card-header">
                      <div class="d-flex justify-content-between">
                        <h6 class="mb-2">Profits by Month</h6>
                      </div>
                    </div>
                    <div class="table-responsive" style="overflow:scroll; height:500px; width:300px;">
                      <table class="table align-items-center">
                        <tbody>
                          <tr v-for="(stats, PL) in MonthlyStats" :key="PL">
                            <td class="w-30">
                              <div class="px-2 py-1 d-flex align-items-center">
                                <div>
                                  <!-- <img :src="sale.flag" alt="Country flag" /> -->
                                </div>
                                <div class="ms-4">
                                  <p class="mb-0 text-xs font-weight-bold">Month:</p>
                                  <h6 class="mb-0 text-sm">{{ stats.Month }}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="text-center">
                                <p class="mb-0 text-xs font-weight-bold"></p>
                                <h6 class="mb-0 text-sm">{{ new Intl.NumberFormat('en-us',{style: 'currency',currency: 'INR'}).format(stats.ProfitLoss) }}</h6>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                </div>
              </div>
              
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <globe
                class="mt-3 me-n8 me-lg-10 fadeIn4 fadeInBottom d-none d-md-block"
                width="1000"
                height="1000"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <app-footer class="py-3 bg-white border-radius-lg" />
</template>

<script>
import { mapGetters } from "vuex";
import Sidenav from "@/examples/Sidenav/index.vue";
import AppFooter from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Card from "@/examples/Cards/Card.vue";
import {axiosClientIns} from "@/libs/client_axios";
import Cookies from 'js-cookie';


import bgImg from '@/assets/img/vr-bg.jpg';
import US from "@/assets/img/icons/flags/US.png";
import DE from "@/assets/img/icons/flags/DE.png";
import GB from "@/assets/img/icons/flags/GB.png";
import BR from "@/assets/img/icons/flags/BR.png";

import Globe from "@/examples/Globe.vue";
const body = document.getElementsByTagName("body")[0];

import { mapMutations } from "vuex";
export default {
  name: "VrDefault",
  components: {
    AppFooter,
    Sidenav,
    Navbar,
    Card,
    Globe,
  },
  data() {
    return {
      bgImg,
      uid: Cookies.get('uid', {domain: import.meta.env.VITE_APP_Parent_Domain}),
      vite_username: Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_Parent_Domain}),
      finaltarget: 10000000,
      stats: {
        iconBackground: "bg-gradient-success",
        money: {
          title: "Life time profits",
          value: 0,
          percentage: 0,
          iconClass: "ni ni-money-coins",
        },
        users: {
          title: "Month's Profit",
          value: 0,
          percentage: 0,
          iconClass: "ni ni-world",
        },
        clients: {
          title: "Profit this year",
          value: 0,
          percentage: 0,
          iconClass: "ni ni-paper-diploma",
        },
        sales: {
          title: "Projection time for 1 Crore",
          value: "0",
          percentage: "0",
          iconClass: "ni ni-cart",
        },
      },
      sales: {
        us: {
          country: "United States",
          sales: 2500,
          value: "$230,900",
          bounce: "29.9%",
          flag: US,
        },
        germany: {
          country: "Germany",
          sales: "3.900",
          value: "$440,000",
          bounce: "40.22%",
          flag: DE,
        },
        britain: {
          country: "Great Britain",
          sales: "1.400",
          value: "$190,700",
          bounce: "23.44%",
          flag: GB,
        },
        brasil: {
          country: "Brasil",
          sales: "562",
          value: "$143,960",
          bounce: "32.14%",
          flag: BR,
        },
      },
      rawData: [],
      allData: [],
      MonthlyStats: [],
      Alltimestat: 0,
      percentMonthlyChange: 0,
      percentYearlyChange: 0,
      Thisyearstats: 0,
      Lastyearstats: 0,
      currentyear: new Date().getFullYear(),
      lastyear: "",
      projectedCompletionDate: new Date(),
      full_name: "",
      join_date: "",
    };
  },

  computed: {
    ...mapGetters(['cardBackgroundMaskColor']),
    isTransparent() {
      return this.$store.state.isTransparent;
    },
  },

  beforeMount() {
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.add("virtual-reality");
    this.$root.isTransparent = "bg-white";
  },

  beforeUnmount() {
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.remove("virtual-reality");

    if (this.$store.state.isPinned === false) {
      const sidenav_show = document.querySelector(".g-sidenav-show");
      sidenav_show.classList.remove("g-sidenav-hidden");
      sidenav_show.classList.add("g-sidenav-pinned");
      this.$store.state.isPinned = true;
    }
    this.$store.state.isTransparent = "bg-transparent";
  },

  mounted() {
    this.lastyear = (parseInt(this.currentyear) - 1).toString()
    axiosClientIns
      .post("/search/statistics_col/needed_fields",{
          'filter': {"user":Cookies.get('vite_username')},
          'fields': {'Months':1},
          'username': this.vite_username,
          'uid': this.uid
        }).then(response =>{
          this.full_name = Cookies.get('full_name')
          this.join_date = Cookies.get('join_date')
          this.rawData = JSON.parse(response.data.real_data)
          this.allData = JSON.parse(response.data.real_data)
          this.MonthlyStats = this.allData['0']['Months']
          this.sortItemsByMonth();
          this.MonthlyStats.reverse();
          this.MonthlyStats.forEach(element => { 
            this.Alltimestat += element.ProfitLoss
          });
          
          this.stats.money.value = new Intl.NumberFormat('en-us',{style: 'currency',currency: 'INR'}).format(this.Alltimestat)
          this.stats.users.value = new Intl.NumberFormat('en-us',{style: 'currency',currency: 'INR'}).format(this.MonthlyStats[0].ProfitLoss)
          try{
          this.percentMonthlyChange = (this.MonthlyStats[0].ProfitLoss - this.MonthlyStats[1].ProfitLoss)* (100/this.MonthlyStats[1].ProfitLoss)
          // If last month is negative, Next month percent should be inverse to positive
          if (this.MonthlyStats[1].ProfitLoss < 0 && this.MonthlyStats[0].ProfitLoss >= 0){
            this.percentMonthlyChange = -(this.percentMonthlyChange)
          }
          }
          catch (error) {
            if(this.MonthlyStats[0].ProfitLoss >0){
            this.percentMonthlyChange = 100

            }
          }
          this.stats.users.percentage = this.percentMonthlyChange.toFixed(2).toString() + "%"
          this.stats.money.percentage = (this.Alltimestat * (100/this.finaltarget)).toFixed(2).toString() + "%"
          

          if (this.percentMonthlyChange < 0){
            this.stats.users.percentageColor= "text-danger"
          };

          this.MonthlyStats.forEach(element => {
            if(element.Month.includes(this.currentyear)){
              this.Thisyearstats +=  element.ProfitLoss
            }
            
          });
          this.stats.clients.value = new Intl.NumberFormat('en-us',{style: 'currency',currency: 'INR'}).format(this.Thisyearstats)

          this.MonthlyStats.forEach(element => {
            if(element.Month.includes(this.lastyear)){
              this.Lastyearstats +=  element.ProfitLoss
            }
          });
          this.percentYearlyChange = (this.Thisyearstats - this.Lastyearstats) * (100/this.Lastyearstats)
          if(this.Lastyearstats == 0){
            this.percentYearlyChange = 100

            if(this.Thisyearstats < 0){
              this.percentYearlyChange = -100

            }
          }
          this.stats.clients.percentage = this.percentYearlyChange.toFixed(2).toString() + "%"
          if (this.percentYearlyChange < 0){
            this.stats.clients.percentageColor= "text-danger"
          };
          if (this.Alltimestat * (100/this.finaltarget) < 0){
            this.stats.money.percentageColor= "text-danger"

          };
          if (this.percentMonthlyChange < 0){
            this.stats.users.percentageColor= "text-danger"

          };


          this.projectedCompletionDate = this.calculateProjectedCompletionDate(this.finaltarget,this.Alltimestat,Math.floor((new Date() - new Date(Cookies.get('join_date'))) / (1000 * 60 * 60 * 24)))
          this.stats.sales.value = this.projectedCompletionDate

          if (this.Alltimestat <= 0){
            this.stats.sales.value = "Will be updated soon..."
          }
        })
  },

  methods: {
    ...mapMutations(["navbarMinimize", "toggleConfigurator"]),
    calculateProjectedCompletionDate: function (totalWork, completedWork, elapsedTime) {
      const remainingWork = totalWork - completedWork;
      const rateOfWorkCompletion = completedWork / elapsedTime;
      const estimatedTimeToCompletion = remainingWork / rateOfWorkCompletion;
      const projectedCompletionDate =  new Date();
      projectedCompletionDate.setTime(projectedCompletionDate.getTime() + (estimatedTimeToCompletion * 24 * 60 * 60 * 1000));
      

      return projectedCompletionDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});;
    },
    sortItemsByMonth() {
      // Custom comparison function for sorting by date
      this.MonthlyStats.sort(function (a, b) {
      // Split the strings to extract the month and year
      var partsA = a.Month.split(" ");
      var partsB = b.Month.split(" ");

      // Extract the month and year
      var monthA = partsA[0];
      var yearA = parseInt(partsA[1]);
      var monthB = partsB[0];
      var yearB = parseInt(partsB[1]);

      // Convert month names to numerical values for comparison
      var monthValues = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };

      // Compare the years first, and if they are equal, compare the months
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      return monthValues[monthA] - monthValues[monthB];
    });
    }
  }
};
</script>
