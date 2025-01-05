<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12 position-relative z-index-2">
        <div class="mb-4 card card-plain">
          <div class="p-3 card-body">
            <div class="row">
              <div class="col-lg-6">
                <div class="d-flex flex-column h-100">
                  <h2 class="mb-0 font-weight-bolder">Users</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users List -->
      <div class="py-4 container-fluid">
        <div class="mt-3 row">
            
        

        <div class="row">
          <h3 class="font-weight-bolder text-info text-gradient">New User Form</h3>
          <p class="mb-0">Complete the form to add new user</p>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 col-xl-4">
            <form role="form" class="text-start">
              <label>Full Name</label>
              <vsud-input v-model="userFullname" id="fullname" type="fullname" placeholder="Fullname" name="fullname" required/>
              <label>Username</label>
              <vsud-input v-model="username" id="username" type="username" placeholder="Username" name="username" required/>
              <label>Email</label>
              <vsud-input v-model="userEmail" id="email" type="email" placeholder="Email" name="email" required/>
              <label>Enter Password</label>
              <vsud-input v-model="password" id="password" type="password" placeholder="Password" name="password" required/>
              <label>ReEnter Password</label>
              <vsud-input v-model="repeat_pass" id="repeat_pass" type="password" placeholder="RepeatPassword" name="repeat_pass" required/>
              <label>Please select the date you started trading</label>
              <div class="form-group">
                
              <flat-pickr 
              class="form-control" 
              id="datepicker" 
              v-model="selectedDate"
              :config="flatpickrConfig"
              ></flat-pickr>
              <!-- <p>You selected: {{ formattedDate }}</p> -->
              <p> {{selectedDate}}</p>
              </div>
              <label>Is he an admin ?</label>
              <div class="form-check form-switch ps-0">
                
                <input
                  id="isadmin"
                  v-model="isadmin"
                  class="mt-1 form-check-input"
                  :class="'ms-auto'"
                  type="checkbox"
                />
              </div>
              <div class="text-center">
                <vsud-button
                  class="my-4 mb-2"
                  variant="gradient"
                  color="info"
                  full-width
                  v-on:click.prevent="useradd"
                >Add User</vsud-button>
              </div>
            </form>

    </div>
    </div>
          </div>
        </div>
      </div>
      </div>
    <div class="mt-4 row">
    
    </div>
    <div class="row">
      <div class="col-12">
        <!-- globe -->
        <globe width="700" height="600" />
      </div>
    </div>
  </div>
</template>
<script>
import Globe from "@/components/Globe.vue";
import {axiosClientIns} from "@/libs/client_axios";
import Cookies from 'js-cookie';
import VsudInput from "@/components/VsudInput.vue";
import VsudSwitch from "@/components/VsudCheckbox.vue";
import VsudButton from "@/components/VsudButton.vue";
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.min.css";
import { format } from "date-fns";
import {axiosJWTIns, refreshToken} from "@/libs/jwt_axios";


export default {
  name: "Adduser",
  components: {
    Globe,
    VsudInput,
    VsudSwitch,
    VsudButton,
    FlatPickr
  },
  data() {
    return {
      
      uid: Cookies.get('uid', {domain: import.meta.env.VITE_APP_Parent_Domain}),
      vite_username: Cookies.get('vite_username', {domain: import.meta.env.VITE_APP_Parent_Domain}),
      rawData: [],
      allData: [],
      client_data:{},
      userFullname:'',
      userEmail: '',
      username:'',
      resetEmail: '',
      password: '',
      isadmin: false,
      showError: false,
      allusers: [],
      errorMessage: '',
      is_resetflow: false,
      is_otp: false,
      otp:'',
      new_pass:'',
      repeat_pass:'',
      app_role:'user',
      selectedDate: null,
      people: [],
      admin_permissions: [
        {'subject': 'root_jobs', 'action': 'superu'},
        {'subject': 'users', 'action': 'manage'},
      ],
      permissions: [
        {'subject': 'dashboard', 'action': 'manage'},
      ],
      userpermission:[],
      flatpickrConfig: {
        dateFormat: "F d, Y",
        altFormat: "Y-m-d",
        altInput: true,
      },
    };
  }, 
  created() {
    if (localStorage.getItem('access_token')) {
      axiosJWTIns.defaults.headers.post['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
      axiosJWTIns.post('/users', {
        'resource': 'users',
        'action': 'manage',
        'username': Cookies.get('vite_username'),
        'uid': Cookies.get('uid')
      })
      .then(response => {
        if (response.data.valid_token) {
          if (response.data.access) {
            this.people = JSON.parse(response.data.real_data)
          } else {
            notAuthorizedAlert()
          }
        } else {
          refreshToken()
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          refreshToken()
        } else if (error.response.status === 403) {
          notAuthorizedAlert()
        } else {
          somethingWentWrong()
        }
      })
    }
    this.isLoading = false;
    this.people = []
  },
  methods: {
    useradd: function (){
      if (this.isadmin){
        this.userpermission[0] = this.admin_permissions[0]
        this.app_role = 'Admin'
      }
      this.permissions.forEach(element => {
        this.userpermission.push(element)
        
      });

      this.client_data = {
        "ability":this.userpermission,
        "app_role":this.app_role,
        "email":this.userEmail,
        "full_name":this.userFullname,
        "password":this.password,
        "username":this.username,
        "picture_link":' ',
        "join_date":this.selectedDate,
        "re-pass":this.repeat_pass
      }

      if (this.check(this.client_data)){
        axiosJWTIns.defaults.headers.post['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
        axiosJWTIns.post('/user/add-user', {
          'resource': 'users',
          'action': 'manage',
          'username': Cookies.get('vite_username'),
          'uid': Cookies.get('uid'),
          'client_data': this.client_data,
          'client_username': this.client_data.username

        }).then(response => {
          if (response.data.valid_token) {
            if (response.data.access) {
              alert(response.data.message)
            } else {
              alert("You are not authorized to access this feature")
            }
          } else {
            alert("your login is expired. Please re login")
          }
        }).catch(error => catchError(error))
      }
    },
    check: function (user_data){
      for (const element in user_data){
        if (user_data[element] === '' || user_data[element] === null){
          return false
        }
      }
        if (user_data['password'] === user_data['re-pass']){
          delete user_data['re-pass']
          return true
        }else{
          return false
        }
    }
  },
  computed: {
    formattedDate() {
      return this.selectedDate
        ? format(this.selectedDate, "MMMM dd, yyyy")
        : "";
    },
  },
  
};
</script>
