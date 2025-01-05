<template>
    <form id="dragbox" v-bind:style="borderStyle" class="card dragbo-sm">
        <slot></slot>
        <div id="dragboxheader" v-bind:style="borderStyle"
            v-bind:class="local_ActionMode ? 'bg-gradient-danger' : 'bg-gradient-success'" class="card drag-handle">

            <div class="container">
                <div class="row">
                    <div class="col-sm">
                    </div>
                    <div class="col-lg-8 col-sm-8">
                        <span class="badge bg-gradient-info badge-sm null null">{{ Security }}</span>

                    </div>
                    <div class="col-sm" style="padding-right: 0px;">

                        <div class="form-check form-switch ps-3">
                            <input @click="changeBorderColor(local_ActionMode)" style="left:100%"
                                :value="local_ActionMode" v-model="local_ActionMode" id="local_ActionMode"
                                class="mt-1 form-check-input form-check-input-sm" type="checkbox" />
                        </div>
                        <!-- v-model="isDarkMode"
                  v-on:click="DarkModesave" -->
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4 col-sm-4">

                    </div>
                    <div class="col-sm form-amount-sm">
                        <h6 style="font-size: 90%;">
                            {{ new Intl.NumberFormat('en-us', { style: 'currency', currency: 'INR' }).format(Price)
                            }}
                        </h6>
                        <!-- <span>One of three columns</span> -->
                    </div>
                    <div class="col-sm">
                    </div>
                </div>
            </div>
        </div>
        <section class="wrap"><!---->
            <div class="content">
                <div class="container">
                    <div class="row omnisearch">
                        <div class="col-sm">

                        </div>
                        <div class="col-sm ">

                        </div>
                        <div class="col-sm">

                        </div>
                    </div>
                </div>
                <div class="body">
                    &nbsp;
                    <div class="container">
                        <div class="row ">
                            <div class="col-sm"><span class="col-lg-2 col-sm-2 text-dark">quantity</span>
                                <!-- <span class="text-dark">One of three columns</span> -->
                                <div><input id="qty" type="text" class="form-control" placeholder="Number" :min="0"
                                        v-model="local_Quantity" disabled></div>
                            </div>
                            <div class="col-sm"><span class="col-lg-2 col-sm-2 text-dark">Lots</span>
                                <!-- <span class="text-dark">One of three columns</span> -->
                                <div><input id="lot" type="number" class="form-control" placeholder="Number" :min="0"
                                        v-model="local_Lots" @change="updateQuantity"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="gtt">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm">
                                <!-- <span class="text-dark">One of three columns</span> -->
                            </div>
                            <div class="col-sm">
                                <!-- <span class="text-dark">One of three columns</span> -->
                            </div>
                            <div class="col-sm">
                                <!-- <span class="text-dark">One of three columns</span> -->
                            </div>
                        </div>
                    </div>
                </div>
                <footer class="footer row">
                    <div class="seven columns">
                        <div class="row margins">
                            <div class="block"><label style="color:black !important;">Amount : {{ new
                                Intl.NumberFormat("en-us", {
                                    style: "currency",
                                    currency: "INR",
                                    }).format(parseFloat(Price) * parseFloat(local_Quantity) )}}</label> </div>
                            <div v-if="Limit_counter" class="block charges">
                                <label style="color:black !important;">Limit order : </label>
                                &nbsp;
                                <input style="border:1px solid black !important;"
                                :value="local_order_type" v-model="local_order_type" id="local_order_type"
                                class="mt-1 form-check-input" type="checkbox" @click="limittocurrentprice" />

                                <div><input v-if="local_order_type" id="otype" type="number" class="form-control-sm" placeholder="Number" :min="0"
                                        v-model="local_limit_price"></div>
                            </div>
                            
                        </div>
                    </div>
                    &nbsp;
                    <div>
                        <span v-if="local_ActionMode" @click="sendorder('sell')" type="button" class="badge badge-danger badge-xl">Sell</span>

                        <span v-else type="button" @click="sendorder('buy')" class="badge badge-success badge-xl"> Buy </span>
                        &nbsp;
                        <span type="button" @click="closeorder" class="badge badge-secondary badge-xl">Cancel</span>
                    </div>
                    <p></p>
                </footer>
            </div>
        </section> <!----> <!----> <!----> <!---->
    </form>
