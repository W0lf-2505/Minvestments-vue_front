<template>
  <div class="row">
    <div class="popup card col-lg-7 col-xl-7 col-md-10">
      <button v-if="loading" class="btn btn-primary btn-sm mb-2" type="button" disabled>
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Loading...
      </button>
      <!-- Button to close the popup -->
      <button style="width:0%" @click="closePopup" class="badge badge-success">X</button>
      <!-- Option data display -->
      <div>
        <h3>Option Data </h3>
        <div class="dropdown">
          <button class="btn bg-gradient-primary dropdown-toggle" type="button" id="dropdownMenuButton"
            data-bs-toggle="dropdown" aria-expanded="false">
            {{ selected_security }}
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li v-for="(optionData, index) in Positions" :key="index"><a class="dropdown-item"
                @click.prevent="change_security(index)">{{ index }}</a></li>
          </ul>
        </div>

        <!-- Add more fields as needed -->
      </div>
      <div class="text-dark" v-if="quotes[selected_security]">
        <p> Stock: {{ Positions[selected_security].stock_code }}</p>
        <p> Current price: {{ quotes[selected_security].ltp }}</p>
      </div>

      <!-- Plot P&L -->
      <canvas id="pnlChart" height="300"></canvas>

      <div class="text-dark" v-if="breakevens.length > 0">
        <div>Breakeven Points on nearest Expiry</div>
        <ul>
          <li v-for="(be, index) in breakevens" :key="index">{{ be.toFixed(2) }}</li>
        </ul>
      </div>
      <div style="margin: 30px;">
        <div class="card">
          <div class="table-responsive">
            <table v-if="chart" class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>qty</th>
                  <th>Position</th>
                </tr>

              </thead>
              <tbody>
                <tr v-if="localPositions[selected_security]"
                v-for="(position, index ) in localPositions[selected_security].positions" :key="index">
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div>

                        <div     style="margin-left:20px;"           class="justify-content-right d-flex form-check form-switch ps-3">
                          <input type="checkbox" :value="position" :checked="selected_positions.includes(position)"
                            @change="handleCheckboxChange($event, position)" class="mt-1 form-check-input" /> 
                        </div>
                      </div>

                    </div>
                  </td>
                  <td>
                    {{ position.quantity  }}
                  </td>
                  <td>
                    {{
                              selected_security + " "
                              + position.strike_price + " " +
                              position.expiry_date + " " + position.option_type }}
                  </td>
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
import Cookies from "js-cookie";
import * as jStat from 'jstat';
import { Chart, registerables } from "chart.js/auto";
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(...registerables, annotationPlugin);


// this.socket.emit("message", {
//         a: "get_quotes",
//         filter: {
//           stock_code: e.stock_code
//         },
//         session: Cookies.get("s_token"),
//       });

