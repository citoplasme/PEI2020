<template>
  <Loading v-if="!ready" :message="'service'" />

  <div v-else>
    <div align="center" v-if="e1 == -2 || e1 == -1">
      <h1 v-if="e1 == -2">Negotiation Refused</h1>
      <h1 v-if="e1 == -1">Negotiation Canceled</h1>
      <template>
        <v-container>
          <v-timeline dense clipped>
            <div v-for="n in this.data.orcamento" :key="n.id">
              <div v-if="n.user === idLoged">
                <v-timeline-item
                  fill-dot
                  class="mb-4"
                  color="blue"
                  icon-color="grey lighten-2"
                  large
                >
                  <template v-slot:icon>
                    <span>P</span>
                  </template>
                  <v-row justify="space-between">
                    <v-col cols="7">
                      {{ n.value }}
                    </v-col>
                    <v-col class="text-right" cols="5">
                      {{ n.datetime }}
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </div>
              <div v-else>
                <v-timeline-item
                  fill-dot
                  class="mb-4"
                  color="green"
                  icon-color="grey lighten-2"
                  large
                >
                  <template v-slot:icon>
                    <span>E</span>
                  </template>
                  <v-row justify="space-between">
                    <v-col cols="7">
                      {{ n.value }}
                    </v-col>
                    <v-col class="text-right" cols="5">
                      {{ n.datetime }}
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </div>
            </div>
          </v-timeline>
        </v-container>
      </template>
    </div>

    <v-stepper v-else v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Negotiation
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">
          Waiting Service
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">
          Review
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="4">
          Finished
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-btn
            v-if="this.lastBid != undefined && this.lastBid != this.idLoged"
            @click="acceptBid()"
            color="primary"
          >
            Accept Bid
          </v-btn>

          <template
            v-if="this.lastBid != undefined && this.lastBid == this.idLoged"
          >
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" v-bind="attrs" v-on="on">
                  Cancel Negotiation
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Are you sure?
                </v-card-title>
                <v-card-text>
                  Are you sure you want to stop negotiation? After this you will
                  not be able to do more bids and the service will be canceled.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="cancelBid(true)">
                    I Yes
                  </v-btn>
                  <v-btn color="primary" text @click="cancelBid(false)">
                    I No
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <template
            v-if="this.lastBid != undefined && this.lastBid != this.idLoged"
          >
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" v-bind="attrs" v-on="on">
                  Stop Negotiation
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Are you sure?
                </v-card-title>
                <v-card-text>
                  Are you sure you want to stop negotiation? After this you will
                  not be able to do more bids and the service will be canceled.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialogResult(true)">
                    I Yes
                  </v-btn>
                  <v-btn color="primary" text @click="dialogResult(false)">
                    I No
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template>
            <v-container>
              <v-timeline dense clipped>
                <v-timeline-item
                  fill-dot
                  class="white--text mb-12"
                  color="blue"
                  large
                >
                  <template v-slot:icon>
                    <span>P</span>
                  </template>
                  <v-text-field
                    v-model="input"
                    hide-details
                    flat
                    label="Write your bid..."
                    regular
                    @keydown.enter="comment"
                    append-icon="gavel"
                    icon-color="red"
                    @click:append="comment"
                  >
                  </v-text-field>
                </v-timeline-item>

                <div v-for="n in this.data.orcamento" :key="n.id">
                  <div v-if="n.user === idLoged">
                    <v-timeline-item
                      fill-dot
                      class="mb-4"
                      color="blue"
                      icon-color="grey lighten-2"
                      large
                    >
                      <template v-slot:icon>
                        <span>P</span>
                      </template>
                      <v-row justify="space-between">
                        <v-col cols="7">
                          {{ n.value }}
                        </v-col>
                        <v-col class="text-right" cols="5">
                          {{ n.datetime }}
                        </v-col>
                      </v-row>
                    </v-timeline-item>
                  </div>
                  <div v-else>
                    <v-timeline-item
                      fill-dot
                      class="mb-4"
                      color="green"
                      icon-color="grey lighten-2"
                      large
                    >
                      <template v-slot:icon>
                        <span>E</span>
                      </template>
                      <v-row justify="space-between">
                        <v-col cols="7">
                          {{ n.value }}
                        </v-col>
                        <v-col class="text-right" cols="5">
                          {{ n.datetime }}
                        </v-col>
                      </v-row>
                    </v-timeline-item>
                  </div>
                </div>
              </v-timeline>
            </v-container>
          </template>
        </v-stepper-content>

        <v-stepper-content step="2">
          
          <div v-if="10000>this.date_diff" align="center">
              <v-btn
                  v-if="this.lastBid != undefined && this.lastBid != this.idLoged"
                  @click="review()"
                  color="primary"
                >
                  Review Service
                </v-btn>
          </div>
          <div v-else align="center">

              <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" v-bind="attrs" v-on="on">
                  Cancel Negotiation
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Are you sure?
                </v-card-title>
                <v-card-text>
                  Are you sure you want to stop negotiation? After this you will
                  not be able to do more bids and the service will be canceled.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="cancelBid(true)">
                    I Yes
                  </v-btn>
                  <v-btn color="primary" text @click="cancelBid(false)">
                    I No
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div v-if="this.idLoged != this.data.client">
            <div>
              <table>
                <tr>
                  <th style="width:100px">
                    Payment
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <div>
              <table>
                <tr>
                  <th style="width:100px">
                    Punctuality
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <div>
              <table>
                <tr>
                  <th style="width:100px">
                    Security
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <div>
              <table >
                <tr>
                  <th style="width:100px">
                    General
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <v-textarea
              solo
              name="input-7-4"
              label="Commentary"
            ></v-textarea>
            <div align="center">
              <v-btn
                  v-if="this.lastBid != undefined && this.lastBid != this.idLoged"
                  @click="sendReview()"
                  color="primary"
                >
                  Send Review
                </v-btn>
            </div>
            
          </div>
          <div v-else>
            <div>
              <table>
                <tr>
                  <th style="width:100px">
                    Punctuality
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <div>
              <table>
                <tr>
                  <th style="width:100px">
                    Quality
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <div>
              <table>
                <tr>
                  <th style="width:100px">
                    Security
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <div>
              <table >
                <tr>
                  <th style="width:100px">
                    Attendance
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <div>
              <table >
                <tr>
                  <th style="width:100px">
                    General
                  </th>
                  <th>
                    <v-rating
                      color="blue"
                      empty-icon="star_outline"
                      full-icon="star"
                      half-icon="star_half"
                      hover
                      length="5"
                      size="32"
                      value="3"
                    ></v-rating>
                  </th> 
                </tr>
              </table>
              
            </div>
            <v-textarea
              solo
              name="input-7-4"
              label="Commentary"
            ></v-textarea>
            <div align="center">
              <v-btn
                  v-if="this.lastBid != undefined && this.lastBid != this.idLoged"
                  @click="sendReview()"
                  color="primary"
                >
                  Send Review
                </v-btn>
            </div>
            
          </div>
        </v-stepper-content>
        <v-stepper-content step="4">
          <v-card class="mb-12 elevation-0" color="#E3F2FD" height="200px"
            >Service is Finished</v-card
          >
        </v-stepper-content>
      </v-stepper-items>
      <div v-if="e1 == -2" align="center">
        <h1>Negotiation Refused</h1>
      </div>
      <div v-if="e1 == -1" align="center">
        <h1>Negotiation Canceled</h1>
      </div>
    </v-stepper>
  </div>
