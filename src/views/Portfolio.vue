<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-7 col-md-12 col-sm-12 position-relative z-index-2">
        <div class="mb-4 card card-plain">
          <div class="p-3 card-body">
            <div class="row">
              <div class="col-lg-6">
                <div class="d-flex flex-column h-100">
                  <h2 class="mb-0 font-weight-bolder">General Statistics</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-5 col-sm-5">
            <card :title="stats.money.title" :value="stats.money.value" :percentage="stats.money.percentage"
              :icon-class="stats.money.iconClass" :icon-background="stats.iconBackground"
              :percentage-color="stats.money.percentageColor" direction-reverse></card>
          </div>
          <div class="mt-4 col-lg-5 col-sm-5 mt-sm-0">
            <card :title="stats.clients.title" :value="stats.clients.value" :percentage="stats.clients.percentage"
              :icon-class="stats.clients.iconClass" :icon-background="stats.iconBackground"
              :percentage-color="stats.clients.percentageColor" direction-reverse></card>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-10">
            <div class="card">

              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  Stock Doughnut chart
                </div>
                <div style="height:400px;">
                  <DoughnutChart v-if="is_chart_load" :chart="{
                    labels: combinedtransactions.filter(e => {
                      if (e.Quantity>0){
                        return e
                      }
                    }).map(e => {
                      return e.ticker
                    }),
                    datasets: [{
                      label: 'Profit',
                      data: combinedtransactions.filter(e => {
                      if (e.Quantity>0){
                        return e
                      }
                    }).map(e => {
                        return e.Quantity
                      })
                    }
                    ]
                  }" />
                </div>
              </div>
            </div>
          </div>
        </div>
        &nbsp;
        <div class="row">
          <div class="col-12 col-md-10">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">Stock Portfolio</h6>
                </div>
              </div><!--  style="height:400px; -->
              <div class="table-responsive" style="height:80%;">
                <table class="table align-items-center">
                  <thead>
                    <tr>
                      <td>
                        <div class="px-2 py-1 d-flex align-items-center">
                          <div>
                            <!-- <img :src="sale.flag" alt="Country flag" /> -->
                          </div>
                          <div class="ms-4">
                            <h5 class="mb-0 text-sm">Stock</h5>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h3 class="mb-0 text-sm">Avg. Price</h3>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h3 class="mb-0 text-sm">Quantity</h3>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h3 class="mb-0 text-sm">Total invested(Unrealized)</h3>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h3 class="mb-0 text-sm">Realized P/L</h3>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(stats, PL) in combinedtransactions" :key="PL">
                      <td>
                        <div class="px-2 py-1 d-flex align-items-center">

                          <div class="ms-4" @click="openPopup('https://secure.icicidirect.com/content/research-advisory/technicalanalysis/'+stats.ticker)">
                            <h6 class="mb-0 text-sm">{{ stats.ticker }}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h6 v-if="stats.Quantity == 0" class="mb-0 text-sm">{{ new Intl.NumberFormat('en-us', {
                            style:
                              'currency',currency: 'INR'}).format(0) }}</h6>
                          <h6 v-else class="mb-0 text-sm">{{ new Intl.NumberFormat('en-us', {
                            style: 'currency', currency:
                              'INR'
                          }).format(stats.avgRate) }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h6 class="mb-0 text-sm">{{ stats.Quantity }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h6 class="mb-0 text-sm">{{ new Intl.NumberFormat('en-us', {
                            style: 'currency', currency:
                              'INR'
                          }).format(stats.TotalRate) }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold"></p>
                          <h6 class="mb-0 text-sm">{{ new Intl.NumberFormat('en-us', {
                            style: 'currency', currency:
                              'INR'
                          }).format(stats.Realized) }}</h6>
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
    <div class="mt-4 row">


      <!--   <div class="mb-4 col-lg-5 mb-lg-0">
          <div class="card z-index-2">
            <div class="p-3 card-body"> -->
      <!-- chart -->
      <!-- <active-users-chart />
            </div>
          </div>
        </div>
        <div class="col-lg-7"> -->
      <!-- line chart -->
      <!-- <div class="card z-index-2">
            <gradient-line-chart />
          </div>
        </div> -->
    </div>

    
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
import Card from "@/components/Cards/Card.vue";
import Globe from "@/components/Globe.vue";
import { axiosClientIns } from "@/libs/client_axios";
import Cookies from 'js-cookie';
import DoughnutChart from "@/components/DoughnutChart.vue"

export default {
  name: "DashboardDefault",
  components: {
    Card,
    DoughnutChart,
    Globe
  },
  data() {
    return {
      is_chart_load: false,
      uid: Cookies.get('uid', { domain: import.meta.env.VITE_APP_Parent_Domain }),
      vite_username: Cookies.get('vite_username', { domain: import.meta.env.VITE_APP_Parent_Domain }),
      finaltarget: 10000000,
      stats: {
        iconBackground: "bg-gradient-success",
        money: {
          title: "Total Invested",
          value: "0",
          percentage: "0",
          iconClass: "ni ni-money-coins",
        },
        clients: {
          title: "Total Realized Profit/Loss",
          value: "0",
          percentage: "0",
          iconClass: "ni ni-paper-diploma",
        },
      },


      popupUrl: '', // Data property for storing the URL
      rawData: [],
      allData: [],
      transactions: [],
      combinedtransactions: [],
      Alltimestat: 0,
      percentInvestedChange: 0,
      percentRealizedChange: 0,
      Realizedstats: 0,
      Lastyearstats: 0,
      currentyear: new Date().getFullYear(),
      lastyear: "",
      projectedCompletionDate: new Date()
    };
  },
  methods: {
    calculateProjectedCompletionDate: function (totalWork, completedWork, elapsedTime) {
      const remainingWork = totalWork - completedWork;
      const rateOfWorkCompletion = completedWork / elapsedTime;
      const estimatedTimeToCompletion = remainingWork / rateOfWorkCompletion;
      const projectedCompletionDate = new Date();
      projectedCompletionDate.setTime(projectedCompletionDate.getTime() + (estimatedTimeToCompletion * 24 * 60 * 60 * 1000));


      return projectedCompletionDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });;
    },
    sortItemsByMonth() {
      try{
      // Custom comparison function for sorting by date
      this.transactions.sort(function (a, b) {
        // Split the strings to extract the month and year
        var partsA = a.date.split("-");
        var partsB = b.date.split("-");

        // Extract the month and year
        var dayA = parseInt(partsA[0])
        var monthA = partsA[1];
        var yearA = parseInt(partsA[2]);

        var dayB = parseInt(partsB[0])
        var monthB = partsB[1];
        var yearB = parseInt(partsB[2]);

        // Convert month names to numerical values for comparison
        var monthValues = {
          Jan: 1,
          Feb: 2,
          Mar: 3,
          Apr: 4,
          May: 5,
          Jun: 6,
          Jul: 7,
          Aug: 8,
          Sep: 9,
          Oct: 10,
          Nov: 11,
          Dec: 12,
        };

        // Compare the years first, and if they are equal, compare the months
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        if (monthValues[monthA] !== monthValues[monthB]) {
          return monthValues[monthA] - monthValues[monthB];
        }
        return dayA - dayB

      });}
      catch{

      }

    },
    CombineItems() {
      const stockMap = new Map()
      try{
      this.transactions.forEach((obj) => {
        obj.realizedpl = 0
        if (stockMap.has(obj.ticker)) {
          const entry = stockMap.get(obj.ticker);
          if (obj.Action === 'B') {

            entry.Quantity += obj.Quantity;
            entry.totalRate += obj.Quantity * obj.Rate;


          } else if (obj.Action === 'S') {
            entry.Realized += (obj.Quantity * obj.Rate) - ((entry.totalRate / entry.Quantity) * obj.Quantity)
            entry.Quantity -= obj.Quantity;
            entry.totalRate -= obj.Quantity * obj.Rate;

          }
          if (entry.Quantity == 0) {
            entry.totalRate = 0
          }
        } else {
          stockMap.set(obj.ticker, { Quantity: obj.Quantity, totalRate: obj.Quantity * obj.Rate, Realized: 0 });

        }
      });

      stockMap.forEach((values, ticker) => {
        const avgRate = values.totalRate / values.Quantity;
        this.combinedtransactions.push({ ticker, Quantity: values.Quantity, TotalRate: values.totalRate, avgRate, Realized: values.Realized });
      });}
      catch{}

    },
    openPopup(url) {
        event.preventDefault(); // Prevent the default link behavior
        // this.$refs.popup.openPopup('https://www.google.com/search?q='+url); // Call the openPopup method of the Popup component
        this.$refs.popup.openPopup(url); // Call the openPopup method of the Popup component
    }
  },
  mounted() {
    this.lastyear = (parseInt(this.currentyear) - 1).toString()
    axiosClientIns
      .post("/search/statistics_col/needed_fields", {
        'filter': { "user": Cookies.get('vite_username') },
        'fields': { 'Portfolio': 1 },
        'username': this.vite_username,
        'uid': this.uid
      }).then(response => {
        this.rawData = JSON.parse(response.data.real_data)
        this.allData = JSON.parse(response.data.real_data)

        this.transactions = this.allData[0]["Portfolio"]
        this.sortItemsByMonth()
        this.CombineItems()
        this.combinedtransactions.forEach(element => {
          this.Realizedstats += element.Realized
          this.Alltimestat += element.TotalRate
        });

        this.stats.money.value = (new Intl.NumberFormat('en-us', { style: 'currency', currency: 'INR' }).format(this.Alltimestat)).toString()

        // this.combinedtransactions.forEach(element => {
        //if(element.Month.includes(this.currentyear)){
        //this.Realizedstats +=  element.ProfitLoss
        //} 
        this.combinedtransactions.forEach(element => {

        })

        this.stats.clients.value = (new Intl.NumberFormat('en-us', { style: 'currency', currency: 'INR' }).format(this.Realizedstats)).toString()



        this.percentRealizedChange = (this.Realizedstats) * (100 / this.finaltarget)
        if (this.Realizedstats == 0) {
          this.percentRealizedChange = 0

          if ((this.Realizedstats) < 0) {
            this.percentRealizedChange = this.percentRealizedChange * -1

          }
        }

        this.percentInvestedChange = (this.Alltimestat) * (100 / this.finaltarget)
        this.stats.money.percentage = this.percentInvestedChange.toFixed(2).toString() + "%"



        this.stats.clients.percentage = this.percentRealizedChange.toFixed(2).toString() + "%"
        if (this.percentRealizedChange < 0) {
          this.stats.clients.percentageColor = "text-danger"
        }
        this.is_chart_load = true
      });


  },

};
</script>