export default {
  data() {
    return {
      initialX: null,
      initialY: null,
      quotes: {},
      Positions: {},
      selected_security: "",
      chart: null,
      breakevens: [],
      loading: true,
      selected_positions: []
    };
  },
  props: {
    localPositions: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.Positions = JSON.parse(JSON.stringify(this.localPositions));
    this.selected_security = Object.keys(this.Positions)[0]
    this.selected_positions = [...this.localPositions[this.selected_security]["positions"]]
    if (this.$socket) {
      // Access the global socket and attach event listeners
      this.socket = this.$socket;

    }

    this.socket.emit("message", {
      a: "get_quotes",
      filter: {
        stock_code: "INDVIX"
      },
      session: Cookies.get("s_token"),
    });


    this.socket.emit("message", {
      a: "get_quotes",
      filter: {
        stock_code: this.Positions[this.selected_security]['stock_code']
      },
      session: Cookies.get("s_token"),
    });

    this.socket.on("get_quotes", (data) => {
      if (data.Success[0].exchange_code == "NSE") {
        this.quotes[data.Success[0].stock_code] = { ltp: data.Success[0].ltp }

      }
      else {
        this.quotes[data.Success[1].stock_code] = { ltp: data.Success[1].ltp }

      }
      if (data.Success[0].stock_code != 'INDVIX') {
        this.plotCombinedPL();

      }
    })




  },
  methods: {
    handleCheckboxChange(event, position) {
      if (event.target.checked) {
        if (!this.selected_positions.includes(position)) {
          this.selected_positions.push(position);
        }
      } else {
        const index = this.selected_positions.indexOf(position);
        if (index > -1) {
          this.selected_positions.splice(index, 1);
        }
      }
      this.Positions[this.selected_security]["positions"] = this.selected_positions
      try {

        this.chart.destroy()
        this.chart = null

      }
      catch {
        console.log("wait")
      }

      this.socket.emit("message", {
        a: "get_quotes",
        filter: {
          stock_code: this.Positions[this.selected_security]['stock_code']
        },
        session: Cookies.get("s_token"),
      });

    },

    change_security(name) {
      try {

        this.chart.destroy()
        this.chart = null

      }
      catch {
        console.log("wait")
      }
      this.selected_security = name
      this.Positions = JSON.parse(JSON.stringify(this.localPositions));

      this.socket.emit("message", {
        a: "get_quotes",
        filter: {
          stock_code: this.Positions[this.selected_security]['stock_code']
        },
        session: Cookies.get("s_token"),
      });


    },
    closePopup() {
      this.$emit('child-data', { 'type': 'closebox', 'data': false })

    },

    calculatePLAtExpiration(optionDataList, prices, nearestExpiryDate) {
      let combinedPL = new Array(prices.length).fill(0);
      const optionData = optionDataList;
      const spotPrice = this.quotes[optionDataList.stock_code]['ltp'];

      optionData.positions.forEach(position => {
        const expiryDate = new Date(position.expiry_date)
        const T = (expiryDate - nearestExpiryDate) / (365.0 * 24 * 60 * 60 * 1000);
        const K = parseFloat(position.strike_price);
        const r = 0.1; // Example risk-free rate
        const quantity = position.quantity;
        const originalPrice = parseFloat(position.average_price);
        const optionType = position.option_type.toLowerCase().replace("ce", "call").replace("pe", "put");
        const option_price = parseFloat(position.option_price)
        let impliedVol = null

        if (T != 0) {

          impliedVol = this.impliedVolatility(option_price, spotPrice, K, T, r, optionType);

          if (!impliedVol) {
            // throw new Error('Implied volatility not found for the position.');
            // impliedVol = this.quotes['INDVIX']['ltp'] / 100
            // console.log(originalPrice,spotPrice,optionType)
            impliedVol = 0
          }
        }


        const plData = prices.map(S => {
          let optionPrice = 0
          if (T == 0) {
            optionPrice = optionType === 'call'
              ? Math.max(S - K, 0)
              : Math.max(K - S, 0);
          }
          else {
            optionPrice = optionType === 'call'
              ? this.blackScholesCall(S, K, T, r, impliedVol)
              : this.blackScholesPut(S, K, T, r, impliedVol);

          }

          const pl = (optionPrice - originalPrice) * quantity;
          return pl;
        });

        combinedPL = combinedPL.map((pl, index) => pl + plData[index]);
      });

      return combinedPL;
    },

    calculateCombinedPL(optionDataList, prices) {
      let combinedPL = new Array(prices.length).fill(0);

      const optionData = optionDataList;
      const spotPrice = this.quotes[optionDataList.stock_code]['ltp'];


      optionData.positions.forEach(position => {
        const currentDate = new Date();
        const expiryDate = new Date(position.expiry_date)
        const T = (expiryDate - currentDate) / (365.0 * 24 * 60 * 60 * 1000); // Time to expiration in years
        const K = parseFloat(position.strike_price);
        const r = 0.1; // Example risk-free rate
        const quantity = position.quantity;
        const originalPrice = parseFloat(position.average_price);
        const optionType = position.option_type.toLowerCase().replace("ce", "call").replace("pe", "put");
        const option_price = parseFloat(position.option_price)

        let impliedVol = this.impliedVolatility(option_price, spotPrice, K, T, r, optionType);
        if (!impliedVol) {

          // throw new Error('Implied volatility not found for the position.');
          impliedVol = 0

          // impliedVol = this.quotes['INDVIX']['ltp'] / 100
          // console.log(originalPrice,spotPrice,optionType)
        }

        const plData = prices.map(S => {
          const optionPrice = optionType === 'call'
            ? this.blackScholesCall(S, K, T, r, impliedVol)
            : this.blackScholesPut(S, K, T, r, impliedVol);
          const pl = (optionPrice - originalPrice) * quantity;
          return pl;
        });

        combinedPL = combinedPL.map((pl, index) => pl + plData[index]);
      });


      return combinedPL;
    },
    blackScholesCall(S, K, T, r, sigma) {
      const d1 = (Math.log(S / K) + (r + 0.5 * Math.pow(sigma, 2)) * T) / (sigma * Math.sqrt(T));
      const d2 = d1 - sigma * Math.sqrt(T);
      return S * jStat.normal.cdf(d1, 0, 1) - K * Math.exp(-r * T) * jStat.normal.cdf(d2, 0, 1);
    },
    blackScholesPut(S, K, T, r, sigma) {
      const d1 = (Math.log(S / K) + (r + 0.5 * Math.pow(sigma, 2)) * T) / (sigma * Math.sqrt(T));
      const d2 = d1 - sigma * Math.sqrt(T);
      return K * Math.exp(-r * T) * jStat.normal.cdf(-d2, 0, 1) - S * jStat.normal.cdf(-d1, 0, 1);
    },
    impliedVolatility(optionPrice, S, K, T, r, optionType) {
      const TOLERANCE = 70;
      const MAX_ITERATIONS = 1000;
      let lowerBound = 0.001;  // Lower bound for volatility
      let upperBound = 5.0;   // Upper bound for volatility
      let sigma = (lowerBound + upperBound) / 2;  // Initial guess for volatility

      for (let i = 0; i < MAX_ITERATIONS; i++) {
        let price = optionType === 'call'
          ? this.blackScholesCall(S, K, T, r, sigma)
          : this.blackScholesPut(S, K, T, r, sigma);

        let d1 = (Math.log(S / K) + (r + 0.5 * Math.pow(sigma, 2)) * T) / (sigma * Math.sqrt(T));
        let vega = S * jStat.normal.pdf(d1) * Math.sqrt(T);

        if (vega === 0) {
          console.log('Vega is zero, stopping iterations.');
          return null;  // Vega should not be zero; if it is, there's an issue
        }

        let diff = price - optionPrice;

        if (Math.abs(diff) < TOLERANCE) {
          return sigma;  // Found the implied volatility within the tolerance
        }

        if (diff > 0) {
          upperBound = sigma;
        } else {
          lowerBound = sigma;
        }

        sigma = (lowerBound + upperBound) / 2;  // New guess for volatility
      }

      return null
    },
    getNearestExpiryDate(optionDataList) {
      let nearestExpiryDate = new Date("30-Dec-9999");
      const currentDate = new Date();


      const optionData = optionDataList;
      optionData.positions.forEach(position => {
        const expiryDate = new Date(position.expiry_date);
        if (expiryDate > currentDate && expiryDate < nearestExpiryDate) {
          nearestExpiryDate = expiryDate;
        }
      });

      return nearestExpiryDate;
    },
    calculateStandardDeviation(optionDataList) {
      let combinedVolatility = 0;
      let totalQuantity = 0;


      const optionData = optionDataList;
      const spotPrice = this.quotes[optionData.stock_code]["ltp"];

      optionData.positions.forEach(position => {
        const expiryDate = new Date(position.expiry_date);
        const currentDate = new Date();
        const T = (expiryDate - currentDate) / (365.0 * 24 * 60 * 60 * 1000); // Time to expiration in years
        const K = parseFloat(position.strike_price);
        const r = 0.1; // Example risk-free rate
        const currentOptionPrice = parseFloat(position.option_price);
        const optionType = position.option_type.toLowerCase().replace("ce", "call").replace("pe", "put");



        try {
          const impliedVol = this.impliedVolatility(currentOptionPrice, spotPrice, K, T, r, optionType);
          combinedVolatility += impliedVol * Math.abs(position.quantity);
          totalQuantity += Math.abs(position.quantity);
        } catch (error) {
          console.error(error.message);
        }
      });


      return combinedVolatility / totalQuantity;
    },
    plotCombinedPL() {

      const currentDate = new Date();
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      let spotPrice = 0;

      spotPrice = this.quotes[this.Positions[this.selected_security].stock_code]['ltp'];
      // const standardDeviation = spotPrice * (this.quotes["INDVIX"]["ltp"] / 100);
      // const stdDev = this.calculateStandardDeviation(this.Positions[this.selected_security]);
      minPrice = Math.round((Math.round(spotPrice / 10) * 10 - Math.round(spotPrice / 10) * 1.2) / 100) * 100
      maxPrice = Math.round((Math.round(spotPrice / 10) * 10 + Math.round(spotPrice / 10) * 1.2) / 100) * 100
      // minPrice = Math.round((spotPrice - 1.5 * standardDeviation)/100)*100;
      // maxPrice = Math.round((spotPrice + 1.5 * standardDeviation)/100)*100;


      let prices = [];
      const step = 10;
      for (let price = minPrice; price <= maxPrice; price += step) {
        prices.push(price);
      }

      const nearestExpiryDate = this.getNearestExpiryDate(this.Positions[this.selected_security]);
      const combinedPL = this.calculateCombinedPL(this.Positions[this.selected_security], prices);
      const plAtExpiration = this.calculatePLAtExpiration(this.Positions[this.selected_security], prices, nearestExpiryDate);

      // Find breakevens
      this.breakevens = this.findBreakevens(prices, plAtExpiration);


      if (!this.chart) {
        const ctx = document.getElementById("pnlChart").getContext("2d");

        var gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
        gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
        gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

        const data = {
          labels: prices,
          datasets: [
            {
              label: "P&L on " + currentDate.toDateString(),
              tension: 0.1,
              data: combinedPL,
              borderColor: "#17c1e8",
              backgroundColor: 'red',
              fill: false,
              borderWidth: 4,
              pointRadius: 0,
            },
            {
              label: "P&L on " + nearestExpiryDate.toDateString(),
              tension: 0.1,
              data: plAtExpiration,
              borderColor: "#cb0c9f",
              borderDash: [5, 5],
              fill: true,
              backgroundColor: gradientStroke1,
              borderWidth: 4,
              pointRadius: 0,
            },
          ],
        };
        this.chart = new Chart(ctx, {
          type: "line",
          data: data,
          options: {
            plugins: {
              // legend:{
              //   display:true
              // }

              tooltip: {
                callbacks: {
                  // Customize the title of the tooltip
                  title: function (tooltipItems) {
                    return 'When price at: ' + tooltipItems[0].label;
                  },
                  // Customize the label of the tooltip
                  label: function (tooltipItem) {
                    var dataset = tooltipItem.dataset;
                    var datasetLabel = dataset.label || '';
                    var value = dataset.data[tooltipItem.dataIndex];
                    return datasetLabel + ': ₹' + value.toFixed(2);
                  },
                  // Customize the footer of the tooltip
                  footer: function (tooltipItems) {
                    return 'Projections may vary';
                  }
                },
                // Additional options for styling the tooltip
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: {
                  size: 14,
                  weight: 'bold',
                  family: 'Open Sans',
                },
                titleColor: '#ffffff',
                bodyFont: {
                  size: 12,
                  family: 'Open Sans',
                },
                bodyColor: '#ffffff',
                footerFont: {
                  size: 10,
                  family: 'Open Sans',
                },
                footerColor: '#ffffff',
                padding: 10,
                displayColors: false,
              },

              annotation: {
                annotations: [

                  {
                    type: "line",
                    mode: "vertical",
                    scaleID: "x",
                    // value: Math.round(spotPrice/100)*100,
                    value: 42492,
                    borderColor: "#cb0c9f",
                    borderWidth: 1,
                    label: {
                      content: "Spot Price",
                      enabled: true,
                      position: "bottom",
                    },
                  }
                ]

              },
            },
            interaction: {
              intersect: false,
              mode: "index",
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: this.selected_security,
                },
                grid: {

                  drawBorder: false,
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
                  borderDash: [5, 5],
                },

                ticks: {
                  display: true,
                  padding: 10,
                  color: "#b2b9bf",
                  font: {
                    size: 11,
                    family: "Open Sans",
                    style: "normal",
                    lineHeight: 2,
                  },
                },

              },
              y: {
                title: {
                  display: true,
                  text: "P&L",
                },
                grid: {
                  drawBorder: false,
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
                  borderDash: [5, 5],
                },

                ticks: {
                  display: true,
                  padding: 10,
                  color: "#b2b9bf",
                  font: {
                    size: 11,
                    family: "Open Sans",
                    style: "normal",
                    lineHeight: 2,
                  },
                  callback: function (value, index, values) {
                    if (value >= 100000 || value <= -100000) {
                      return '₹' + (value / 100000).toFixed(1) + 'L';
                    }
                    // Convert the value to Thousands if greater than or equal to 1000
                    else if (value >= 1000 || value <= -1000) {
                      return '₹' + (value / 1000).toFixed(1) + 'K';
                    }
                    // Return the original value if less than 1000
                    else {
                      return '₹' + value;
                    }
                  }
                },
              },
            },
          },

        });
        // Customize the fill colors based on P&L data
        this.chart.options.plugins.filler.target = 'origin';
        this.chart.options.plugins.filler.from = 'green'; // Green color for positive values
        this.chart.options.plugins.filler.colors = [{ // Red color for negative values
          above: 'green',
          below: 'red'
        }];
      }
      else {
        this.chart.data.datasets[0].data = combinedPL;
        this.chart.data.datasets[1].data = plAtExpiration;
        this.chart.update();

      }
      this.loading = false

    },

    findBreakevens(priceRange, pnlData) {
      const breakevens = [];
      for (let i = 1; i < pnlData.length; i++) {
        if ((pnlData[i - 1] < 0 && pnlData[i] > 0) || (pnlData[i - 1] > 0 && pnlData[i] < 0)) {
          const x0 = priceRange[i - 1];
          const y0 = pnlData[i - 1];
          const x1 = priceRange[i];
          const y1 = pnlData[i];
          const breakeven = x0 - (y0 * (x1 - x0)) / (y1 - y0);
          breakevens.push(breakeven);
        }
      }
      return breakevens;
    },

  },

  beforeUnmount() {
    this.socket.removeAllListeners();
    if (this.chart) {

      this.chart.destroy()

      this.chart = null
    }
    // Cookies.set('s_intract', true)
  },

};
</script>

<style>
.popup {
  position: fixed !important;
  top: 50%;
  left: 50%;
  /* max-width: 90%; */
  /* Adjust as needed */
  max-height: 90%;
  /* Adjust as needed */
  transform: translate(-50%, -50%);
  overflow: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 99;
}
</style>