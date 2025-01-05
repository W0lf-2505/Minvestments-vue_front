<template>
  <div id="optionchain">
    <div class="container-fluid py-4">
      <div class="row">
      <div class="d-sm-flex justify-content-between">
       
        <div class="d-flex">
          <div class="dropdown d-inline">
            <vsud-button
              id="navbarDropdownMenuLink2"
              color="dark"
              variant="outline"
              class="dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >Filters</vsud-button
            >
            <ul
              class="dropdown-menu dropdown-menu-lg-start px-2 py-3"
              aria-labelledby="navbarDropdownMenuLink2"
              style
            >
              <li>
                <a class="dropdown-item border-radius-md" href="javascript:;"
                  >Status: Paid</a
                >
              </li>
              <li>
                <a class="dropdown-item border-radius-md" href="javascript:;"
                  >Status: Refunded</a
                >
              </li>
              <li>
                <a class="dropdown-item border-radius-md" href="javascript:;"
                  >Status: Canceled</a
                >
              </li>
              <li>
                <hr class="horizontal dark my-2" />
              </li>
              <li>
                <a
                  class="dropdown-item border-radius-md text-danger"
                  href="javascript:;"
                  >Remove Filter</a
                >
              </li>
            </ul>
          </div>
          <vsud-button
            class="btn-icon ms-2 export"
            size
            color="dark"
            variant="outline"
            data-type="csv"
          >
            <span class="btn-inner--icon">
              <i class="ni ni-archive-2"></i>
            </span>
            <span class="btn-inner--text">Export CSV</span>
          </vsud-button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card mt-4">
            <div class="table-responsive" id="optiontable">
              <table class="table table-flush">
                <thead class="thead-light">
                  <tr>
                    <th>LTP</th>
                    <th>Strike Price</th>
                    <th>LTP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <vsud-checkbox />
                        <p class="text-xs font-weight-bold ms-2 mb-0">
                          item
                        </p>
                      </div>
                    </td>
                    <td class="font-weight-bold">
                      <span class="my-2 text-xs">item</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <vsud-checkbox />
                        <p class="text-xs font-weight-bold ms-2 mb-0">
                          item
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="d-flex align-items-center">
                        <vsud-checkbox />
                        <p class="text-xs font-weight-bold ms-2 mb-0">0</p>
                      </div>
                    </td>
                    <td class="font-weight-bold">
                      <span class="my-2 text-xs">49500</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <vsud-checkbox />
                        <p class="text-xs font-weight-bold ms-2 mb-0">0</p>
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
</template>

<script>
import { DataTable } from "simple-datatables";
import VsudButton from "@/components/VsudButton.vue";
import VsudAvatar from "@/components/VsudAvatar.vue";
import VsudCheckbox from "@/components/VsudCheckbox.vue";

export default {
  name: "OrderList",
  components: {
    VsudButton,
    VsudAvatar,
    VsudCheckbox,
  },
  data() {
    return {
      local_option_chain: {},
    };
  },

  mounted() {
    if (document.getElementById("order-list")) {
      const dataTableSearch = new DataTable("#order-list", {
        searchable: true,
        fixedHeight: false,
        perPageSelect: false,
      });

      document.querySelectorAll(".export").forEach(function (el) {
        el.addEventListener("click", function (el) {
          var type = el.dataset.type;

          var data = {
            type: type,
            filename: "soft-ui-" + type,
          };

          if (type === "csv") {
            data.columnDelimiter = "|";
          }

          dataTableSearch.export(data);
        });
      });
    }
  },
};
</script>

<style>

#optiontable {
  height: 600px;
}
</style>