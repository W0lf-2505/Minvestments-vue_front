<template>
  <div>
    <!-- Notification Alert  -->
    <soft-alert v-if="is_alert" :color="alert_code == 200 ? 'success' : 'danger'"
      :icon="alert_code == 200 ? 'ni ni-like-2 ni-lg' : 'ni ni-fat-remove ni-lg'">
      {{ alert_data }}
    </soft-alert>
    <!--  -->

    <!-- Order Box -->
    <orderbox v-if="is_sendtoorder" :Price="order_price" :Quantity="order_quantity" :Security="order_stock"
      :toggleActionMode="order_action" :LotSize="order_lotsize" :Token="order_token"
      v-on:child-data="handleorderData" />
    <!--  -->

    <Strategybuilder v-if="is_analysis" :localPositions="analysis_positions" v-on:child-data="handleAnalyse">
    </Strategybuilder>

    <!-- Top Bars -->
    <div class="row">
      <!-- Nifty 50, Bank Nifty Pinner -->

      <!-- Name top bar -->
      <div class="">

        <div class="card flex">
          <soft-badge variant="gradient" color="info">

            <li class="unpinned-sm" style="display: none;"><span class="badge badge-secondary badge-xl">Live Trading
                Platform</span>
              &nbsp;&nbsp;&nbsp;</li>
            <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" data-scroll="true"
              :class="[navClasses]" style="height: 40px">
              <div id="navbar" class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
                :class="$store.state.isRTL ? 'px-0' : 'me-sm-4'">

              </div>
              <div class="px-3 py-1 container-fluid">
                <ul class="hide navbar-nav justify-content-end">
                  <li>
                    <!-- <span v-if="
                      breeze_ws_data['NIFTY BANK'] && breeze_ws_data['NIFTY 50']
                    " class="pinned-sm px-0 text-sm font-weight-bolder align-items-center" style="text-align: left">
                      BANK NIFTY :
                      {{
                        new Intl.NumberFormat("en-us", {
                          style: "currency",
                          currency: "INR",
                        }).format(breeze_ws_data["NIFTY BANK"]["last"])
                      }}&emsp;
                      NIFTY 50:
                      {{
                        new Intl.NumberFormat("en-us", {
                          style: "currency",
                          currency: "INR",
                        }).format(breeze_ws_data["NIFTY 50"]["last"])
                      }}
                    </span> -->

                    <VsudButton v-on:click.prevent="openPDF"  class="button badge badge-secondary badge-s pinned-sm">Opening Bell Report
                    </VsudButton>
                  </li>
                </ul>

                <div id="navbar" class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
                  :class="$store.state.isRTL ? 'px-0' : 'me-sm-4'">
                  <div class="pe-md-3 d-flex align-items-center"
                    :class="$store.state.isRTL ? 'me-md-auto' : 'ms-md-auto'"></div>

                  <ul class="hide navbar-nav justify-content-end">
                    <li class="pinned-sm"><span class="badge badge-secondary badge-xl">Live Trading Platform</span>
                      &nbsp;&nbsp;&nbsp;</li>
                    <li>
                      <span class="px-0 text-dark font-weight-bolder d-flex align-items-center">
                        <img v-if="isws_connected" src="@/assets/img/icons8-online-tiny-color/icons8-online-16.png"
                          alt="Online" />
                        <VsudButton v-if="!isws_connected" v-on:click.prevent="connectws" class="button">Connect
                        </VsudButton>
                        <!-- demo-button -->
                        <!-- <VsudButton v-on:click.prevent="loggerbutton" class="button">Connect
                        </VsudButton> -->
                        &nbsp;&nbsp;&nbsp;
                        {{ trade_user["idirect_user_name"] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </soft-badge>
        </div>
      </div>
      <!--  -->

    </div>
    <!--  -->

    <div class="row">

      <!-- Watchlist -->
      <div class="pinned-sm col-xl-3 col-lg-4 col-md-4 col-sm-12 pulldown-sm">
        <p></p>
        <div class="card flex" style="padding-left: 10px; padding-right: 10px ">
          <div class="p-3 pb-0 card-header">
            <br />
            <div class="d-flex justify-content-between" style="height:100%;">
              <h6 class="mb-2">Watchlist</h6>
            </div>
          </div>
          <div class="marketwatch-wrap" style="height: 700px; display: flex; flex-direction: column">
            <div class="omnisearch">
              <header>
                <!-- search bar -->
                <div>
                  <div class="input-group z-index-1">
                    <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i>
                    </span><input type="text" v-model="searchTerm" class="form-control"
                      placeholder="Search (infy bse, nifty fut, etc" />
                  </div>

                  <div class="counts text-lightest">
                    {{ watchlist[selected_watchlist].length }} / 50
                  </div>
                </div>
                <!--  -->

              </header>
            </div>

            <!-- Search results -->
            <ul class="dropdown-menu show" v-if="search_results.length > 0"
              style="list-style-type: none; padding-left: 0px; z-index: 0; z-index: 100;margin-top: 12%;height:300px; overflow-y: auto">
              <li v-for="suggestion in search_results" :key="suggestion.CompanyName">
                <a class="dropdown-item" @click="addToWatchlist(suggestion)">{{
                  suggestion.fullname
                  }}</a>
              </li>
            </ul>
            <!--  -->

            <!-- Watchlist Items -->
            <div class="instruments">
              <div v-for="item in watchlist[selected_watchlist]" :key="item.fullname" class="vddl-list list-flat">
                <!-- <span class="badge badge-success badge-md">{{ item.fullname }}</span><p></p> -->

                <ul class="list-group">
                  <li class="pb-0 border-0 list-group-item justify-content-between ps-0 border-radius-lg">
                    <div class="d-flex">
                      <div class="d-flex align-items-center">
                        <!-- <button  v-if="breeze_ws_data[item.fullname]"
                          class="pinned-lg p-3 mb-0 btn btn-icon-only btn-rounded me-3 btn-sm d-flex align-items-center justify-content-center"
                          v-bind:class="breeze_ws_data[item.fullname]['last'] >
                            breeze_ws_data[item.fullname]['open']
                            ? 'btn-outline-success'
                            : 'btn-outline-danger'
                            ">
                          <i class="fas" v-bind:class="breeze_ws_data[item.fullname]['last'] >
                            breeze_ws_data[item.fullname]['open']
                            ? 'fa-arrow-up text-success'
                            : 'fa-arrow-down text-danger'
                            "></i>
                        </button>
                        <button v-else
                          class="pinned-lg p-3 mb-0 btn btn-icon-only btn-rounded me-3 btn-sm d-flex align-items-center justify-content-center btn-outline-info">
                          <i class="fas fa-arrow-right text-info"></i>
                        </button> -->
                        <div class="d-flex flex-column col-lg-12 col-md-12 col-sm-12">
                          <h6 style="width:150px;" class="mb-1 text-sm text-dark">
                            {{ item.fullname }}
                          </h6>
                          <span v-if="item.Series != '0'" class="text-xs">
                            <span type="button" @click="sendToOrder(item, false)"
                              class="badge badge-success badge-sm">Buy</span>
                            &nbsp;
                            <span type="button" @click="sendToOrder(item, true)"
                              class="badge badge-danger badge-sm">Sell</span>
                            &nbsp;
                          </span>


                        </div>
                      </div>
                      <div v-if="breeze_ws_data[item.fullname]"
                        class="text-sm d-flex align-items-center text-gradient font-weight-bold ms-auto flex-column"
                        style="padding-top: 5px" v-bind:class="breeze_ws_data[item.fullname]['last'] >
                          breeze_ws_data[item.fullname]['open']
                          ? 'text-success'
                          : 'text-danger'
                          ">
                        {{
                          new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(breeze_ws_data[item.fullname]["last"])
                        }}
                        <span class="text-xs">{{ breeze_ws_data[item.fullname]["change"] }} %</span>
                      </div>
                      &nbsp;

                      <div style="margin-left: 5px !important;"
                        class="text-sm d-flex align-items-center font-weight-bold ms-auto flex-column">
                        <span type="button" @click="removefromwatchlist(item)"
                          class="badge badge-info badge-sm">X</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!--  -->

            <nav class="dataTable-pagination">
              <ul class="dataTable-pagination-list">
                <li v-for="(key, index) in Object.keys(watchlist)" :class="{ active: index === selected_watchlist }"
                  :key="index"><a href="#" @click.prevent="selected_watchlist = index">{{
                    parseInt(key) + 1 }}</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <!-- Watchlist end -->

      <!-- Right bar - contains Positions -->
      <div class="col-xl-9 col-lg-8 col-md-8 col-sm-12">
        <p></p>
        <div class="card elements-sm">

          <!-- Top Bar, selector, P/L and Allocate funds -->
          <div class="p-3 pb-0 card-header">
            <br />
            <div class="d-flex justify-content-between">
              <div class="row">

                <!-- Top Bar / Selector -->
                <div class="col-lg-4 col-md-5 col-sm-4">

                  <!-- Hidden watchlist button -->
                  <div class="unpinned-sm" style="display: none">
                    <span type="button" @click.prevent="hidden_watch = !hidden_watch"
                      class="badge badge-info badge-s">watchlist {{ hidden_watch }}</span>
                      
                     &nbsp;
                    <VsudButton v-on:click.prevent="openPDF"  class="button badge badge-info badge-s">Opening Bell Report
                    </VsudButton>


                    <!-- Hidden Watchlist -->
                    <div v-if="hidden_watch" class="card flex" style="padding-left: 10px; padding-right: 10px ">
                      <div class="p-3 pb-0 card-header">
                        <br />
                        <div class="d-flex justify-content-between" style="height:80%;">
                          <h6 class="mb-2">Watchlist</h6>
                        </div>
                      </div>
                      <div class="marketwatch-wrap" style="height: 600px; display: flex; flex-direction: column">
                        <div class="omnisearch">
                          <header>
                            <!-- search bar -->
                            <div>
                              <div class="input-group z-index-1">
                                <span class="input-group-text text-body"><i class="fas fa-search"
                                    aria-hidden="true"></i>
                                </span><input type="text" v-model="searchTerm" class="form-control"
                                  placeholder="Search (infy bse, nifty fut, etc" />
                              </div>

                              <div class="counts text-lightest">
                                {{ watchlist[selected_watchlist].length }} / 50
                              </div>
                            </div>
                            <!--  -->

                          </header>
                        </div>

                        <!-- Search results -->
                        <ul class="dropdown-menu show" v-if="search_results.length > 0"
                          style="list-style-type: none; padding-left: 0px; z-index: 0; z-index: 100;margin-top: 12%;height:300px; overflow-y: auto;">
                          <li v-for="suggestion in search_results" :key="suggestion.CompanyName">
                            <a class="dropdown-item" @click="addToWatchlist(suggestion)">{{
                              suggestion.fullname
                              }}</a>
                          </li>
                        </ul>
                        <!--  -->

                        <!-- Watchlist Items -->
                        <div class="instruments">
                          <div v-for="item in watchlist[selected_watchlist]" :key="item.fullname"
                            class="vddl-list list-flat">
                            <!-- <span class="badge badge-success badge-md">{{ item.fullname }}</span><p></p> -->

                            <ul class="list-group">
                              <li class="pb-0 border-0 list-group-item justify-content-between ps-0 border-radius-lg">
                                <div class="d-flex">
                                  <div class="d-flex align-items-center">
                                    <button v-if="breeze_ws_data[item.fullname]"
                                      class="p-3 mb-0 btn btn-icon-only btn-rounded me-3 btn-sm d-flex align-items-center justify-content-center"
                                      v-bind:class="breeze_ws_data[item.fullname]['last'] >
                                        breeze_ws_data[item.fullname]['open']
                                        ? 'btn-outline-success'
                                        : 'btn-outline-danger'
                                        ">
                                      <i class="fas" v-bind:class="breeze_ws_data[item.fullname]['last'] >
                                        breeze_ws_data[item.fullname]['open']
                                        ? 'fa-arrow-up text-success'
                                        : 'fa-arrow-down text-danger'
                                        "></i>
                                    </button>
                                    <button v-else
                                      class="p-3 mb-0 btn btn-icon-only btn-rounded me-3 btn-sm d-flex align-items-center justify-content-center btn-outline-info">
                                      <i class="fas fa-arrow-right text-info"></i>
                                    </button>
                                    <div class="d-flex flex-column col-lg-12 col-md-12 col-sm-12">
                                      <h6 style="width:150px;" class="mb-1 text-sm text-dark">
                                        {{ item.fullname }}
                                      </h6>
                                      <span v-if="item.Series != '0'" class="text-xs">
                                        <span type="button" @click="sendToOrder(item, false)"
                                          class="badge badge-success badge-sm">Buy</span>
                                        &nbsp;
                                        <span type="button" @click="sendToOrder(item, true)"
                                          class="badge badge-danger badge-sm">Sell</span>
                                        &nbsp;
                                      </span>


                                    </div>
                                  </div>
                                  <div v-if="breeze_ws_data[item.fullname]"
                                    class="text-sm d-flex align-items-center text-gradient font-weight-bold ms-auto flex-column"
                                    style="padding-top: 5px" v-bind:class="breeze_ws_data[item.fullname]['last'] >
                                      breeze_ws_data[item.fullname]['open']
                                      ? 'text-success'
                                      : 'text-danger'
                                      ">
                                    {{
                                      new Intl.NumberFormat("en-us", {
                                        style: "currency",
                                        currency: "INR",
                                      }).format(breeze_ws_data[item.fullname]["last"])
                                    }}
                                    <span class="text-xs">{{ breeze_ws_data[item.fullname]["change"] }} %</span>
                                  </div>
                                  &nbsp;

                                  <div class="text-sm d-flex align-items-center font-weight-bold ms-auto flex-column">
                                    <span type="button" @click="removefromwatchlist(item)"
                                      class="badge badge-info badge-sm">X</span>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <!--  -->

                        <nav class="dataTable-pagination">
                          <ul class="dataTable-pagination-list">
                            <li v-for="(key, index) in Object.keys(watchlist)"
                              :class="{ active: index === selected_watchlist }" :key="index"><a href="#"
                                @click.prevent="selected_watchlist = index">{{
                                  parseInt(key) + 1 }}</a></li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                    <!--Hidden Watchlist end -->
                    <p></p>


                  </div>
                  <!--  -->

                  <div class="dropdown">
                    <span style="white-space: nowrap; overflow: hidden;"
                      class="px-0 dropdown-toggle text-dark font-weight-bolder d-flex align-items-center" type="button"
                      id="dropdownMenuButton" data-bs-toggle="dropdown">{{ Displaystype }}
                    </span>

                    <!-- Dropdown for display -->
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li v-for="display in Displaystypes" :key="display" class="px-3 nav-item d-flex align-items-center"
                        ><span type="button" @click.prevent="changedisplay(display)">{{ display }}</span><br></li>
                    </ul>
                    <!--  -->

                  </div>
                </div>
                <!--  -->



                <!-- PNL FNO Open Positions -->
                <div class="col-lg-3 col-md-5 col-sm-4 ms-md-auto" v-if="Displaystype === 'Open Positions'">PNL <span
                    :class="totalpl < 0 ? 'text-danger' : 'text-success'">{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(totalpl) }}</span>
                </div>
                <!--  -->
                <!-- PNL Order book -->
                <div class="col-lg-3 col-md-5 col-sm-4 ms-md-auto" v-if="Displaystype === 'Order book'">PNL <span
                    :class="orderbook_pnl < 0 ? 'text-danger' : 'text-success'">{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(orderbook_pnl) }}</span>
                </div>
                <!--  -->

                <!-- Order Book Date Selector -->
                <div class="col-lg-9 col-md-9 col-sm-9" v-if="Displaystype === 'Order book'">
                  <div class="row">
                    <div class="col-lg-2" style="text-align: left;">
                      from </div>
                    <div class="col-lg-3"><input v-model="from_date" id="from_date" type="date" class="form-control"
                        placeholder="Date">
                    </div>
                    <div class="col-lg-1">
                      to</div>
                    <div class="col-lg-3"><input v-model="to_date" id="to_date" type="date" class="form-control"
                        placeholder="Date">
                    </div>
                    <div class="col-lg-3">

                      <span type="button" @click.prevent="changedisplay(Displaystype)"
                        class="badge badge-secondary badge-sm">View</span>
                    </div>
                  </div>
                </div>
                <!--  -->

                <!-- Allocate funds -->
                <div class="mb-2 col-lg-12 col-md-12 col-sm-12">
                  <span style="margin: 5px;" id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info">Equity:{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(allocated_equity) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3  align-items-center"
                    aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'Equity', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'Equity', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul>
                  &nbsp;
                  <span style="margin: 5px;" id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info">FNO:{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(allocated_fno) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3" aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'FNO', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'FNO', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul>
                  &nbsp;
                  <span style="margin: 5px;" id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info">Commodity:{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(allocated_commodity) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3" aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'Commodity', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'Commodity', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul>
                  &nbsp;
                  <span style="margin: 5px;" id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info">Currency:{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(allocated_currency) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3" aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'Currency', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'Currency', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul>
                  &nbsp;
                  <span class="badge badge-info" style="margin: 5px;">Unallocated:{{ new Intl.NumberFormat("en-us", {
                    style: "currency",
                    currency: "INR",
                  }).format(unallocated_balance) }}</span>
                  &nbsp;

                  <span v-if="Displaystype == 'Open Positions'" type="button" class="badge badge-danger badge-s"
                    @click="Analyse">Analyse positions</span>
                </div>
                <!--  -->

              </div>
            </div>
          </div>
          <!--  -->

          <!-- Positions table -->
          <div class="table-responsive" style="height: 600px" v-if="Displaystype === 'Open Positions'">
            <table class="table align-items-center table-sm">
              <!-- Positions Header -->
              <thead>
                <tr>
                  <td>
                    <div class="px-0 py-1 d-flex align-items-center">
                      <div>
                        <!-- <img :src="sale.flag" alt="Country flag" /> -->
                      </div>
                      <div class="ms-4">
                        <h5 class="mb-0 text-sm">Stock</h5>
                      </div>
                    </div>
                  </td>
                  <td class="pinned-sm">
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
                      <h3 class="mb-0 text-sm">LTP</h3>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h3 class="mb-0 text-sm">Profit</h3>
                    </div>
                  </td>
                </tr>
              </thead>
              <!--  -->

              <!-- Positions Body -->
              <tbody v-for="(stats, PL) in trade_positions" :key="PL">
                <tr :class="stats.action == 'Buy' ? 'bg-success-soft-4' : 'bg-danger-soft-4'">
                  <td @click="togglePinned(PL)">
                    <div class="px-0 py-1 d-flex align-items-center">
                      <div class="ms-4">
                        <h6 class="mb-0 text-sm hover-target" id="makesmall">
                          {{ getshortername(tickers[stats.stock_code]) }}
                        </h6>
                        <p style="margin-bottom: 0px" id="makesmall">
                          {{ stats.expiry_date }} {{ stats.strike_price }}
                          {{ stats.right }}
                        </p>
                        <div id="makesmall" :class="{ 'pinned-sm': !isActive(PL) }">
                          <span type="button" @click="sendToOrder(stats, false)" class="badge badge-success badge-xl"
                            style="margin: 3px;">Buy</span>
                          <span type="button" @click="sendToOrder(stats, true)" class="badge badge-danger badge-xl"
                            style="margin: 3px;">Sell</span>

                          <span type="button" @click="sendToOrder(stats)" class="badge badge-info badge-xl"
                            style="margin: 3px;">Exit</span>

                          <span type="button" @click="sendToOrder(stats, undefined, stats.quantity)"
                            class="badge badge-dark badge-xl" style="margin: 3px;">Exit all</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="pinned-sm">
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h6 class="mb-0 text-sm">
                        {{
                          new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(stats.average_price)
                        }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center" :class="stats.action == 'Buy' ? 'text-success' : 'text-danger'">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h6 v-if="stats.action == 'Buy'" class="mb-0 text-sm" id="makesmall">
                        {{ stats.quantity }}
                      </h6>
                      <h6 v-else class="mb-0 text-sm" id="makesmall">
                        {{ stats.quantity * -1 }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h6 v-if="
                        breeze_ws_data[
                        tickers[stats.stock_code] +
                        stats.strike_price +
                        stats.right +
                        stats.expiry_date
                        ]
                      " class="mb-0 text-sm">
                        {{
                          new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(
                            breeze_ws_data[
                            tickers[stats.stock_code] +
                            stats.strike_price +
                            stats.right +
                            stats.expiry_date
                            ]["bPrice"]
                          )
                        }}
                      </h6>
                      <h6 v-else class="mb-0 text-sm">
                        {{
                          new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(stats.ltp)
                        }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <div v-if="
                        breeze_ws_data[
                        tickers[stats.stock_code] +
                        stats.strike_price +
                        stats.right +
                        stats.expiry_date
                        ]
                      ">
                        <div id="makesmall" v-if="stats.action == 'Sell'" class="mb-0 text-sm" :class="(stats.average_price - (breeze_ws_data[
                          tickers[stats.stock_code] +
                          stats.strike_price +
                          stats.right +
                          stats.expiry_date
                        ]['bPrice']) > 0) ? 'text-success' : 'text-danger'">
                          {{
                            new Intl.NumberFormat("en-us", {
                              style: "currency",
                              currency: "INR",
                            }).format(
                              (stats.average_price -
                                breeze_ws_data[
                                tickers[stats.stock_code] +
                                stats.strike_price +
                                stats.right +
                                stats.expiry_date
                                ]["bPrice"]) *
                              stats.quantity
                            )
                          }}
                        </div>

                        <div id="makesmall" v-if="stats.action == 'Buy'" class="mb-0 text-sm" :class="((breeze_ws_data[
                          tickers[stats.stock_code] +
                          stats.strike_price +
                          stats.right +
                          stats.expiry_date
                        ]['sPrice'] -
                          stats.average_price) > 0) ? 'text-success' : 'text-danger'">
                          {{
                            new Intl.NumberFormat("en-us", {
                              style: "currency",
                              currency: "INR",
                            }).format(
                              (breeze_ws_data[
                                tickers[stats.stock_code] +
                                stats.strike_price +
                                stats.right +
                                stats.expiry_date
                              ]["sPrice"] -
                                stats.average_price) *
                              stats.quantity
                            )
                          }}
                        </div>
                      </div>

                      <div v-else>
                        <h6 id="makesmall" v-if="stats.action == 'Sell'" class="mb-0 text-sm"
                          :class="((stats.average_price - stats.ltp) > 0) ? 'text-success' : 'text-danger'">
                          {{
                            new Intl.NumberFormat("en-us", {
                              style: "currency",
                              currency: "INR",
                            }).format(
                              (stats.average_price - stats.ltp) * stats.quantity
                            )
                          }}
                        </h6>

                        <h6 id="makesmall" v-if="stats.action == 'Buy'" class="mb-0 text-sm"
                          :class="((stats.ltp - stats.average_price) > 0) ? 'text-success' : 'text-danger'">
                          {{
                            new Intl.NumberFormat("en-us", {
                              style: "currency",
                              currency: "INR",
                            }).format(
                              (stats.ltp - stats.average_price) * stats.quantity
                            )
                          }}
                        </h6>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <!--  -->

            </table>
          </div>
          <!--  -->

          <!-- Order Book table -->
          <div class="table-responsive" style="height: 600px" v-if="Displaystype === 'Order book'">
            <table class="table align-items-center table-sm">
              <!-- Order Book Header -->
              <thead>
                <tr>
                  <td class="pinned-sm">
                    <div class="text-center">
                      <h5 class="mb-0 text-sm">
                        #
                      </h5>
                    </div>
                  </td>
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
                  <td class="pinned-sm">
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
                  <td class="pinned-sm">
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h3 class="mb-0 text-sm">Action</h3>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h3 class="mb-0 text-sm">Status</h3>
                    </div>
                  </td>
                </tr>
              </thead>
              <!--  -->

              <!-- Order Book Body -->
              <tbody>
                <tr v-for="(stats, PL) in order_book" :key="PL">
                  <td class="pinned-sm">
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold text-info">{{ PL + 1 }}</p>
                      <!-- <h6 class="mb-0 text-sm">

                          <button
                            class="p-3 mb-0 btn btn-icon-only btn-rounded me-3 btn-sm d-flex align-items-center justify-content-center btn-outline-info">
                            <i class="text-info">{{ PL +1 }}</i>
                          </button>
                      </h6> -->
                    </div>
                  </td>
                  <td>
                    <div class="px-2 py-1 d-flex align-items-center">
                      <div class="ms-4">
                        <div v-if="stats.exchange_code == 'NFO'">
                          <h6 class="mb-0 text-sm hover-target" id="makesmall">
                            <!-- {{ tickers[stats.stock_code] }} -->
                            {{ order_tickers[stats.stock_code] }} {{ stats.strike_price }}
                          </h6>
                          <p class="text-info" style="margin-bottom: 0px" id="makesmall">
                            {{ stats.expiry_date }} {{ stats.right }} : {{ stats.order_type }}
                          </p>
                        </div>


                        <div v-else>
                          <h6 class="mb-0 text-sm hover-target" id="makesmall">
                            <!-- {{ tickers[stats.stock_code] }} -->
                            {{ order_tickers[stats.stock_code] }}
                          </h6>
                          <p class="text-info" style="margin-bottom: 0px" id="makesmall">
                            {{ stats.stock_code }} : {{ stats.order_type }}
                          </p>
                        </div>


                        <div id="makesmall" v-if="stats.status != 'Executed' && stats.status != 'Cancelled'">
                          <span type="button" class="badge badge-info badge-sm">Modify</span>
                          &nbsp;
                          <span type="button" @click="cancelOrder(stats)"
                            class="badge badge-secondary badge-sm">Cancel</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="pinned-sm">
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h6 v-if="stats.order_type == 'StopLoss'" class="mb-0 text-sm">
                        {{
                          new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(stats.stoploss)
                        }}
                      </h6>
                      <h6 v-else class="mb-0 text-sm">
                        {{
                          new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(stats.average_price)
                        }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>

                      <h6 class="mb-0 text-sm" id="makesmall">
                        {{ stats.quantity }}
                      </h6>
                    </div>
                  </td>
                  <td class="pinned-sm">
                    <div class="text-center">
                      <h6 class="badge-sm">
                        {{ stats.action }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center badge-sm"
                      :class="stats.status == 'Executed' ? 'text-success' : 'text-info'">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      {{ stats.status }}
                    </div>
                  </td>
                </tr>
              </tbody>
              <!--  -->

            </table>
          </div>
          <!--  -->

          <!-- Equity Holdings table -->
          <div class="table-responsive" style="height: 600px" v-if="Displaystype === 'Equity Holdings'">
            <table class="table align-items-center table-sm">
              <!-- Equity Header -->
              <thead>
                <tr>
                  <td class="pinned-sm">
                    <div class="text-center">
                      <h5 class="mb-0 text-sm">
                        #
                      </h5>
                    </div>
                  </td>
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
                  <td class="pinned-sm">
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
                  <td class="pinned-sm">
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h3 class="mb-0 text-sm">LTP</h3>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h3 class="mb-0 text-sm">Profit</h3>
                    </div>
                  </td>
                </tr>
              </thead>
              <!--  -->

              <!-- Equity Body -->
              <tbody>
                <tr v-for="(stats, PL) in equity_positions" :key="PL">
                  <td class="pinned-sm">
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold text-info">{{ PL + 1 }}</p>
                      <!-- <h6 class="mb-0 text-sm">

                          <button
                            class="p-3 mb-0 btn btn-icon-only btn-rounded me-3 btn-sm d-flex align-items-center justify-content-center btn-outline-info">
                            <i class="text-info">{{ PL +1 }}</i>
                          </button>
                      </h6> -->
                    </div>
                  </td>
                  <td>
                    <div class="px-2 py-1 d-flex align-items-center">
                      <div class="ms-4">
                        <h6 class="mb-0 text-sm hover-target" id="makesmall">
                          <!-- {{ tickers[stats.stock_code] }} -->
                          {{ eq_tickers[stats.stock_code] }}
                        </h6>
                        <p style="margin-bottom: 0px" id="makesmall">
                          {{ stats.stock_code }}
                        </p>
                        <div id="makesmall">
                          <!-- <span type="button" @click="sendToOrder(stats, false)"
                            class="badge badge-success badge-sm">Buy</span>
                          &nbsp;
                          <span type="button" @click="sendToOrder(stats, true)"
                            class="badge badge-danger badge-sm">Sell</span>
                          &nbsp;
                          <span type="button" @click="sendToOrder(stats)" class="badge badge-info badge-sm">Exit</span>
                          &nbsp;
                          <span type="button" @click="sendToOrder(stats, undefined, stats.quantity)"
                            class="badge badge-dark badge-sm">Exit all</span> -->
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="pinned-sm">
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h6 class="mb-0 text-sm">
                        {{
                          new Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "INR",
                          }).format(stats.average_price)
                        }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>

                      <h6 class="mb-0 text-sm" id="makesmall">
                        {{ stats.quantity }}
                      </h6>
                    </div>
                  </td>
                  <td class="pinned-sm">
                    <div class="text-center">
                      <h6 class=" badge-sm">
                        {{ new Intl.NumberFormat("en-us", {
                          style: "currency",
                          currency: "INR",
                        }).format(stats.current_market_price) }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center badge-sm"
                      :class="(stats.current_market_price - stats.average_price) > 0 ? 'text-success' : 'text-danger'">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      {{
                        new Intl.NumberFormat("en-us", {
                          style: "currency",
                          currency: "INR",
                        }).format((stats.current_market_price - stats.average_price) * stats.quantity) }}
                    </div>
                  </td>
                </tr>
              </tbody>
              <!--  -->

            </table>
          </div>
          <!--  -->



          <!-- <VsudButton v-on:click.prevent="sendMessage" id="sendMessage" class="button">Send message</VsudButton>
  <input type="text" v-model="message" /> -->
        </div>
      </div>
      <!--  -->

    </div>
  </div>
</template>


<script>
import io from "socket.io-client";
import VsudInput from "@/components/VsudInput.vue";
import VsudSwitch from "@/components/VsudSwitch.vue";
import VsudButton from "@/components/VsudButton.vue";
import { axiosClientIns } from "@/libs/client_axios";
import Cookies from "js-cookie";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import SoftBadge from "@/components/VsudBadge.vue";
import SoftAlert from "@/components/VsudAlert.vue";
import Orderbox from "./Orderbox.vue";
import { inject } from 'vue';
import Strategybuilder from "./strategybuilder.vue";
import { ref } from 'vue';
import { useTickersStore } from "@/libs/tickers/tickers";
import md5 from 'md5';

let debounceTimeout;

// Function to debounce search
function debounce(func, delay) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
}

export default {
  name: "Platform",
  components: {
    VsudInput,
    VsudSwitch,
    VsudButton,
    Breadcrumbs,
    SoftBadge,
    Orderbox,
    SoftAlert,
    Strategybuilder,
  },

  data: () => ({
    uid: Cookies.get("uid", { domain: import.meta.env.VITE_APP_Parent_Domain }),
    vite_username: Cookies.get("vite_username", {
      domain: import.meta.env.VITE_APP_Parent_Domain,
    }),
    trade_user: {},
    quote_infos: {},
    trade_positions: {},
    equity_positions: {},
    analysis_positions: {},
    order_book: {},
    trade_book: {},
    tickers: {},
    eq_tickers: {},
    order_tickers: {},
    socket: null,
    breeze_ws_data: {},
    isws_connected: false,
    searchTerm: "",
    search_results: {},
    watchlist: [[], [], [], [], [], []],
    selected_watchlist: 0,
    rgt: "",
    order_stock: "",
    order_quantity: 1,
    order_action: false,
    order_price: 0,
    is_sendtoorder: false,
    order_option: "",
    order_lotsize: 1,
    order_token: 0,
    order_security: {},
    is_alert: false,
    alert_data: '',
    alert_code: 200,
    allocated_equity: 0,
    allocated_fno: 0,
    allocated_commodity: 0,
    allocated_currency: 0,
    unallocated_balance: 0,
    amountvar: 0,
    Displaystype: 'Open Positions',
    Displaystypes: ['Open Positions', 'Order book', 'Equity Holdings'],
    from_date: "",
    to_date: "",
    hidden_watch: false,
    is_analysis: false,
    cache: {},
  }),
  watch: {
    searchTermLength(newVal) {
      if (newVal > 3) {
        // Trigger search function only when reaching 3 characters for the first time after typing
        

    debounce(() => this.search(), 300); // Adjust debounce delay as needed
      } else {
        debounce(() => this.search_results = {},300);
      }
    },
  },
  setup() {
    const { globalArray } = useTickersStore();
    let { arraypopulated } = useTickersStore();
    const notificationService = inject('notificationService');

    const notify = () => {
      notificationService.playSound();
    }

    const activePL = ref(null);

    const togglePinned = (PL) => {
      if (activePL.value === PL) {
        activePL.value = null;
      } else {
        activePL.value = PL;
      }
    };

    const isActive = (PL) => {
      return activePL.value === PL;
    };

    const sendpositionOrder = (stats, type, quantity) => {
      // Your existing method implementation
    };

    return {
      activePL,
      togglePinned,
      isActive,
      sendpositionOrder,
      notify,
      globalArray,
      arraypopulated
    };

  },
  methods: {
    openPDF() {
      let blob = new Blob();
      axiosClientIns
        .post("/fetch-pdf", {
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        }, {
      responseType: 'blob',  // Ensure response is treated as a Blob
    })
    .then((response) => { 
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      console.log(`Blob size: ${blob.size} bytes`);

      // Create a temporary URL for the Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Open the Blob URL in a new tab
      window.open(blobUrl, '_blank');

      // Optionally revoke the Blob URL after a while (for cleanup)
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    })
  },

    hashArray(array) {
      return md5(JSON.stringify(array));
    },

    // Function to filter the array with caching
    filterWithCache(array, pattern) {
      const patternString = pattern.toString();
      const arrayHash = this.hashArray(array);
      const cacheKey = `${arrayHash}-${patternString}`;

      // Check if result is in cache
      if (this.cache[cacheKey]) {
        console.log('Returning cached result');
        return this.cache[cacheKey];
      }
      // Perform the filtering
      const result = this.filterAndSortByExpiry(array.filter(item => pattern.test(item.fullname)));

      // Store the result in cache
      this.cache[cacheKey] = result;

      return result;
    },


    filterAndSortByExpiry(data) {
      // Get the current date
      const currentDate = new Date();

      // Function to convert date string to Date object
      function parseDate(dateStr) {
        const months = {
          'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
          'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
        const [day, month, year] = dateStr.split('-');
        return new Date(year, months[month], day);
      }
      let sortedData = []
      try {
        if ('expiry_date' in data[0]) {
          // Filter out items with expiry dates less than the current date
          const filteredData = data.filter(item => parseDate(item.expiry_date) >= currentDate);

          // Sort the filtered data by expiry_date in ascending order
          sortedData = filteredData.sort((a, b) => parseDate(a.expiry_date) - parseDate(b.expiry_date));
        }

        else {

          // Filter out items with expiry dates less than the current date
          const filteredData = data.filter(item => parseDate(item.ExpiryDate) >= currentDate);

          // Sort the filtered data by expiry_date in ascending order
          sortedData = filteredData.sort((a, b) => parseDate(a.ExpiryDate) - parseDate(b.ExpiryDate));
        }
      }
      catch {
        
        // Filter out items with expiry dates less than the current date
        const filteredData = data.filter(item => parseDate(item.ExpiryDate) >= currentDate);

        // Sort the filtered data by expiry_date in ascending order
        sortedData = filteredData.sort((a, b) => parseDate(a.ExpiryDate) - parseDate(b.ExpiryDate));

      }

      return sortedData;
    },

    getshortername(name) {
      const words = name.split(' ');
      return words.slice(0, 2).join(' ');
    },

    handleAnalyse(data) {
      this.is_analysis = data['data']
    },

    // Make a positions object and send to strategy builder
    Analyse() {
      this.analysis_positions = {}
      this.trade_positions.forEach(e => {
        if (e.segment === 'fno') {
          const ticker = this.tickers[e.stock_code];
          if (!this.analysis_positions[ticker]) {
            this.analysis_positions[ticker] = {
              stock_code: e.stock_code,
              positions: []
            };
          }

          let quantity1 = parseInt(e.quantity);
          if (e.action === 'Sell') {
            quantity1 *= -1;
          }

          this.analysis_positions[ticker].positions.push({
            strike_price: e.strike_price,
            expiry_date: e.expiry_date,
            option_price: e.ltp,
            quantity: quantity1,
            option_type: e.right,
            average_price: e.average_price,
          });
        }
      });
      this.is_analysis = true

    },
    ///////////////////////////////////

    // Cancel order from Order book
    cancelOrder(order) {
      this.socket.emit("message", {
        a: "cancel_order",
        filter: {
          exchange_code: order['exchange_code'],
          order_id: order['order_id']
        },
        session: Cookies.get("s_token"),
      });
      this.changedisplay(this.Displaystype)

    },
    ///////////////////////

    // Get todays date
    todaysDateInYYYYMMDD() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
      const day = String(today.getDate()).padStart(2, '0'); // Add leading zero for single-digit days

      return `${year}-${month}-${day}`;
    },
    ////////////////////////


    // Change displays
    changedisplay(display) {
      this.Displaystype = display
      if (display == 'Open Positions') {
        this.socket.emit("message", {
          a: "trade_positions",
          session: Cookies.get("s_token"),
        });

      }

      if (display == 'Order book') {

        this.socket.emit("message", {
          a: "order_book",
          filter: {
            'from_date': this.from_date,
            'to_date': this.to_date
          },
          session: Cookies.get("s_token"),
        });

      }

      if (display == 'Equity Holdings') {
        this.socket.emit("message", {
          a: "equity_positions",
          session: Cookies.get("s_token"),
        });
      }
    },
    /////////////////////

    // Test Button function
    loggerbutton() {
      console.log(this.breeze_ws_data)
    },
    ////////////////////

    // Function to change fund allocation
    setfunds(amount, segment, transaction_type) {

      this.socket.emit("message", {
        a: "set_funds",
        session: Cookies.get("s_token"),
        filter: {
          'amount': amount,
          'segment': segment,
          'transaction_type': transaction_type
        }
      });

      this.amountvar = 0
    },
    //////////////////////

    // Remove item from watchlist
    removefromwatchlist(data) {

      this.watchlist[this.selected_watchlist] = this.watchlist[this.selected_watchlist].filter(e => {
        return e._id.$oid !== data._id.$oid;
      })
      axiosClientIns
        .post("/user_settings", {
          filter: { user: Cookies.get("vite_username") },
          fields: { watchlist: this.watchlist },
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        })
        .then((response) => { });
    },
    ////////////////////////////

    // Functions for order box
    handleorderData(data) {
      if (data["type"] == "closebox") {
        this.is_sendtoorder = false;
        this.order_security = {}
        this.order_action = false
      }
      if (data["type"] == "sendorder") {
        data['data']['stock_code'] = this.order_security['ShortName']
        data['data']['stoploss'] = ""

        if (this.order_security['Series'] != "EQ") {
          data['data']['exchange_code'] = this.order_security['ExAllowed']
          data['data']['product'] = this.order_security['Series'].toLowerCase() + "s"
          data['data']['expiry_date'] = this.order_security['ExpiryDate']
          data['data']['strike_price'] = this.order_security['StrikePrice'].toString()
          if (this.order_security['OptionType'] == "CE") {

            data['data']['right'] = 'call'
          }
          if (this.order_security['OptionType'] == "PE") {

            data['data']['right'] = 'put'
          }
        }
        else {
          data['data']['exchange_code'] = "NSE"
          data['data']['product'] = "cash"
        }

        this.socket.emit("message", {
          a: "sendorder",
          session: Cookies.get("s_token"),
          filter: data['data']
        })
        this.socket.emit("message", {
          a: "get_funds",
          session: Cookies.get("s_token"),
        });
        this.is_sendtoorder = false;
      }
    },
    /////////////////////////

    // Send data to Orderbox
    async sendToOrder(suggestedsecurity, action_bool, quantity = 1) {


      this.order_quantity = 1
      this.order_price = 0
      this.order_option = ""
      this.order_lotsize = 1
      // this.order_action = false
      try {

        this.order_price = this.breeze_ws_data[suggestedsecurity.fullname]['last']
      }
      catch {
        this.order_price = 0
      }
      this.order_security = suggestedsecurity

      this.order_quantity = quantity;

      this.is_sendtoorder = false;
      if (suggestedsecurity.fullname) {
        this.order_stock = suggestedsecurity.fullname;
        this.order_token = parseInt(suggestedsecurity.Token);
        if (suggestedsecurity.ExAllowed) {

          this.order_lotsize = suggestedsecurity['LotSize']
          this.order_quantity = quantity * this.order_lotsize
        }
      } else {
        if (suggestedsecurity.exchange_code == "NFO") {
          this.order_stock =
            this.tickers[suggestedsecurity.stock_code] +
            " " +
            suggestedsecurity.strike_price +
            " " +
            suggestedsecurity.right +
            " " +
            suggestedsecurity.expiry_date;

          if (suggestedsecurity.right == "Call") {
            this.order_option = "CE";
          } else if (suggestedsecurity.right == "Put") {
            this.order_option = "PE";
          }
          await axiosClientIns
            .post("/fno_search", {
              filter: {
                StrikePrice: parseInt(suggestedsecurity.strike_price),
                ExchangeCode: this.tickers[suggestedsecurity.stock_code],
                ExpiryDate: suggestedsecurity.expiry_date,
                OptionType: this.order_option,
              },
              fields: {
                LotSize: 1,
                Token: 1,
                OptionType: 1,
                ExAllowed: 1,
                Series: 1,
                ExpiryDate: 1,
                StrikePrice: 1,
                ShortName: 1
              },
              username: this.vite_username,
              uid: this.uid,
            })
            .then((response) => {
              this.order_security = JSON.parse(response.data.real_data)[0]
              this.order_lotsize = this.order_security["LotSize"];
              this.order_token = this.order_security[
                "Token"
              ];

              if (action_bool != undefined) {
                this.order_quantity = this.order_lotsize
              } else if (quantity == 1) {
                this.order_quantity = this.order_lotsize
              } else {
                this.order_quantity = quantity;
              }
            });

        } else {
          this.order_stock = this.tickers[suggestedsecurity.stock_code];
        }
      }

      if (action_bool == undefined) {
        if (suggestedsecurity.action == "Sell") {
          this.order_action = false
        }
        if (suggestedsecurity.action == "Buy") {
          this.order_action = true
        }

      } else {
        this.order_action = action_bool
      }

      this.is_sendtoorder = true;
    },
    //////////////////////////

    // Add item to watchlist
    addToWatchlist(suggestedsecurity) {
      this.searchTerm = "";
      this.search_results = {};
      if (this.watchlist[this.selected_watchlist].some(
        (nestedObject) => nestedObject['fullname'] == suggestedsecurity['fullname'])) {
        console.log("security already added to watchlist")

      } else {
        axiosClientIns.post("/sec_search", {
          'filter': suggestedsecurity,
          'username': Cookies.get('vite_username'),
          'uid': Cookies.get('uid')
        }).then(response => {
          suggestedsecurity = JSON.parse(response.data.real_data);


          this.socket.emit("message", {
            a: "subscribe",
            session: Cookies.get("s_token"),
            filter: {
              stock_token: "4.1!" + suggestedsecurity["Token"].toString(),
            },
          });
          this.watchlist[this.selected_watchlist].push(suggestedsecurity);

          if (suggestedsecurity.ExAllowed == "NFO") {
            let right = ""
            if (suggestedsecurity["right"] == "CE") {
              right = "call"
            } else {
              right = "put"
            }

            this.socket.emit("message", {
              a: "get_quotes_positions&watchlist",
              session: Cookies.get("s_token"),
              filter: {
                stock_code: suggestedsecurity["ShortName"],
                exchange_code: suggestedsecurity.ExAllowed,
                expiry_date: suggestedsecurity["ExpiryDate"],
                strike_price: suggestedsecurity["StrikePrice"],
                right: right,
                full_name: suggestedsecurity['fullname']

              },

            });
          }
          else {
            this.socket.emit("message", {
              a: "get_quotes_positions&watchlist",
              session: Cookies.get("s_token"),
              filter: {
                stock_code: suggestedsecurity["ShortName"],
                exchange_code: "NSE",
                full_name: suggestedsecurity['fullname']

              },

            });

          }


          axiosClientIns
            .post("/user_settings", {
              filter: { user: Cookies.get("vite_username") },
              fields: { watchlist: this.watchlist },
              username: Cookies.get("vite_username"),
              uid: Cookies.get("uid"),
            })
            .then((response) => { });
        })
      }

    },
    ///////////////////////

    // Watchlist item search
    search() {

      const pattern = new RegExp(`.*${this.searchTerm}.*`, 'i'); // 'i' for case-insensitive

      this.search_results = [...this.globalArray[1].filter(item => pattern.test(item.fullname)),
      ...this.filterWithCache(this.globalArray[0],pattern)]


    },
    ///////////////////////

    // Connect websocket if disconnected
    connectws() {
      this.$socket = io(import.meta.env.VITE_APP_WS_API, {
        transports: ['websocket']
      });
    },
    //////////////////////

    // Send Message notification still don't know the use
    sendMessage() {
    },
    /////////////////////

    // Get watchlist for the logged in user
    getuserwatchlist() {
      axiosClientIns
        .post("/get_watchlist", {
          filter: { user: Cookies.get("vite_username") },
          fields: { watchlist: 1 },
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        })
        .then((response) => {

          if (JSON.parse(response.data.real_data)["watchlist"] != undefined) {
            this.watchlist = JSON.parse(response.data.real_data)["watchlist"];

            if (Cookies.get('s_intract') == 'true') {
              Cookies.set('s2_intract', true)

              this.watchlist.forEach((e) => {
                e.forEach((f) => {

                  this.socket.emit("message", {
                    a: "subscribe",
                    session: Cookies.get("s_token"),
                    filter: {
                      stock_token: "4.1!" + f["Token"].toString(),
                    },
                  })

                }
                );
              })
            }
          }
        });
    },
    //////////////////

    // Remove top alert
    removealert() {
      this.is_alert = false
    },
    ////////////////////
  },
  mounted() {
    if (this.$socket) {
      // Access the global socket and attach event listeners
      this.socket = this.$socket;

      this.socket.emit("check_auth", {
        user: this.vite_username,
        session: Cookies.get("s_token"),

      })

      // this.socket.emit("message", {
      //   a: "auth",
      //   user: this.vite_username,
      //   session: Cookies.get("s_token"),
      // });
    } else {
      Cookies.remove('s_token')
      Cookies.remove('s_intract')
      Cookies.remove('s2_intract')
      Cookies.remove('v_intract')
      Cookies.remove('v2_intract')
      console.error('Socket.IO not connected!');
    }


    this.from_date = this.todaysDateInYYYYMMDD()
    this.to_date = this.todaysDateInYYYYMMDD()


    this.socket.on("error", (error) => {
      console.error("WebSocket connection error:", error);
      // Handle errors here (e.g., display an error message)
    });

    this.socket.on("ask_auth", (data) => {
      // if (Object.keys(data).includes("sid")){
      //   this.socket.emit('message', { a: 'reconnect', 'sid': data['sid'] });
      // }
      // else{
      //   this.socket.emit('message', { a: 'auth', user: this.vite_username, session: Cookies.get('s_token') });

      // }
      if (data['connect']) {
        this.socket.emit("message", {
          a: "auth",
          user: this.vite_username,
          session: Cookies.get("s_token"),
        });
        Cookies.set('s_intract', true)
        this.isws_connected = true

      }
      else {
        if (Cookies.get('s2_intract') == 'true') {
          Cookies.set('s_intract', false)

        }
        else {
          Cookies.set('s_intract', true)

        }
        this.changedisplay(this.Displaystype)
        this.isws_connected = true

      }
      console.log("Connected to server!");
    });

    this.socket.on("disconnect", () => {
      this.isws_connected = false;
      // this.socket.emit('message', { a: 'unauth', session: Cookies.get('s_token') })
      this.allocated_commodity = 0
      this.allocated_currency = 0
      this.allocated_equity = 0
      this.allocated_fno = 0
      this.unallocated_balance = 0
      this.trade_positions = {}
      this.order_book = {}
      this.trade_book = {}
      this.equity_positions = {}
      this.trade_user = ""
      console.log("Disconnected from server");

      if (Cookies.get('s_token')) {
        this.socket.emit("check_auth", {
          user: this.vite_username,
          session: Cookies.get("s_token"),

        })

      }
    });

    this.socket.on("message", (data) => {
      if (data["type"] == "ws_connected") {
        this.isws_connected = data["message"];
      }
      if (data["type"] == "trade_userdata") {
        this.getuserwatchlist();
        this.trade_user = data;
        this.changedisplay(this.Displaystype)
        this.socket.emit("message", {
          a: "get_funds",
          session: Cookies.get("s_token"),
        });
      }
      if (data["type"] == "trade_positions") {

        let filteredData = [];
        let stockData = [];

        // Iterate over each key in the original data object
        for (const key in data["Success"]) {
          // Check if the entry has the 'expiry_date' key
          if (data["Success"][key]['segment']=="fno" ) {
            // Add the entry to the filteredData object
            filteredData.push(data["Success"][key]);
          }
          else {
            stockData.push(data["Success"][key]);
          }
        }
        
        filteredData = this.filterAndSortByExpiry(filteredData)

        this.trade_positions = [...filteredData, ...stockData]
        this.tickers = data["ticker_convert"];

        if (Cookies.get('s_intract') == 'true') {

          this.socket.emit("message", {
            a: "subscribe",
            session: Cookies.get("s_token"),
            filter: {
              stock_token: "4.1!NIFTY BANK",
            },
          });

          this.socket.emit("message", {
            a: "subscribe",
            session: Cookies.get("s_token"),
            filter: {
              stock_token: "4.1!NIFTY 50",
            },
          });

          for (const position in this.trade_positions) {
            this.socket.emit("message", {
              a: "subscribe",
              session: Cookies.get("s_token"),
              filter: {
                exchange_code: this.trade_positions[position]["exchange_code"],
                stock_code: this.trade_positions[position]["stock_code"],
                product_type: this.trade_positions[position]["product_type"],
                expiry_date: this.trade_positions[position]["expiry_date"],
                strike_price: this.trade_positions[position]["strike_price"],
                right: this.trade_positions[position]["right"],
              },
            });
          }
        }
      }
      if (data["type"] == "funds") {
        this.allocated_equity = data['Success']['allocated_equity']
        this.allocated_fno = data['Success']['allocated_fno']
        this.allocated_commodity = data['Success']['allocated_commodity']
        this.allocated_currency = data['Success']['allocated_currency']
        this.unallocated_balance = data['Success']['unallocated_balance']
      }

      if (data["type"] == "Connection_Error") {
        if (data["error"] == "Unexpected error: Session key is expired.") {
          Cookies.remove("s_token");
          Cookies.remove('s_intract')
          Cookies.remove('s2_intract')
          Cookies.remove('v_intract')
          Cookies.remove('v2_intract')

        }
        window.location.reload();
      }
    });

    this.socket.on("tick_update", (data) => {
      if (data["product_type"] == "Options") {
        this.breeze_ws_data[
          data["stock_name"] +
          data["strike_price"] +
          data["right"] +
          data["expiry_date"]
        ] = data;
        if (data["right"] == "Put") {
          this.breeze_ws_data[
            data["stock_name"] + " " +
            data["strike_price"] + " " +
            "PE " +
            data["expiry_date"]
          ] = data;

        }
        if (data["right"] == "Call") {
          this.breeze_ws_data[
            data["stock_name"] + " " +
            data["strike_price"] + " " +
            "CE " +
            data["expiry_date"]
          ] = data;

        }
      } else if (data["exchange"] == "NSE Equity") {
        this.breeze_ws_data[data["stock_name"]] = data;
      } else if (data.hasOwnProperty("sourceNumber")) { // For order updates
        try {
          if (data["orderStatus"] == "Cancelled") {
            this.alert_data = "Your order of " + data['stockCode'] + " " + data['strikePrice'] + " " + data['optionType'] + " " + data["expiryDate"] +
              " of quantity " + data["cancelledQuantity"] + " is " + data["orderStatus"]

          }
          else if (data['orderStatus'] == "Requested") {
            this.alert_data = "Your order of " + data['stockCode'] + " " + data['strikePrice'] + " " + data['optionType'] + " " + data["expiryDate"] +
              " of quantity " + data["orderTotalQuantity"] + " is " + data["orderStatus"]

          }
          else {

            this.alert_data = "Your order of " + data['stockCode'] + " " + data['strikePrice'] + " " + data['optionType'] + " " + data["expiryDate"] +
              " of quantity " + data["executedQuantity"] + " is " + data["orderStatus"]
          }
          this.notify()
        }
        catch {
          this.alert_data = "Your order of " + data['stockCode'] + " of quantity " + data["orderQuantity"] + " is " + data["orderStatus"]
        }
        if (data["orderQuantity"] != '0' && data["orderQuantity"] != 0) {
          this.socket.emit("message", {
            a: "trade_positions",
            session: Cookies.get("s_token"),
          });
          this.is_alert = true

        }

        setTimeout(this.removealert, 3000)

      }
    });


    this.socket.on("order_response", (data) => {
      this.alert_code = data['Status']
      this.is_alert = true
      if (data['Status'] == 500) {
        this.alert_data = data['Error']
      }
      if (data['Status'] == 200) {
        this.alert_data = data['Success']['status']
      }
      setTimeout(this.removealert, 3000)
    });


    this.socket.on("set_funds", (data) => {
      this.alert_code = data['Status']
      this.is_alert = true
      if (data['Status'] == 500) {
        this.alert_data = data['Error']
      }
      if (data['Status'] == 200) {
        this.alert_data = data['Success']['status']
        this.socket.emit("message", {
          a: "get_funds",
          session: Cookies.get("s_token"),
        });
      }
      setTimeout(this.removealert, 3000)

    });

    this.socket.on("equity_positions", (data) => {
      this.equity_positions = data["Success"];
      this.eq_tickers = data["ticker_convert"];
    })

    this.socket.on("order_book", (data) => {
      this.order_book = data['Success']
      this.order_tickers = data["ticker_convert"]
    })

    this.socket.on("trade_book", (data) => {
      this.trade_book = data['Success']
    })

    this.socket.on("cancel_order", (data) => {

      if (data['Success']) {

        this.changedisplay(this.Displaystype)
      }
      else {
        this.alert_code = data['Status']

        this.is_alert = true
        this.alert_data = data['Error']
        setTimeout(this.removealert, 3000)

      }

    })

    // this.socket.on("get_quotes", (data) => {
    //   console.log(data)
    // })

  },

  computed: {
    totalpl() {
      let acc = 0;
      if (this.trade_positions.length > 0) {

        acc = this.trade_positions.reduce(
          (accumulator, currentValue) => {

            const tickerKey = this.tickers[currentValue.stock_code] +
              currentValue.strike_price +
              currentValue.right +
              currentValue.expiry_date;
            if (this.breeze_ws_data[tickerKey
            ]) {

              if (currentValue.action == 'Buy') {
                return accumulator + ((this.breeze_ws_data[tickerKey]["sPrice"] - currentValue.average_price) *
                  currentValue.quantity)

              }
              else {

                return accumulator + ((currentValue.average_price - this.breeze_ws_data[tickerKey]["bPrice"]) *
                  currentValue.quantity)

              }

            }
            else {
              if (currentValue.action == 'Buy') {
                return accumulator + (currentValue.ltp - currentValue.average_price) * currentValue.quantity
              }
              else {
                return accumulator + (currentValue.average_price - currentValue.ltp) * currentValue.quantity

              }

            }
          }, 0
        );
        return acc;
      } else {
        return 0
      }

    },
    orderbook_pnl() {
      let acc = 0;
      if (this.trade_book) {
        if (this.trade_book.length > 0) {

          acc = this.trade_book.reduce(
            (accumulator, currentValue) => {
              if (currentValue.expiry_date) {
                if (currentValue.action == "Sell") {
                  return accumulator + parseFloat(currentValue.average_cost * parseInt(currentValue.quantity));
                }
                else {
                  return accumulator - parseFloat(currentValue.average_cost * parseInt(currentValue.quantity));

                }
              }
              else {
                if (currentValue.action == "Sell") {
                  return accumulator + parseFloat(currentValue.average_cost);
                }
                else {
                  return accumulator - parseFloat(currentValue.average_cost);

                }
              }

            }, 0
          );
          return acc;
        } else {
          return 0
        }
      }
      else {
        return 0
      }
    },
    searchTermLength() {
      return this.searchTerm.length;
    },
    navClasses() {
      return {
        "position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky":
          this.$store.state.isNavFixed,
        "position-absolute px-4 mx-0 w-100 z-index-2":
          this.$store.state.isAbsolute,
        "px-0 mx-4 mt-4": !this.$store.state.isAbsolute,
      };
    },
  },

  beforeUnmount() {
    this.socket.removeAllListeners();
    // Cookies.set('s_intract', true)
  },
};
</script>