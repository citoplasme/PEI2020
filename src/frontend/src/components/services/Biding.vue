<template>
  <Loading v-if="!ready" :message="'service'" />

  <div v-else>
    <div>
      <p></p>
      <v-card class="mx-auto" max-width="100%">
        <v-card-text>
          <table border="0" style="width:100%">
            <tr>
              <th>
                <div v-if="this.idLoged != this.data.client">
                  <b>Client:</b> {{ this.clientName }}
                </div>
                <div v-else>
                  <b>Service Provider:</b> {{ this.serviceProviderName }}
                </div>
              </th>
              <th>Date: {{ this.data.date }}</th>
              <th>
                <div v-if="this.data.hour">Hour: {{ this.data.hour }}</div>
              </th>
              <th>
                <div v-if="this.lastBid">
                  <b>Last Bid: </b>{{ this.lastBidText }}
                </div>
              </th>
              <th>
                <v-btn @click="go(idService)" icon color="primary">
                  <v-icon>search</v-icon>
                </v-btn>
              </th>
            </tr>
          </table>

          <p><b>Description:</b>{{ this.data.desc }}</p>
          <p></p>
        </v-card-text>
      </v-card>
      <p></p>
    </div>
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
                    <span v-if="data.client == n.user">
                      {{ clientName[0] }}
                    </span>
                    <span v-else> {{ serviceProviderName[0] }} </span>
                  </template>
                  <v-row justify="space-between">
                    <v-col cols="7">
                      {{ n.value }}
                    </v-col>
                    <v-col class="text-right" cols="5">
                      @{{ get_date_time(n.datetime) }}
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
                    <span v-if="data.client == n.user">
                      {{ clientName[0] }}
                    </span>
                    <span v-else> {{ serviceProviderName[0] }} </span>
                  </template>
                  <v-row justify="space-between">
                    <v-col cols="7">
                      {{ n.value }}
                    </v-col>
                    <v-col class="text-right" cols="5">
                      @{{ get_date_time(n.datetime) }}
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

        <v-stepper-step :complete="e1 > 3" step="3">
          Review
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 >= 4" step="4">
          Finished
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-btn
            v-if="this.lastBid != undefined && this.lastBid != this.idLoged"
            @click="acceptBid()"
            color="primary"
            class="mr-1 ml-1"
          >
            Accept Bid
          </v-btn>

          <template
            v-if="this.lastBid != undefined && this.lastBid == this.idLoged"
          >
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" class="white--text" v-bind="attrs" v-on="on">
                  Cancel Service
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
                    Yes
                  </v-btn>
                  <v-btn color="primary" text @click="cancelBid(false)">
                    No
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
                <v-btn
                  class="white--text ml-1 mr-1"
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                >
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
                    Yes
                  </v-btn>
                  <v-btn color="primary" text @click="dialogResult(false)">
                    No
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
                    <span v-if="idLoged == data.client">
                      {{ clientName[0] }}
                    </span>
                    <span v-else> {{ serviceProviderName[0] }} </span>
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
                  <div v-if="n.user == idLoged">
                    <v-timeline-item
                      fill-dot
                      class="mb-4"
                      color="blue"
                      icon-color="grey lighten-2"
                      large
                    >
                      <template v-slot:icon>
                        <span v-if="data.client == n.user">
                          {{ clientName[0] }}
                        </span>
                        <span v-else> {{ serviceProviderName[0] }} </span>
                      </template>
                      <v-row justify="space-between">
                        <v-col cols="7">
                          {{ n.value }}
                        </v-col>
                        <v-col class="text-right" cols="5">
                          @{{ get_date_time(n.datetime) }}
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
                        <span v-if="data.client == n.user">
                          {{ clientName[0] }}
                        </span>
                        <span v-else> {{ serviceProviderName[0] }} </span>
                      </template>
                      <v-row justify="space-between">
                        <v-col cols="7">
                          {{ n.value }}
                        </v-col>
                        <v-col class="text-right" cols="5">
                          @{{ get_date_time(n.datetime) }}
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
          <div v-if="0 > this.date_diff" align="center">
            <v-btn
              v-if="this.lastBid != undefined"
              @click="review()"
              color="primary"
              class="mr-1 ml-1"
            >
              Mark Service as finished
            </v-btn>

            <template>
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="red"
                    class="white--text mr-1 ml-1"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Cancel Service
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2">
                    Are you sure?
                  </v-card-title>
                  <v-card-text>
                    Are you sure you want to stop negotiation? After this you
                    will not be able to do more bids and the service will be
                    canceled.
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="cancelBid(true)">
                      Yes
                    </v-btn>
                    <v-btn color="primary" text @click="cancelBid(false)">
                      No
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </div>
          <div v-if="24 < this.date_diff" align="center">
            <h3>Awaiting service completion ...</h3>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" class="white--text" v-bind="attrs" v-on="on">
                  Cancel Service
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
                    Yes
                  </v-btn>
                  <v-btn color="primary" text @click="cancelBid(false)">
                    No
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
                      v-model="empresa_review.payment"
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
                      v-model="empresa_review.ponctuality"
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
                      v-model="empresa_review.security"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <div>
              <table>
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
                      v-model="empresa_review.general"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <v-textarea
              label="Comment"
              auto-grow
              solo
              clearable
              color="indigo"
              counter="3000"
              maxlength="3000"
              v-model="empresa_review.comentario"
            ></v-textarea>

            <div align="center">
              <v-btn
                v-if="
                  this.lastBid != undefined &&
                    this.data.review.client &&
                    !this.data.review.client.general
                "
                @click="sendReview()"
                color="primary"
              >
                Send Review
              </v-btn>
              <v-btn v-else @click="sendReview()" color="primary">
                Edit Review
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
                      v-model="cliente_review.ponctuality"
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
                      v-model="cliente_review.quality"
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
                      v-model="cliente_review.security"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <div>
              <table>
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
                      v-model="cliente_review.attendance"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <div>
              <table>
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
                      v-model="cliente_review.general"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <v-textarea
              label="Comment"
              auto-grow
              solo
              clearable
              color="indigo"
              counter="3000"
              maxlength="3000"
              v-model="cliente_review.comentario"
            ></v-textarea>
            <div align="center">
              <v-btn
                v-if="
                  this.lastBid != undefined &&
                    this.data.review.service_provider &&
                    !this.data.review.service_provider.general
                "
                @click="sendReview()"
                color="primary"
              >
                Send Review
              </v-btn>
              <v-btn v-else @click="sendReview()" color="primary">
                Edit Review
              </v-btn>
            </div>
          </div>
        </v-stepper-content>
        <v-stepper-content step="4">
          <div v-if="this.idLoged == this.data.client">
            <h2>Review by the service provider</h2>
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
                      readonly
                      :value="this.data.review.client.payment"
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
                      readonly
                      :value="this.data.review.client.ponctuality"
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
                      readonly
                      :value="this.data.review.client.payment"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <div>
              <table>
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
                      readonly
                      :value="this.data.review.client.payment"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <v-textarea
              label="Comment"
              auto-grow
              solo
              clearable
              color="indigo"
              counter="3000"
              maxlength="3000"
              disabled
              v-model="this.data.review.client.comentario"
            ></v-textarea>
          </div>
          <div v-else>
            <h2>Review by the client</h2>
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
                      readonly
                      :value="this.data.review.service_provider.ponctuality"
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
                      readonly
                      :value="this.data.review.service_provider.quality"
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
                      readonly
                      :value="this.data.review.service_provider.security"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <div>
              <table>
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
                      readonly
                      :value="this.data.review.service_provider.attendance"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <div>
              <table>
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
                      readonly
                      :value="this.data.review.service_provider.general"
                    ></v-rating>
                  </th>
                </tr>
              </table>
            </div>
            <v-textarea
              label="Comment"
              auto-grow
              solo
              clearable
              color="indigo"
              counter="3000"
              maxlength="3000"
              disabled
              v-model="this.data.review.service_provider.comentario"
            ></v-textarea>
          </div>
        </v-stepper-content>
      </v-stepper-items>
      <div v-if="e1 == -2" align="center">
        <h1>Negotiation Refused</h1>
      </div>
      <div v-if="e1 == -1" align="center">
        <h1>Negotiation Canceled</h1>
      </div>
    </v-stepper>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      :top="true"
    >
      {{ text }}
      <v-btn text @click="fecharSnackbar">Close</v-btn>
    </v-snackbar>
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
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
    lastBid: undefined,
    e1: 1,
    input: null,
    data: null,
    ready: false,
    dialog: false,
    empresa_review: {
      payment: 3,
      ponctuality: 3,
      security: 3,
      general: 3,
      comentario: ""
    },
    cliente_review: {
      ponctuality: 3,
      quality: 3,
      security: 3,
      attendance: 3,
      general: 3,
      comentario: ""
    },
    clientName: "",
    serviceProviderName: ""
  }),

  async created() {
    await this.getData();
    await this.getLastBid();
    this.ready = true;
  },

  methods: {
    // >= 24
    date_difference(data, horario) {
      if (data === undefined) {
        return -1;
      } else if (horario === undefined) {
        horario = "00:00:00";
      } else {
        horario = horario + ":00";
      }
      let marcacao = new Date(data + "T" + horario + "Z");

      // current date
      let date_ob = new Date();

      //return Services.date_to_number(marcacao) - Services.date_to_number(date_ob);
      return (marcacao - date_ob) / 36e5; // 60 * 60 * 1000
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
      this.lastBidText = this.input;
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

      this.empresa_review = Object.assign({}, this.data.review.client);
      this.cliente_review = Object.assign(
        {},
        this.data.review.service_provider
      );

      //vai buscar o nome do user e do service provider
      var clientName = await this.$request("get", "/users/" + this.data.client);
      clientName = clientName.data.name;

      var serviceProvicerName = await this.$request(
        "get",
        "/users/" + this.data.service_provider
      );
      serviceProvicerName = serviceProvicerName.data.name;

      this.clientName = clientName;
      this.serviceProviderName = serviceProvicerName;

      //testar datas
      //this.date_diff = this.date_difference("2020-12-23");

      this.date_diff = this.date_difference(res.data.date, res.data.hour);

      //Vai ordenar orçamentos por data
      this.data.orcamento.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));

      //vai usar o status para determinar em que janela vai estar
      this.e1 = res.data.status;
    },
    getLastBid() {
      var lastBid = this.data.orcamento[0];
      if (lastBid != undefined) {
        this.lastBid = lastBid.user;
        this.lastBidText = lastBid.value;
      }
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
    async review() {
      var res = await this.$request(
        "put",
        "/services/" + this.idService + "/status",
        {
          status: "3"
        }
      )
        .then(res => {
          this.text = res.data;
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.dialog = false;
          this.e1 = 3;
        })
        .catch(err => {
          this.text = err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    async sendReview() {
      //se for o cliente online
      if (this.idLoged == this.data.client) {
        //ir buscar os dados usando o findelement by id, tenho de por ID's em todos os elementos ainda

        var res = await this.$request(
          "put",
          "/services/" + this.idService + "/review",
          this.cliente_review
        )
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog = false;
            this.getService();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      }
      //se for a empresa
      else {
        //ir buscar os dados usando o findelement by id, tenho de por ID's em todos os elementos ainda

        await this.$request(
          "put",
          "/services/" + this.idService + "/review",
          this.empresa_review
        )
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog = false;
            this.getService();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      }
    },
    get_date_time(dt) {
      return dt.substr(11, 8) + " " + dt.substr(0, 10);
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    go(id) {
      var url = "/services/" + id;
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    }
  }
};
//PUT /v1/services/5fc7d9dd6565e154c43bf91b/bid 500 3.758 ms - 71   erro
//PUT /v1/services/5fbfe418a873e93baefa1a70/bid                     funciona este
</script>
