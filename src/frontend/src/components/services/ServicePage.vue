<template>
  <Loading v-if="!ready" :message="'the service'" />
  <v-card v-else class="mx-auto" max-width="1000" tile>
    <div>
      <v-system-bar dark :color="barColor">
        <v-spacer></v-spacer>
        <span>{{ service.status }}</span>
      </v-system-bar>
    </div>
    <v-list>
      <v-list-item v-if="service.desc !== undefined && service.desc !== null && service.desc !== ''">
        <v-col cols="2">
          <div class="info-label">Description</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ service.desc }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.urgent != undefined && service.urgent !== null">
        <v-col cols="2">
          <div class="info-label">Urgent</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ service.urgent }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.client != undefined && service.client !== null && service.client !== ''">
        <v-col cols="2">
          <div class="info-label">Client</div>
        </v-col>
        <v-col>
          <!--<div class="info-content">
            <p>{{ service.client.id }}</p>
          </div>-->
          <div class="info-content">
            <span class="fakea" @click="go(`/users/${service.client.id}`)">{{
              service.client.name
            }}</span>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.service_provider != undefined && service.service_provider !== null && service.service_provider !== ''">
        <v-col cols="2">
          <div class="info-label">Service provider</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <span
              class="fakea"
              @click="go(`/users/${service.service_provider.id}`)"
              >{{ service.service_provider.name }}</span
            >
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.duration != undefined && service.duration !== null && service.duration !== ''">
        <v-col cols="2">
          <div class="info-label">Duration</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ service.duration }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.date != undefined && service.date !== null && service.date !== ''">
        <v-col cols="2">
          <div class="info-label">Date</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ service.date }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.hour != undefined && service.hour !== null && service.hour !== ''">
        <v-col cols="2">
          <div class="info-label">Hour</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ service.hour }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.orcamento !== undefined && service.orcamento.length > 0">
        <v-col cols="2">
          <div class="info-label">Budget flow</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in service.orcamento" :key="item._id">
                <ul>
                  <b>Proposal value:</b>
                  {{
                    item.value
                  }}$
                </ul>
                <ul>
                  <b>Proposal date:</b>
                  {{
                    item.datetime
                  }}
                </ul>
                <ul>
                  <b>Proposal made by:</b>
                  <span class="fakea" @click="go(`/users/${item.user.id}`)">
                    {{ item.user.name }}
                  </span>
                </ul>
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item v-if="service.review != undefined && service.review !== null">
        <v-col cols="2">
          <div class="info-label">Review</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-if="service.review.client != undefined && service.review.client !== null && Object.keys(service.review.client).length !== 0">
                <b>Client</b>
                <ul>
                  <li v-if="service.review.client.ponctuality !== undefined && service.review.client.ponctuality !== null">
                    <b>Ponctuality:</b> {{ service.review.client.ponctuality }}
                  </li>
                  <li v-if="service.review.client.payment !== undefined && service.review.client.payment !== null">
                    <b>Payment:</b> {{ service.review.client.payment }}
                  </li>
                  <li v-if="service.review.client.security !== undefined && service.review.client.security !== null">
                    <b>Security:</b> {{ service.review.client.security }}
                  </li>
                  <li v-if="service.review.client.general !== undefined && service.review.client.general !== null">
                    <b>General:</b> {{ service.review.client.general }}
                  </li>
                  <li v-if="service.review.client.karma !== undefined && service.review.client.karma !== null">
                    <b>Karma:</b> {{ service.review.client.karma }}
                  </li>
                </ul>
              </li>
              <li
                v-if="service.review.service_provider != undefined && service.review.service_provider !== null && Object.keys(service.review.service_provider).length !== 0"
              >
                <b>Service provider</b>
                <ul>
                  <li v-if="service.review.service_provider.ponctuality !== undefined && service.review.service_provider.ponctuality !== null">
                    <b>Ponctuality:</b>
                    {{ service.review.service_provider.ponctuality }}
                  </li>
                  <li v-if="service.review.service_provider.quality !== undefined && service.review.service_provider.quality !== null">
                    <b>Quality:</b>
                    {{ service.review.service_provider.quality }}
                  </li>
                  <li v-if="service.review.service_provider.security !== undefined && service.review.service_provider.security !== null">
                    <b>Security:</b>
                    {{ service.review.service_provider.security }}
                  </li>
                  <li v-if="service.review.service_provider.attendance !== undefined && service.review.service_provider.attendance !== null">
                    <b>Attendance:</b>
                    {{ service.review.service_provider.attendance }}
                  </li>
                  <li v-if="service.review.service_provider.general !== undefined && service.review.service_provider.general !== null">
                    <b>General:</b>
                    {{ service.review.service_provider.general }}
                  </li>
                  <li v-if="service.review.service_provider.comentario !== undefined && service.review.service_provider.comentario !== null">
                    <b>Comment:</b>
                    {{ service.review.service_provider.comentario }}
                  </li>
                  <li v-if="service.review.service_provider.karma !== undefined && service.review.service_provider.karma !== null">
                    <b>Karma:</b> {{ service.review.service_provider.karma }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";
import querystring from "querystring";
export default {
  props: ["id"],
  components: {
    Loading
  },
  data: () => ({
    service: {},
    barColor: "",
    status_info: [
      {
        value: -2,
        desc: "Refused",
        color: "red darken-4"
      },
      {
        value: -1,
        desc: "Canceled",
        color: "red"
      },
      {
        value: 0,
        desc: "Generated",
        color: "purple darken-3"
      },
      {
        value: 1,
        desc: "Negotiating",
        color: "#cccc00"
      },
      {
        value: 2,
        desc: "Accepted",
        color: "green"
      },
      {
        value: 3,
        desc: "Waiting for evaluation",
        color: "blue"
      },
      {
        value: 4,
        desc: "Finalized",
        color: "black"
      }
    ],
    ready: false
  }),
  async created() {
    await this.getService(this.id);
  },
  methods: {
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async getNamesInBudgetFlow() {
      for (let i = 0; i < this.service.orcamento.length; i++) {
        var user_id = this.service.orcamento[i].user;
        var proposed_by_info = await this.$request("get", "/users/" + user_id);

        this.service.orcamento[i].user = {
          id: user_id,
          name: proposed_by_info.data.name
        };
      }
    },
    async getService(serviceId) {
      try {
        var request_service = await this.$request(
          "get",
          "/services/" + serviceId
        );

        this.service = request_service.data;

        if(this.service.status !== undefined && this.service.status !== null){
          this.barColor = this.status_info.find(
            s => s.value === this.service.status
          ).color;
          this.service.status = this.status_info.find(
            s => s.value === this.service.status
          ).desc;
        } else{
          this.barColor = "#ff4dd2"
          this.service.status = "Undefined"
        }
        
        if(this.service.urgent !== undefined && this.service.urgent !== null){
          this.service.urgent = (this.service.urgent == false) ? "No" : "Yes";
        }

        if(this.service.client !== undefined && this.service.client !== null && this.service.client !== ''){
          var client_info = await this.$request(
            "get",
            "/users/" + this.service.client
          );
          this.service.client = {
            id: this.service.client,
            name: client_info.data.name
          };
        }
        if(this.service.service_provider !== undefined && this.service.service_provider !== null && this.service.service_provider !== ''){
          var service_provider_info = await this.$request(
            "get",
            "/users/" + this.service.service_provider
          );

          this.service.service_provider = {
            id: this.service.service_provider,
            name: service_provider_info.data.name
          };
        }

        if(this.service.orcamento !== undefined && this.service.orcamento.length > 0) await this.getNamesInBudgetFlow();
        this.ready = true;
      } catch (e) {
        return e;
      }
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}
.card-heading {
  font-size: x-large;
  font-weight: bold;
}
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
.fakea:hover {
  text-decoration: underline;
  cursor: pointer;
}
.fakea {
  color: #1a76d2;
}
</style>