</template>

<script>

export default {
    data() {
        return {
            initialX: null,
            initialY: null,
            local_ActionMode: false,
            local_Lots: 1,
            local_Quantity: 1,
            borderStyle: {
                'border-color': 'green', // Change 'red' to your desired color
            },
            orderdata: {},
            local_order_type: false,
            local_limit_price: 0
        };
    },
    props: {
        Security: {
            type: String,
            required: true,
        },
        Price: {
            type: Number,
            required: true,
        },
        toggleActionMode: {
            type: Boolean,
            required: true,
        },
        Quantity: {
            type: Number,
            required: true,
        },
        LotSize: {
            type: Number,
            required: true,
        },
        Token: {
            type: Number,
            required: true
        },
        Limit_counter: {
            type: Boolean,
            default: true
        }
    },
    watch: {

        toggleActionMode(newVal) {
            this.local_ActionMode = newVal
            this.changeBorderColor(!newVal)
        },

        Quantity(newVal) {
            this.local_Quantity = newVal
            this.local_Lots = newVal / this.LotSize
        },
        Security(newVal){
            console.log(newVal)
        },
        LotSize(newVal){
            this.local_Lots = newVal / this.LotSize

        }
    },
    mounted() {
        this.local_ActionMode = this.toggleActionMode
        this.local_Quantity = this.Quantity
        this.local_Lots = this.Quantity / this.LotSize
        //Make the DIV element draggagle:
        dragElement(document.getElementById("dragbox"));

        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById(elmnt.id + "header")) {
                /* if present, the header is where you move the DIV from:*/
                document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            } else {
                /* otherwise, move the DIV from anywhere inside the DIV:*/
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // Get window dimensions
                const windowWidth = window.innerWidth || document.documentElement.clientWidth;
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;

                // Get DIV dimensions
                const divWidth = elmnt.offsetWidth;
                const divHeight = elmnt.offsetHeight;

                // Constrain element position within window boundaries
                let newLeft = elmnt.offsetLeft - pos1;
                let newTop = elmnt.offsetTop - pos2;

                // Ensure left edge stays within window
                newLeft = Math.max(0, Math.min(newLeft, windowWidth - divWidth));

                // Ensure top edge stays within window
                newTop = Math.max(0, Math.min(newTop, windowHeight - divHeight));

                // set the element's new position:
                //   elmnt.style.top = newTop + "px";
                elmnt.style.left = newLeft + "px";
            }

            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }


    },
    methods: {
        limittocurrentprice(){
            this.local_limit_price = this.Price
        },
        sendorder(action){
            this.orderdata['action']=action;
            this.orderdata['quantity']=this.local_Quantity.toString();
            if (this.local_order_type && this.Limit_counter){
                this.orderdata['price'] = String(this.local_limit_price)
                this.orderdata['order_type']='limit';
            }
            else {
                this.orderdata['order_type']='market';
                this.orderdata['price'] = ""

            }
            this.$emit('child-data', { 'type': 'sendorder', 'data': this.orderdata })

        },
        updateQuantity() {
            if (this.LotSize) {
                this.local_Quantity = this.LotSize * this.local_Lots

            } else {
                this.local_Quantity = this.local_Lots
            }
        },

        closeorder() {
            this.$emit('child-data', { 'type': 'closebox', 'data': false })
        },

        runorder() {
            this.$emit('child-data', {
                'type': 'runorder', 'data': {

                }
            })

        },
        changeBorderColor(Action) {
            if (Action) {
                this.borderStyle['border-color'] = 'green';

            } else {
                this.borderStyle['border-color'] = 'red';

            }

        },


    },
};
</script>

<style>
#dragbox {
    position: fixed;
    z-index: 9;
    text-align: center;
    bottom: 0;
    width: 427.3px;
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 1000px;
    /* Optional: Add rounded corners */
    border-top: 0;
}

#dragboxheader {
    padding: 10px;
    cursor: move;
    z-index: 10;
    border: 2px solid #73AD21;
    padding: 4px;

    color: #fff;
}

.drag-handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 75px;
    cursor: move
}
</style>