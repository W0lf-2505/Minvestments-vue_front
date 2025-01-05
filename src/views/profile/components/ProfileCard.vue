<template>
    <div>
        <div class="py-4 container-fluid">
            <div class="mt-3 row">
                <div class="mt-4 col-12 col-md-6 col-xl-12 mt-md-0">
                    <div class="card h-100">
                        <div class="p-3 pb-0 card-header">
                            <div class="row">
                                <div class="col-md-8 d-flex align-items-center col-12">
                                    <h6 class="mb-0">Profile Information</h6>
                                </div>
                                <div class="col-md-4 text-end">
                                    <a href="javascript:;">
                                        <i class="text-sm fas fa-user-edit text-secondary" data-bs-toggle="tooltip"
                                            data-bs-placement="top" title="Edit Profile"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 card-body">
                            <p class="text-sm">
                                <!-- Profile Info -->
                            </p>
                            <hr class="my-4 horizontal gray-light" />
                            <ul class="list-group">
                                <li class="pt-0 text-sm border-0 list-group-item ps-0">
                                    <strong class="text-dark">Full Name:</strong> &nbsp; {{ full_name }}
                                </li>
                                <li class="text-sm border-0 list-group-item ps-0">
                                    <strong class="text-dark">UserId:</strong> &nbsp; {{ username }}
                                </li>
                                <li class="text-sm border-0 list-group-item ps-0">
                                    <strong class="text-dark">Email:</strong> &nbsp; {{ email }}
                                </li>
                                <li class="text-sm border-0 list-group-item ps-0">
                                    <strong class="text-dark">Join Date:</strong> &nbsp; {{ join_date }}
                                </li>

                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>


        <div class="py-4 container-fluid">
            <div class="mt-3 row">
                <div class="mt-4 col-12 col-md-6 col-xl-12 mt-md-0">
                    <div class="card h-100">
                        <div class="p-3 pb-0 card-header">
                            <div class="row">
                                <div class="col-md-8 d-flex align-items-center col-12">
                                    <h6 class="mb-0">Account Statistics</h6>
                                </div>

                            </div>
                        </div>
                        <div class="p-3 card-body">

                            <ul class="list-group">
                                <li class="pt-0 text-sm border-0 list-group-item ps-0">
                                    <strong class="text-dark">Total Invested:</strong> &nbsp; Rs. {{ InitialInvested }}/-
                                </li>

                                <p></p>
                                <strong class="text-dark">Withdrawals:</strong>
                                <li v-for="(withdraw, date) in withdrawal" :key="date">
                                    <strong class="text-dark">{{ date }}:</strong> &nbsp; Rs. {{ withdraw }}/-
                                </li>

                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { axiosClientIns } from "@/libs/client_axios";

export default {

    name: "ProfileCard",
    full_name: "",
    username: "",
    email: "",
    join_date: "",
    data() {
        return {
            uid: Cookies.get('uid', { domain: import.meta.env.VITE_APP_Parent_Domain }),
            vite_username: Cookies.get('vite_username', { domain: import.meta.env.VITE_APP_Parent_Domain }),
            rawData: [],
            allData: [],
            InitialInvested: 0,
            withdrawal: [],
        }

    },

    beforeCreate() {
        this.full_name = Cookies.get('full_name');
        this.username = Cookies.get('vite_username');
        this.email = Cookies.get('email');
        this.join_date = Cookies.get('join_date')
    },
    mounted() {
        axiosClientIns
            .post("/search/statistics_col/needed_fields", {
                'filter': { "user": Cookies.get('vite_username') },
                'fields': { 'Months': 1, 'Withdrawals': 1, 'InitialInvested': 1 },
                'username': this.vite_username,
                'uid': this.uid
            }).then(response => {
                this.rawData = JSON.parse(response.data.real_data)
                this.allData = JSON.parse(response.data.real_data)
                this.InitialInvested = this.allData[0]['InitialInvested']
                this.withdrawal = this.allData[0]['Withdrawals']

            })
    }
};
</script>