</template>

<script>
import Loading from "@/components/generic/Loading";

export default {
  /*
    -2 - Refused
    -1 - Canceled
    0 - Generated
    1 - Negotiating
    2 - Accepted
    3 - Waiting for evaluation
    4 - Finalized
    */
  props: ["idService"],
  components: {
    Loading
  },
  data: () => ({
    lastBid: undefined,
    e1: 1,
    input: null,
    data: null,
    ready: false,
    dialog: false
  }),

  async created() {
    await this.getData();
    await this.getLastBid();
    this.ready = true;
  },

  methods: {
    //10000 equivale a 1 dia
    date_difference(data, horario){
    console.log("Entrou")
	if(data === undefined){
		return -1;
	} else if (horario === undefined){
		horario = "00:00:00";
	} else {
		horario = horario + ":00";
	}
	let marcacao = new Date(data + "T" + horario + "Z");

	// current date
	let date_ob = new Date();

	return this.date_to_number(marcacao) - this.date_to_number(date_ob); 
  },
    date_to_number(date_ob){
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);

	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	let year = date_ob.getFullYear();

	// current hours
	let hours = date_ob.getHours();

	// current minutes
	let minutes = date_ob.getMinutes();

	// YYYYMMDDHHmm
	return minutes + hours * 100 + date * 10000 + month * 1000000 + year * 100000000;
  },
    async comment() {
      var value = this.input;

      var res = await this.$request(
        "put",
        "/services/" + this.idService + "/bid",
        {
          value: this.input,
          user: this.idLoged
        }
      );
      this.input = null;
      this.lastBid = this.idLoged;

      await this.getService();
    },
    async getData() {
      let level = await this.$userLevel(this.$store.state.token);

      this.lvl = level;
      await this.getService();

      var res2 = await this.$request(
        "get",
        "/users/" + this.$store.state.token + "/token"
      );
      this.idLoged = res2.data._id;
    },
    async getService() {
      var res = await this.$request("get", "/services/" + this.idService);
      
      this.data = res.data;

      //testar datas
      this.date_diff = this.date_difference("2020-12-08");
      
      //this.date_diff = this.date_difference(res.data.date,res.data.hour);
      
      
      //Vai ordenar orçamentos por data
      this.data.orcamento.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
      //vai usar isto para escolher a tab em que esta negotiation / waiting service etc
      this.e1 = res.data.status;
    },
    getLastBid() {
      var lastBid = this.data.orcamento[0];
      if (lastBid != undefined) this.lastBid = lastBid.user;
    },
    async acceptBid() {
      var res = await this.$request(
        "put",
        "/services/" + this.idService + "/status",
        {
          status: "2"
        }
      );
      this.e1 = 2;
    },
    async dialogResult(bool) {
      //acaba as negociações
      if (bool == true) {
        var res = await this.$request(
          "put",
          "/services/" + this.idService + "/status",
          {
            status: "-2"
          }
        );
        this.e1 = -2;
        this.dialog = false;
      } else {
        this.dialog = false;
      }
    },
    async cancelBid(bool) {
      //acaba as negociações
      if (bool == true) {
        var res = await this.$request(
          "put",
          "/services/" + this.idService + "/status",
          {
            status: "-1"
          }
        );
        this.e1 = -1;
        this.dialog = false;
      } else {
        this.dialog = false;
      }
    },
    review() {
      this.e1=3;
    },
    sendReview() {
      //se for o cliente online
      if (this.idLoged==this.data.client){
          //ir buscar os dados usando o findelement by id, tenho de por ID's em todos os elementos ainda
      }
      //se for a empresa
      else{
        //ir buscar os dados usando o findelement by id, tenho de por ID's em todos os elementos ainda
      }
    }
  }
};
//PUT /v1/services/5fc7d9dd6565e154c43bf91b/bid 500 3.758 ms - 71   erro
//PUT /v1/services/5fbfe418a873e93baefa1a70/bid                     funciona este
</script>
