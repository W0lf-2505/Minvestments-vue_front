<template>
  <footer class="py-3 footer">
    <div class="container-fluid ">
      <!-- downstick -->
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div>
          <div
            class="text-sm text-center copyright text-muted"
            :class="$store.state.isRTL ? 'text-lg-end' : 'text-lg-start'"
          >
            ©
            {{ new Date().getFullYear() }}, made with
            <i class="fa fa-heart"></i> by
            <a
              href="http://www.codesacure.com"
              class="font-weight-bold"
              target="_blank"
              >Codesacure</a
            >
          </div>
          </div>
        </div>
        <div class="col-lg-6">
          <ul
            class="nav nav-footer justify-content-center justify-content-lg-end"
          >
            <li class="nav-item">
              <a
                href="http://www.codesacure.com"
                class="nav-link text-muted"
                target="_blank"
                >Codesacure</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://www.codesacure.com/contact-us"
                class="nav-link text-muted"
                target="_blank"
                >About Us</a
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/license"
                class="nav-link pe-0 text-muted"
                >License</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>



<script>
export default {
  name: "AppFooter",

};
</script>
