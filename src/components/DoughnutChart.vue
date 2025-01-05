<template>

  <div class="card">
    <div class="card-header pb-0 p-3">
      <div class="d-flex align-items-center">
        <h6 class="mb-0"></h6>
        <!-- <button type="button"
          class="btn btn-icon-only btn-rounded btn-outline-secondary mb-0 ms-2 btn-sm d-flex align-items-center justify-content-center ms-auto"
          data-bs-toggle="tooltip" data-bs-placement="bottom" title=""
          data-bs-original-title="See the consumption per room"><i class="fas fa-info" aria-hidden="true"></i></button> -->
      </div>
    </div>
    <div class="card-body p-3">
      <div class="row mb-3">
        <div class="col-5 text-center pinned-sm">
          <div class="chart" style="height: 200px">
  <canvas id="doughnut-chart" class="chart-canvas" height="300px" style="box-sizing:border-box;"></canvas></div>
          <h4 class="font-weight-bold mt-n8"><span>{{ chart.labels.length }}</span><span class="d-block text-body text-sm">Stocks</span></h4>
        </div>
        <div class="col-lg-7 col-md-7 col-sm-12">
          <div class="table-responsive" style="height:300px;">
            <table class="table align-items-center mb-0">
              <tbody>
                <tr v-for="(ticker, k) in chart.labels" :key="k">
                  <td>
                    <div class="d-flex px-2 py-0"><span v-if="coloR_counter" class="badge me-3" v-bind:style="{backgroundColor: coloR[k]}">&nbsp; </span>
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ ticker }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center text-sm"><span class="text-xs font-weight-bold">
                      <!-- -->{{percentarray[k]}}%<!-- --> </span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  name: "BarChart",
  data() {
    return{
      percentarray : {},
      coloR_counter: false,
      coloR:[]
    }
  },
  props: {

    chart: {
      type: Object,
      required: true,
      labels: Array,
      datasets: {
        type: Array,
        label: String,
        data: Array,
      },
    },

  },
  mounted() {
    // Doughnut chart
    var ctx3 = document.getElementById("doughnut-chart").getContext("2d");
    this.coloR = [];

    var dynamicColors = function () {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    };

    for (var i in this.chart.labels) {
      this.coloR.push(dynamicColors());
    }
    this.coloR_counter = true

    new Chart(ctx3, {
  type: "doughnut",
  data: {
    labels: this.chart.labels,
    datasets: [{
      label: this.chart.datasets[0].label,
      weight: 9,
      cutout: 90,
      tension: 0.2,
      pointRadius: 10,
      borderWidth: 2,
      backgroundColor: this.coloR,
      data: this.chart.datasets[0].data,
      fill: false,
    }, ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
        position: "right"
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      y: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  },
});


  var data_sum = this.chart.datasets[0].data.reduce((a,b)=> a + b,0);
  var each_one = 100 / data_sum;
  this.percentarray = this.chart.datasets[0].data.map(e => (e* each_one).toFixed(2))
  },
  methods: {
    click_1(){

    console.log(this.percentarray)
    }
  }
};
</script>