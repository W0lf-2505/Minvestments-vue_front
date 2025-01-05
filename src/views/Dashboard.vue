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
                  <div v-if="vite_username === 'manan.qatester@gmail.com'">
                    <ul style="display: flex; list-style-type: none; padding: 0;">
                      <li class="nav-item d-flex align-items-center">
                        <span class="badge badge-dark badge-sm">
                          Last withdrawal: {{ new Intl.NumberFormat('en-us', {
                            style: 'currency', currency:
                              'INR'
                          }).format(withdrawal[Object.keys(withdrawal).slice(-1)[0]]) }}
                        </span>
                      </li>
                      &nbsp;
                      <li class="px-3 nav-item d-flex align-items-center">
                        <span class="badge badge-dark badge-sm">
                          Balance: {{ new Intl.NumberFormat('en-us', {
                            style: 'currency', currency: 'INR'
                          }).format(Balance) }}
                        </span>
                      </li>
                    </ul>
                  </div>
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
            <card :title="stats.users.title" :value="stats.users.value" :percentage="stats.users.percentage"
              :icon-class="stats.users.iconClass" :icon-background="stats.iconBackground"
              :percentage-color="stats.users.percentageColor" direction-reverse></card>
          </div>
          <div class="mt-4 col-lg-5 col-sm-5 mt-sm-0">
            <card :title="stats.clients.title" :value="stats.clients.value" :percentage="stats.clients.percentage"
              :icon-class="stats.clients.iconClass" :icon-background="stats.iconBackground"
              :percentage-color="stats.clients.percentageColor" direction-reverse></card>
            <card :title="stats.sales.title" :value="stats.sales.value" :icon-class="stats.sales.iconClass"
              :icon-background="stats.iconBackground" direction-reverse></card>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-10">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">Profits by Month</h6>
                </div>
              </div>
              <div class="table-responsive" style="height:400px;">
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
                          <h6 class="mb-0 text-sm">{{ new Intl.NumberFormat('en-us', {
                            style: 'currency', currency:
                              'INR'
                          }).format(stats.ProfitLoss) }}</h6>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                  Profit Loss Graph
                </div>
                <GradientLineChart v-if="is_chart_load" id="P/L Chart" :chart="{
                  labels: MonthlyStats.slice(0, 12).map(e => {
                    return e.Month
                  }),
                  datasets: [{
                    label: 'Profit',
                    data: MonthlyStats.slice(0, 12).map(e => {
                      return e.ProfitLoss
                    })
                  }
                  ]
                }" />
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
    <div class="row pinned-md">
      <div class="col-12">
        <!-- globe -->
        <globe  width="700" height="600" />
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/examples/Cards/Card.vue";
import Globe from "@/components/Globe.vue";
import { axiosClientIns } from "@/libs/client_axios";
import Cookies from 'js-cookie';
import GradientLineChart from "@/components/GradientLineChart.vue"

