<template>
  <div>
    <!-- Notification Alert  -->
    <soft-alert v-if="is_alert" :color="alert_code == 200 ? 'success' : 'danger'"
      :icon="alert_code == 200 ? 'ni ni-like-2 ni-lg' : 'ni ni-fat-remove ni-lg'">
      {{ alert_data }}
    </soft-alert>
    <!--  -->

    <!-- Order Box -->
    <orderbox v-if="is_sendtoorder" :Limit_counter="limit_counter" :Price="order_price" :Quantity="order_quantity"
      :Security="order_stock" :toggleActionMode="order_action" :LotSize="order_lotsize" :Token="order_token"
      v-on:child-data="handleorderData" />
    <!--  -->


    <Strategybuilder v-if="is_analysis" :localPositions="analysis_positions" v-on:child-data="handleAnalyse">
    </Strategybuilder>

    <div class="row">



      <!-- Name top bar -->
      <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card flex">
          <soft-badge variant="gradient" color="info">
            <li class="unpinned-sm" style="display: none;"><span class="badge badge-info badge-xl">Virtual Trading
                Platform</span>
              &nbsp;&nbsp;&nbsp;</li>
            <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" data-scroll="true"
              :class="[navClasses]" style="height: 40px">
              <div class="px-3 py-1 container-fluid">
                <ul class="hide navbar-nav justify-content-end">
                  <li>
                    <div class="sidenav-toggler sidenav-toggler-inner d-xl-block d-none"></div>
                  </li>
                </ul>

                <div id="navbar" class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
                  :class="$store.state.isRTL ? 'px-0' : 'me-sm-4'">
                  <div class="pe-md-3 d-flex align-items-center"
                    :class="$store.state.isRTL ? 'me-md-auto' : 'ms-md-auto'"></div>

                  <ul class="hide navbar-nav justify-content-end">
                    <li class="pinned-sm"><span class="badge badge-info badge-xl">Virtual Trading Platform</span>
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
                        <!-- <button v-if="breeze_ws_data[item.fullname]"
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
                        class="text-sm d-flex align-items-center text-gradient font-weight-bold ms-auto flex-column">
                        <div v-if="breeze_ws_data[item.fullname]['last']"
                          class="text-sm d-flex text-gradient font-weight-bold ms-auto flex-column"
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

                        <div v-else class="text-sm d-flex text-gradient font-weight-bold ms-auto flex-column"
                          style="padding-top: 5px" v-bind:class="breeze_ws_data[item.fullname]['ltp'] >
                            breeze_ws_data[item.fullname]['open']
                            ? 'text-success'
                            : 'text-danger'
                            ">
                          {{
                            new Intl.NumberFormat("en-us", {
                              style: "currency",
                              currency: "INR",
                            }).format(breeze_ws_data[item.fullname]["ltp"])
                          }}
                          <span class="text-xs">{{ breeze_ws_data[item.fullname]["ltp_percent_change"].toFixed(2) }}
                            %</span>
                        </div>
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
                                  <div v-if="breeze_ws_data[item.fullname]">
                                    <div v-if="breeze_ws_data[item.fullname]['last']"
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

                                    <div v-else
                                      class="text-sm d-flex align-items-center text-gradient font-weight-bold ms-auto flex-column"
                                      style="padding-top: 5px" v-bind:class="breeze_ws_data[item.fullname]['ltp'] >
                                        breeze_ws_data[item.fullname]['open']
                                        ? 'text-success'
                                        : 'text-danger'
                                        ">
                                      {{
                                        new Intl.NumberFormat("en-us", {
                                          style: "currency",
                                          currency: "INR",
                                        }).format(breeze_ws_data[item.fullname]["ltp"])
                                      }}
                                      <span class="text-xs">{{
                                        breeze_ws_data[item.fullname]["ltp_percent_change"].toFixed(2) }} %</span>
                                    </div>

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
                      <li v-for="display in Displaystypes" class="px-3 nav-item d-flex align-items-center"
                        @click.prevent="changedisplay(display)">{{ display }}</li>
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
                    <div class="col-lg-2 text-sm" style="text-align: left;">
                      from </div>
                    <div class="col-lg-3"><input v-model="from_date" id="from_date" type="date" class="form-control"
                        placeholder="Date">
                    </div>
                    <div class="col-lg-1 text-sm">
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
                  <span id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info badge-lg" style="margin: 5px;">Equity:{{ new
                      Intl.NumberFormat("en-us", {
                        style: "currency",
                        currency: "INR",
                      }).format(allocated_equity) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3  align-items-center"
                    aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_equity', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_equity', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul>
                  <span id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info badge-lg" style="margin: 5px;">FNO:{{ new
                      Intl.NumberFormat("en-us", {
                        style: "currency",
                        currency: "INR",
                      }).format(allocated_fno) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3" aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_fno', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_fno', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul>
                  <!-- <span id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info ">Commodity:{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(allocated_commodity) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3" aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_commodity', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_commodity', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul>
                  &nbsp;
                  <span id="navbarDropdownMenuLink2" type="button" data-bs-toggle="dropdown"
                    class="dropdown-toggle badge badge-info ">Currency:{{ new Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(allocated_currency) }}</span>
                  <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3" aria-labelledby="navbarDropdownMenuLink2">
                    <li><input type="number" v-model="amountvar" class="form-control" placeholder="Amount" /></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_currency', 'credit')"
                        class="badge badge-success badge-sm">Add</span></li>
                    <li><span type="button" @click="setfunds(amountvar, 'allocated_currency', 'debit')"
                        class="badge badge-danger badge-sm">Remove</span></li>
                  </ul> -->

                  <span class="badge badge-info badge-lg" style="margin: 5px;">Unallocated:{{ new
                    Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(unallocated_balance) }}</span>

                  <span class="badge badge-info badge-lg" style="margin: 5px;">Span Blocked:{{ new
                    Intl.NumberFormat("en-us", {
                      style: "currency",
                      currency: "INR",
                    }).format(fno_span) }}</span>


                  <span v-if="Displaystype == 'Open Positions'" type="button" class="badge badge-danger badge-lg"
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
                <tr :class="parseInt(stats.quantity) > 0 ? 'bg-success-soft-4' : 'bg-danger-soft-4'">
                  <td @click="togglePinned(PL)">
                    <div class="px-2 py-1 d-flex align-items-center">
                      <div class="ms-4">
                        <h6 class="mb-0 text-sm hover-target" id="makesmall">
                          {{ stats.full_name }}
                        </h6>
                        <div id="makesmall" :class="{ 'pinned-sm': !isActive(PL) }">
                          <span type="button" @click="sendpositionOrder(stats, false)"
                            class="badge badge-success badge-xl">Buy</span>
                          &nbsp;
                          <span type="button" @click="sendpositionOrder(stats, true)"
                            class="badge badge-danger badge-xl">Sell</span>
                          &nbsp;
                          <span type="button" @click="sendpositionOrder(stats, undefined, Math.sign(stats.quantity))"
                            class="badge badge-info badge-xl">Exit</span>
                          &nbsp;
                          <span type="button" @click="sendpositionOrder(stats, undefined, stats.quantity)"
                            class="badge badge-dark badge-xl">Exit all</span>
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
                          }).format(stats.total_cost / stats.quantity)
                        }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center" :class="stats.action == 'Buy' ? 'text-success' : 'text-danger'">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <h6 class="mb-0 text-sm" id="makesmall">
                        {{ stats.quantity }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <div v-if="breeze_ws_data[
                        stats.full_name
                      ]">
                        <h6 class="mb-0 text-sm" v-if="
                          breeze_ws_data[
                          stats.full_name
                          ]['sPrice']
                        ">
                          {{
                            new Intl.NumberFormat("en-us", {
                              style: "currency",
                              currency: "INR",
                            }).format(
                              breeze_ws_data[
                              stats.full_name
                              ]["bPrice"]
                            )
                          }}
                        </h6>
                        <h6 class="mb-0 text-sm" v-else-if="
                          breeze_ws_data[
                          stats.full_name
                          ]['ltp']">
                          {{
                            new Intl.NumberFormat("en-us", {
                              style: "currency",
                              currency: "INR",
                            }).format(breeze_ws_data[
                              stats.full_name
                            ]['ltp']) }}
                        </h6>
                      </div>
                      <h6 v-else>
                        -
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      <div v-if="
                        breeze_ws_data[
                        stats.full_name
                        ]">
                        <div v-if="
                          breeze_ws_data[
                          stats.full_name
                          ]['sPrice']
                        ">
                          <div id="makesmall" v-if="parseInt(stats.quantity) < 0" class="mb-0 text-sm" :class="((stats.total_cost / stats.quantity) - (breeze_ws_data[
                            stats.full_name
                          ]['bPrice']) > 0) ? 'text-success' : 'text-danger'">
                            {{
                              new Intl.NumberFormat("en-us", {
                                style: "currency",
                                currency: "INR",
                              }).format(
                                ((stats.total_cost / stats.quantity) -
                                  breeze_ws_data[stats.full_name
                                  ]["bPrice"]) *
                                parseInt(stats.quantity) * -1
                              )
                            }}
                          </div>

                          <div id="makesmall" v-if="parseInt(stats.quantity) > 0" class="mb-0 text-sm" :class="((breeze_ws_data[
                            stats.full_name
                          ]['sPrice'] -
                            (stats.total_cost / stats.quantity)) > 0) ? 'text-success' : 'text-danger'">
                            {{
                              new Intl.NumberFormat("en-us", {
                                style: "currency",
                                currency: "INR",
                              }).format(
                                (breeze_ws_data[
                                  stats.full_name
                                ]["sPrice"] -
                                  (stats.total_cost / stats.quantity)) *
                                parseInt(stats.quantity)
                              )
                            }}
                          </div>
                        </div>
                        <div v-else-if="breeze_ws_data[
                          stats.full_name
                        ]['ltp']">

                          <div id="makesmall" v-if="parseInt(stats.quantity) < 0" class="mb-0 text-sm" :class="((stats.total_cost / stats.quantity) - (breeze_ws_data[
                            stats.full_name
                          ]['ltp']) > 0) ? 'text-success' : 'text-danger'">
                            {{
                              new Intl.NumberFormat("en-us", {
                                style: "currency",
                                currency: "INR",
                              }).format(
                                ((stats.total_cost / stats.quantity) -
                                  breeze_ws_data[stats.full_name
                                  ]["ltp"]) *
                                parseInt(stats.quantity) * -1
                              )
                            }}
                          </div>

                          <div id="makesmall" v-if="parseInt(stats.quantity) > 0" class="mb-0 text-sm" :class="((breeze_ws_data[
                            stats.full_name
                          ]['ltp'] -
                            (stats.total_cost / stats.quantity)) > 0) ? 'text-success' : 'text-danger'">
                            {{
                              new Intl.NumberFormat("en-us", {
                                style: "currency",
                                currency: "INR",
                              }).format(
                                (breeze_ws_data[
                                  stats.full_name
                                ]["ltp"] -
                                  (stats.total_cost / stats.quantity)) *
                                parseInt(stats.quantity)
                              )
                            }}
                          </div>
                        </div>

                      </div>
                      <div v-else>


                        <h6 id="makesmall" class="">
                          -
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
                        <div>
                          <h6 class="mb-0 text-sm hover-target" id="makesmall">
                            <!-- {{ tickers[stats.stock_code] }} -->
                            {{ stats.name }}
                          </h6>
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
                          }).format(stats.price)
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
                      <h6 class="badge-sm" :class="stats.trade_type == 'sell' ? 'text-danger' : 'text-success'">
                        {{ stats.trade_type }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center text-success badge-sm">
                      <p class="mb-0 text-xs font-weight-bold"></p>
                      Executed
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
                      <h6>
                        {{ stats.current_market_price }}
                      </h6>
                    </div>
                  </td>
                  <td>
                    <div class="text-center"
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
import Orderbox from "@/views/Tradebreeze/Orderbox.vue";
import { ref } from 'vue';
import Strategybuilder from "../Tradebreeze/strategybuilder.vue";
import { useTickersStore } from "@/libs/tickers/tickers"
let debounceTimeout;

// Function to debounce search
function debounce(func, delay) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, delay);
}