export default {
  name: "DashboardDefault",
  components: {
    Card,
    GradientLineChart,
    Globe
  },
  data() {
    return {

      uid: Cookies.get('uid', { domain: import.meta.env.VITE_APP_Parent_Domain }),
      vite_username: Cookies.get('vite_username', { domain: import.meta.env.VITE_APP_Parent_Domain }),
      finaltarget: 10000000,
      stats: {
        iconBackground: "bg-gradient-success",
        money: {
          title: "Life time profits",
          value: "0",
          percentage: "0",
          iconClass: "ni ni-money-coins",
        },
        users: {
          title: "Month's Profit",
          value: "0",
          percentage: "0",
          iconClass: "ni ni-world",
        },
        clients: {
          title: "Profit this year",
          value: "0",
          percentage: "0",
          iconClass: "ni ni-paper-diploma",
        },
        sales: {
          title: "Projection time for 1 Crore",
          value: "0",
          percentage: "0",
          iconClass: "ni ni-cart",
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
      InitialInvested: 0,
      withdrawal: [],
      Balance: 0,
      allwithdrawData: [],
      is_chart_load: false,
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
  },
  mounted() {

    this.lastyear = (parseInt(this.currentyear) - 1).toString()
    axiosClientIns
      .post("/search/statistics_col/needed_fields", {
        'filter': { "user": Cookies.get('vite_username') },
        'fields': { 'Months': 1 },
        'username': this.vite_username,
        'uid': this.uid
      }).then(response => {
        this.rawData = JSON.parse(response.data.real_data)
        this.allData = JSON.parse(response.data.real_data)
        this.MonthlyStats = this.allData['0']['Months']
        this.sortItemsByMonth();
        this.MonthlyStats.reverse();
        this.MonthlyStats.forEach(element => {
          this.Alltimestat += element.ProfitLoss
        });
        this.Balance = this.Balance + this.Alltimestat

        this.stats.money.value = new Intl.NumberFormat('en-us', { style: 'currency', currency: 'INR' }).format(this.Alltimestat)
        this.stats.users.value = new Intl.NumberFormat('en-us', { style: 'currency', currency: 'INR' }).format(this.MonthlyStats[0].ProfitLoss)
        try {
          this.percentMonthlyChange = (this.MonthlyStats[0].ProfitLoss) * (100 / this.MonthlyStats[1].ProfitLoss)
          // If last month is negative, Next month percent should be inverse to positive
          if (this.MonthlyStats[1].ProfitLoss < 0 && this.MonthlyStats[0].ProfitLoss >= 0) {
            this.percentMonthlyChange = -(this.percentMonthlyChange)
          }
        }
        catch (error) {
          if (this.MonthlyStats[0].ProfitLoss > 0) {
            this.percentMonthlyChange = 100

          }
        }
        this.stats.users.percentage = this.percentMonthlyChange.toFixed(2).toString() + "%"
        this.stats.money.percentage = (this.Alltimestat * (100 / this.finaltarget)).toFixed(2).toString() + "%"


        if (this.percentMonthlyChange < 0) {
          this.stats.users.percentageColor = "text-danger"
        };

        this.MonthlyStats.forEach(element => {
          if (element.Month.includes(this.currentyear)) {
            this.Thisyearstats += element.ProfitLoss
          }

        });
        this.stats.clients.value = new Intl.NumberFormat('en-us', { style: 'currency', currency: 'INR' }).format(this.Thisyearstats)

        this.MonthlyStats.forEach(element => {
          if (element.Month.includes(this.lastyear)) {
            this.Lastyearstats += element.ProfitLoss
          }
        });
        if (this.Lastyearstats < 0) {

          this.percentYearlyChange = (this.Thisyearstats) * (-100 / this.Lastyearstats)
        }
        else {
          this.percentYearlyChange = (this.Thisyearstats) * (100 / this.Lastyearstats)

        }
        if (this.Lastyearstats == 0) {
          this.percentYearlyChange = 100

          if (this.Thisyearstats < 0) {
            this.percentYearlyChange = -100

          }
        }


        // if(this.Lastyearstats < 0){
        //     this.percentYearlyChange = this.percentYearlyChange*-1

        //   }
        this.stats.clients.percentage = this.percentYearlyChange.toFixed(2).toString() + "%"
        if (this.percentYearlyChange < 0) {
          this.stats.clients.percentageColor = "text-danger"
        };
        if (this.Alltimestat * (100 / this.finaltarget) < 0) {
          this.stats.money.percentageColor = "text-danger"

        };
        if (this.percentMonthlyChange < 0) {
          this.stats.users.percentageColor = "text-danger"

        };


        this.projectedCompletionDate = this.calculateProjectedCompletionDate(this.finaltarget, this.Alltimestat, Math.floor((new Date() - new Date(Cookies.get('join_date'))) / (1000 * 60 * 60 * 24)))
        this.stats.sales.value = this.projectedCompletionDate

        if (this.Alltimestat <= 0) {
          this.stats.sales.value = "Will be updated soon..."
        }
        this.is_chart_load = true
      })
    if (this.vite_username == 'manan.qatester@gmail.com') {
      axiosClientIns
        .post("/search/statistics_col/needed_fields", {
          'filter': { "user": Cookies.get('vite_username') },
          'fields': { 'Months': 1, 'Withdrawals': 1, 'InitialInvested': 1 },
          'username': this.vite_username,
          'uid': this.uid
        }).then(response => {
          this.allwithdrawData = JSON.parse(response.data.real_data)
          this.InitialInvested = this.allwithdrawData[0]['InitialInvested']
          this.withdrawal = this.allwithdrawData[0]['Withdrawals']
          this.Balance = this.Balance + this.InitialInvested;
          for (let key in this.withdrawal) {
            this.Balance = this.Balance - this.withdrawal[key];
          }
        })
    }
  },

};
</script>