export default {
  name: "VPlatform",
  components: {
    VsudInput,
    VsudSwitch,
    VsudButton,
    Breadcrumbs,
    SoftBadge,
    Orderbox,
    SoftAlert,
    Strategybuilder
  },

  data: () => ({
    uid: Cookies.get("uid", { domain: import.meta.env.VITE_APP_Parent_Domain }),
    vite_username: Cookies.get("vite_username", {
      domain: import.meta.env.VITE_APP_Parent_Domain,
    }),
    trade_user: {},
    limit_counter: false,
    trade_positions: {},
    trade_positions_searchresults: {},
    equity_positions: {},
    order_book: {},
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
    fno_span: 0,
    amountvar: 0,
    required_margin: 0,
    Displaystype: 'Open Positions',
    Displaystypes: ['Open Positions', 'Order book', 'Equity Holdings'],
    from_date: "",
    to_date: "",
    negative_impact: false,
    hidden_watch: false,
    is_analysis: false,
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
    let {arraypopulated} = useTickersStore();
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
      globalArray,
      arraypopulated
    };

  },
  methods: {


    filterAndSortByExpiry(data) {
      try {
        if (data.length === 0) {
          return data
        } else {
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
            if ('ExpiryDate' in data[0]) {
              // Filter out items with expiry dates less than the current date
              const filteredData = data.filter(item => parseDate(item.ExpiryDate) >= currentDate);

              // Sort the filtered data by expiry_date in ascending order
              sortedData = filteredData.sort((a, b) => parseDate(a.ExpiryDate) - parseDate(b.ExpiryDate));

            }

            return sortedData;
          }
          catch {
            // Convert object properties to array of [key, value] pairs
            const dataArray = Object.entries(data);

            // Filter out items with expiry dates less than the current date
            const filteredData = dataArray.filter(([key, item]) => parseDate(item.expiry_date) >= currentDate);

            // Sort the filtered data by ExpiryDate in ascending order
            const sortedData = filteredData.sort(([, a], [, b]) => parseDate(a.expiry_date) - parseDate(b.expiry_date));

            // Convert sortedData back to an object
            const sortedObject = Object.fromEntries(sortedData);

            return sortedObject
          }

        }
      } catch {
        return data
      }
    },

    handleAnalyse(data) {
      this.is_analysis = data['data']
    },

    // Make a positions object and send to strategy builder
    Analyse() {
      this.analysis_positions = {}
      for (const key in this.trade_positions) {
        const e = this.trade_positions[key]

        const ticker = e.stock_code;
        if (!this.analysis_positions[ticker]) {
          this.analysis_positions[ticker] = {
            stock_code: e.stock_code,
            positions: []
          };
        }

        let quantity1 = parseInt(e.quantity);

        this.analysis_positions[ticker].positions.push({
          strike_price: e.strike_price,
          expiry_date: e.expiry_date,
          option_price: this.breeze_ws_data[e.full_name]["ltp"],
          quantity: quantity1,
          option_type: e.right,
          average_price: e.total_cost / quantity1,
        });

      }


      this.is_analysis = true
      console.log(this.is_analysis)

    },
    ///////////////////////////

    // Get open positions for fno
    getvirtualfnopositions() {

      axiosClientIns
        .post("/vpositions/options", {
          filter: { user: Cookies.get("vite_username") },
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        })
        .then((response) => {

          if (response.data.status) {

            this.trade_positions = this.filterAndSortByExpiry(JSON.parse(response.data.real_data)['stocks'])


            for (const position in this.trade_positions) {
              let right = ""
              if (this.trade_positions[position]["right"] == "CE") {
                right = "call"
              } else {
                right = "put"
              }
              this.socket.emit("message", {
                a: "get_quotes_positions&watchlist",
                session: Cookies.get("s_token"),
                filter: {
                  stock_code: this.trade_positions[position]["stock_code"],
                  exchange_code: "NFO",
                  expiry_date: this.trade_positions[position]["expiry_date"],
                  strike_price: parseInt(this.trade_positions[position]["strike_price"]),
                  right: right,
                  full_name: this.trade_positions[position]['full_name']

                },

              });


              if (Cookies.get('v_intract') == 'true') {

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


                this.socket.emit("message", {
                  a: "subscribe",
                  session: Cookies.get("s_token"),
                  filter: {
                    stock_code: "4.1!" + this.trade_positions[position]["symbol"].toString()
                  },
                });
              }
            }

            this.negative_impact = false
            for (let trade in this.trade_positions) {
              let e = this.trade_positions[trade]
              if (e.quantity < 0) {
                this.negative_impact = true
              }
              if (!(e.full_name in this.trade_positions_searchresults)) {
                axiosClientIns
                  .post("/fno_search", {
                    filter: {
                      StrikePrice: parseInt(e.strike_price),
                      ShortName: e.stock_code,
                      ExpiryDate: e.expiry_date,
                      OptionType: e.right,
                    },
                    fields: {
                      LotSize: 1,
                      Token: 1,
                      OptionType: 1,
                      ExAllowed: 1,
                      Series: 1,
                      ExpiryDate: 1,
                      StrikePrice: 1,
                      ShortName: 1,
                      fullname: 1
                    },
                    username: this.vite_username,
                    uid: this.uid,
                  })
                  .then((response) => {
                    this.trade_positions_searchresults[e.full_name] = JSON.parse(response.data.real_data)[0]
                  });
              }

            }
          }
          else {
            console.log(response)
          }
        });
    },
    /////////////////////////

    // Function to get virtual funds
    getvirtualfunds() {
      axiosClientIns
        .post("/get_virtualfunds", {
          filter: { user: Cookies.get("vite_username") },
          fields: {
            allocated_equity: 1,
            allocated_fno: 1,
            allocated_commodity: 1,
            allocated_currency: 1,
            unallocated_balance: 1,
            fno_span: 1,
          },
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        })
        .then((response) => {
          const data = JSON.parse(response.data.real_data)
          this.allocated_equity = data['allocated_equity']
          this.allocated_fno = data['allocated_fno']
          this.allocated_commodity = data['allocated_commodity']
          this.allocated_currency = data['allocated_currency']
          this.unallocated_balance = data['unallocated_balance']
          this.fno_span = data['fno_span']
        });

    },
    //////////////////////////////

    // Cancel order from Order book
    cancelOrder(order) {
      console.log(order.exchange_code)

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
        this.getvirtualfnopositions()

      }

      if (display == 'Order book') {

        axiosClientIns
          .post("/orders/search", {
            filter: { user: Cookies.get("vite_username") },
            fields: {
              from_time: this.from_date,
              to_time: this.to_date
            },
            username: Cookies.get("vite_username"),
            uid: Cookies.get("uid"),
          })
          .then((response) => {
            if (response.data.status) {

              this.order_book = JSON.parse(response.data.real_data)

            }
            else {
              console.log(response)
            }
          });

      }

      if (display == 'Equity Holdings') {
      }
    },
    /////////////////////

    // Test Button function
    loggerbutton() {
      console.log(this.breeze_ws_data)
    },
    ////////////////////

    // Function to change virtual fund allocation
    setfunds(amount, segment, transaction_type) {
      axiosClientIns
        .post("/set_virtualfunds", {
          filter: { user: Cookies.get("vite_username") },
          updates: {
            'amount': amount,
            'segment': segment,
            'transaction_type': transaction_type
          },
          fields: {
            allocated_equity: 1,
            allocated_fno: 1,
            allocated_commodity: 1,
            allocated_currency: 1,
            unallocated_balance: 1
          },
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        })
        .then((response) => {
          if (response.data.status) {
            const data = JSON.parse(response.data.real_data)
            this.allocated_equity = data['allocated_equity']
            this.allocated_fno = data['allocated_fno']
            this.allocated_commodity = data['allocated_commodity']
            this.allocated_currency = data['allocated_currency']
            this.unallocated_balance = data['unallocated_balance']

          }
          else {
            this.alert_code = 400
            this.is_alert = true
            this.alert_data = response.data.error_message
            setTimeout(this.removealert, 3000)

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
          fields: { virtualwatchlist: this.watchlist },
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
        data['data']['symbol'] = this.order_security['Token']
        data['data']['series'] = this.order_security['Series']

        if (this.breeze_ws_data[this.order_security.fullname]) {
          if (this.breeze_ws_data[this.order_security.fullname]['last']) {
            data['data']['price'] = this.breeze_ws_data[this.order_security.fullname]['last']

          }
          else {
            data['data']['price'] = this.breeze_ws_data[this.order_security.fullname]['ltp']

          }
        }
        else {
          this.alert_code = 400
          this.is_alert = true
          this.alert_data = "Unable to fetch the Price"

          setTimeout(this.removealert, 3000)

          return

        }


        data['data']['name'] = this.order_security.fullname
        if (this.order_security['Series'] != "EQ") {
          data['data']['expiry_date'] = this.order_security['ExpiryDate']
          data['data']['strike_price'] = this.order_security['StrikePrice'].toString()

          data['data']['right'] = this.order_security['OptionType']

          this.order_security = data["data"]
          if (this.negative_impact || (this.order_security['action'] == "sell")) {
            this.socket.emit("message", {
              a: "margin_calculator",
              session: Cookies.get("s_token"),
              filter: {
                positions: this.trade_positions,
                new_position: data["data"]
              }
            })
          }
          else {
            if ((this.allocated_fno - (parseFloat(this.order_security["quantity"]) * this.order_security["price"])) >= 0) {
              this.sendOptionOrder(this.order_security, {
                allocated_fno: this.allocated_fno - (parseFloat(this.order_security["quantity"]) * this.order_security["price"]),
                fno_span: this.fno_span

              })

            }
            else {
              this.alert_data = "Available margin is ₹" + (this.allocated_fno + this.fno_span) + " but the required margin is ₹" + (parseInt(this.order_security["quantity"]) * this.order_security["price"])
              this.alert_code = 201
              this.is_alert = true
              setTimeout(this.removealert, 3000)

            }
          }
        }
        else {
          axiosClientIns
            .post("/vtrade/equity", {
              filter: { user: Cookies.get("vite_username") },
              fields: data['data'],
              funds: {
                allocated_equity: this.allocated_equity,
              },
              username: Cookies.get("vite_username"),
              uid: Cookies.get("uid"),
            })
            .then((response) => { this.getvirtualfnopositions() });

        }

        this.is_sendtoorder = false;
      }
    },
    /////////////////////////

    // Send Option order 
    sendOptionOrder(data, funds) {
      axiosClientIns
        .post("/vtrade/options", {
          filter: { user: Cookies.get("vite_username") },
          fields: data,
          funds: funds,
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        })
        .then((response) => {
          this.allocated_fno = parseFloat(funds['allocated_fno'])
          this.fno_span = parseFloat(funds['fno_span'])
          this.getvirtualfnopositions()

        });

    },

    ////////////////////////////

    // Send data to Orderbox from V Open Positios
    async sendpositionOrder(suggestedsecurity, action_bool, quantity = 1) {


      this.order_quantity = 1
      this.order_price = 0
      this.order_option = ""
      this.order_stock = suggestedsecurity.full_name;
      // this.order_lotsize = 1
      // this.order_action = false
      try {

        this.order_price = this.breeze_ws_data[suggestedsecurity.fullname]['last']
      }
      catch {
        this.order_price = 0
      }
      // this.order_security = suggestedsecurity

      this.order_quantity = quantity;

      this.is_sendtoorder = false;

      this.order_security = this.trade_positions_searchresults[suggestedsecurity.full_name]
      this.order_lotsize = this.order_security["LotSize"];
      this.order_token = this.order_security[
        "Token"
      ];
      this.order_option = this.order_security["OptionType"]

      if (action_bool != undefined) {
        this.order_quantity = this.order_lotsize
      } else if (Math.abs(quantity) == 1) {
        this.order_quantity = this.order_lotsize
      } else {
        this.order_quantity = quantity;
      }

      this.order_quantity = Math.abs(this.order_quantity)

      if (action_bool == undefined) {
        if (quantity < 1) {
          this.order_action = false
        }
        if (quantity > 0) {
          this.order_action = true
        }

      } else {
        this.order_action = action_bool
      }

      this.is_sendtoorder = true;
    },
    //////////////////////////


    // Send data to Orderbox from Watchlist
    async sendToOrder(suggestedsecurity, action_bool, quantity = 1) {


      this.order_quantity = 1
      this.order_price = 0
      this.order_option = ""
      this.order_lotsize = 1
      // this.order_lotsize = 1
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
        this.order_token = suggestedsecurity.Token;
        if (suggestedsecurity.ExAllowed) {

          this.order_lotsize = suggestedsecurity['LotSize']
          this.order_quantity = quantity * this.order_lotsize
        }
      } else {

        if (suggestedsecurity.right == "Call") {
          this.order_option = "CE";
        } else if (suggestedsecurity.right == "Put") {
          this.order_option = "PE";
        }


        if (action_bool != undefined) {
          this.order_quantity = this.order_lotsize
        } else if (Math.abs(quantity) == 1) {
          this.order_quantity = this.order_lotsize
        } else {
          this.order_quantity = quantity;
        }
      }


      this.order_action = action_bool


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
              fields: { virtualwatchlist: this.watchlist },
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
      ...this.filterAndSortByExpiry(this.globalArray[0].filter(item => pattern.test(item.fullname)))]
    },
    ///////////////////////

    // Connect websocket if disconnected
    connectws() {
      this.socket = io(import.meta.env.VITE_APP_WS_API, {
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
          fields: { virtualwatchlist: 1 },
          username: Cookies.get("vite_username"),
          uid: Cookies.get("uid"),
        })
        .then((response) => {

          if (JSON.parse(response.data.real_data)["virtualwatchlist"] != undefined) {
            this.watchlist = JSON.parse(response.data.real_data)["virtualwatchlist"];

            if (Cookies.get('v_intract') == 'true') {
              Cookies.set('v2_intract', true)
              this.watchlist.forEach((e) => {
                e.forEach((f) => {
                  if (f.ExAllowed == "NFO") {
                    let right = ""
                    if (e["right"] == "CE") {
                      right = "call"
                    } else {
                      right = "put"
                    }

                    this.socket.emit("message", {
                      a: "get_quotes_positions&watchlist",
                      session: Cookies.get("s_token"),
                      filter: {
                        stock_code: f["ShortName"],
                        exchange_code: f.ExAllowed,
                        expiry_date: f["ExpiryDate"],
                        strike_price: f["StrikePrice"],
                        right: right,
                        full_name: f['fullname']

                      },

                    });
                  }
                  else {
                    this.socket.emit("message", {
                      a: "get_quotes_positions&watchlist",
                      session: Cookies.get("s_token"),
                      filter: {
                        stock_code: f["ShortName"],
                        exchange_code: "NSE",
                        full_name: f['fullname']

                      },

                    });

                  }

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


    this.from_date = this.todaysDateInYYYYMMDD()
    this.to_date = this.todaysDateInYYYYMMDD()

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
      Cookies.remove("s_token")
      console.error('Socket.IO not connected!');
    }

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
        Cookies.set('v_intract', true)
        this.isws_connected = true

      }
      else {
        if (Cookies.get('v2_intract') == 'true') {
          Cookies.set('v_intract', false)

        }
        else {
          Cookies.set('v_intract', true)

        }
        this.changedisplay(this.Displaystype)
        this.isws_connected = true

      }
      console.log("Connected to server!");
    });

    this.socket.on("connect", (data) => {
      // if (Object.keys(data).includes("sid")){
      //   this.socket.emit('message', { a: 'reconnect', 'sid': data['sid'] });
      // }
      // else{
      //   this.socket.emit('message', { a: 'auth', user: this.vite_username, session: Cookies.get('s_token') });

      // }
      this.socket.emit("message", {
        a: "auth",
        user: this.vite_username,
        session: Cookies.get("s_token"),
      });
      console.log("Connected to virtual server!");
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
      this.equity_positions = {}
      this.trade_user = ""
      console.log("Disconnected from virtual server");

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
        this.getvirtualfunds();
        this.changedisplay(this.Displaystype)

      }

      if (data["type"] == "Connection_Error") {
        if (data["error"] == "Unexpected error: Session key is expired.") {
          Cookies.remove("s_token");
          Cookies.remove('s_token')
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
      } else if (data.hasOwnProperty("sourceNumber")) {
        try {
          this.alert_data = "Your order of " + data['stockCode'] + " " + data['strikePrice'] + " " + data['optionType'] + " " + data["expiryDate"] +
            " of quantity " + data["executedQuantity"] + " is " + data["orderStatus"]
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

    this.socket.on("get_quotes_positions&watchlist", (data) => {

      data = data['Success'][0]
      this.breeze_ws_data[data['full_name']
      ] = data;

    })

    this.socket.on("margin_calculator", (data) => {
      let getby = 0
      if (this.order_security['action'] == "sell") {
        getby = parseFloat(this.order_security['quantity']) * parseFloat(this.order_security["price"])
      }
      else {
        getby = parseFloat(this.order_security['quantity']) * -1 * parseFloat(this.order_security["price"])
      }
      if (data["Status"] == 200) {
        this.alert_code = data["Status"]
        let total_fno = this.allocated_fno + this.fno_span
        if (total_fno >= parseFloat(data["data"]["span_margin_required"])) {

          this.sendOptionOrder(this.order_security, {
            allocated_fno: this.allocated_fno + this.fno_span + getby - data["data"]["span_margin_required"],
            fno_span: parseFloat(data["data"]["span_margin_required"])
          })

        }
        else {
          this.alert_data = "Available margin is ₹" + (this.allocated_fno + this.fno_span) + " but the required margin is ₹" + data["data"]["span_margin_required"]
          this.alert_code = 201
          this.is_alert = true
          setTimeout(this.removealert, 3000)

        }

      }
      else {
        if (data["data"] == "No Positions in List, Kindly add Positions in List to calculate Margin.") {

          this.sendOptionOrder(this.order_security, {
            allocated_fno: this.allocated_fno + this.fno_span + getby,
            fno_span: 0
          })
        }
        else {
          this.alert_data = data["data"]
          this.alert_code = data["Status"]
          this.is_alert = true
          setTimeout(this.removealert, 3000)

        }
      }
    })

  },

  computed: {
    totalpl() {
      let acc = 0;
      if (Object.keys(this.breeze_ws_data).length > 0) {
        try {
          const tradePositionsArray = Object.values(this.trade_positions);
          acc = tradePositionsArray.reduce(
            (accumulator, currentValue) => {

              const tickerKey = currentValue.full_name
              let plvalue = 0
              if (this.breeze_ws_data[tickerKey
              ]) {
                if (this.breeze_ws_data[tickerKey]["sPrice"]) {

                  if (currentValue.quantity > 0) {
                    return accumulator + ((this.breeze_ws_data[tickerKey]["sPrice"] - (currentValue.total_cost / currentValue.quantity)) *
                      currentValue.quantity)

                  }
                  else {

                    return accumulator + (((currentValue.total_cost / currentValue.quantity) - this.breeze_ws_data[tickerKey]["bPrice"]) *
                      currentValue.quantity * -1)

                  }

                }
                else {
                  if (currentValue.quantity > 0) {
                    return accumulator + ((this.breeze_ws_data[tickerKey]["ltp"] - (currentValue.total_cost / currentValue.quantity)) *
                      currentValue.quantity)

                  }
                  else {

                    return accumulator + (((currentValue.total_cost / currentValue.quantity) - this.breeze_ws_data[tickerKey]["ltp"]) *
                      currentValue.quantity * -1)

                  }


                }


              }
              else {
                if (currentValue.quantity > 0) {
                  return accumulator + 0
                }
                else {
                  return accumulator + 0

                }

              }
            }, 0
          );
          return acc;
        }
        catch (err) {
          return 0
        }

      } else {
        return 0
      }
    },
    orderbook_pnl() {
      let acc = 0;
      if (this.order_book) {
        if (this.order_book.length > 0) {

          acc = this.order_book.reduce(
            (accumulator, currentValue) => {
              if (currentValue.expiry_date) {
                if (currentValue.trade_type == "sell") {
                  return accumulator + parseFloat(currentValue.price * parseInt(currentValue.quantity));
                }
                else {
                  return accumulator - parseFloat(currentValue.price * parseInt(currentValue.quantity));

                }
              }
              else {
                if (currentValue.trade_type == "sell") {
                  return accumulator + parseFloat(currentValue.price);
                }
                else {
                  return accumulator - parseFloat(currentValue.price);

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
    // this.socket.disconnect();
  },
};
</script>