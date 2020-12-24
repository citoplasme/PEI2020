<template>
  <v-content>
    <v-row>
      <v-col>
        <Loading v-if="!ready" :message="'the service\'s management info'" />
        <v-container fluid grid-list-md v-else>
          <v-layout row wrap>
            <v-flex
              md3
              sm6
              xs12
              full
              v-for="(stat, index) in stats"
              v-bind:key="index"
            >
              <v-hover v-slot="{ hover }">
                <v-card
                  :class="{ 'on-hover': hover }"
                  dark
                  :elevation="hover ? 12 : 2"
                  color="primary"
                >
                  <v-container fluid grid-list-sm dark>
                    <v-layout class="mt-0 mb-0 mx-0" row wrap>
                      <v-flex sm3 hidden-xs-only>
                        <v-icon class="mx-0" x-large dark>{{
                          stat.icon
                        }}</v-icon>
                      </v-flex>
                      <v-flex sm9 xs12>
                        <v-layout class="mt-0 mb-0 pa-0" row wrap>
                          <v-flex d-flex xs12>
                            <div class="silver--text subheading">
                              {{ stat.title }}
                            </div>
                          </v-flex>
                          <v-flex d-flex xs12 class="mx-4">
                            <div class="silver--text display-1">
                              {{ stat.data }}
                            </div>
                            &nbsp;&nbsp;
                            <v-btn
                              outlined
                              class="darkgrey--text darken-1"
                              v-if="stat.action.label.length > 0"
                              right
                              text
                              small
                              @click="go(stat.action.link)"
                            >
                              {{ stat.action.label }}
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-hover>
            </v-flex>
          </v-layout>
          <v-layout class="" row wrap>
            <v-flex md6 xs12>
              <v-hover v-slot="{ hover }">
                <v-card
                  light
                  :elevation="hover ? 12 : 2"
                  :class="{ 'on-hover': hover }"
                >
                  <v-container>
                    <v-card-title>Services per status</v-card-title>
                    <bar></bar>
                  </v-container>
                </v-card>
              </v-hover>
            </v-flex>
            <v-flex md6 xs12>
              <v-hover v-slot="{ hover }">
                <v-card
                  light
                  :elevation="hover ? 12 : 2"
                  :class="{ 'on-hover': hover }"
                >
                  <v-container>
                    <v-card-title>Service providers per category</v-card-title>
                    <BarSp :type="'categories'"></BarSp>
                  </v-container>
                </v-card>
              </v-hover>
            </v-flex>
            <v-flex md6 xs12>
              <v-hover v-slot="{ hover }">
                <v-card
                  light
                  :elevation="hover ? 12 : 2"
                  :class="{ 'on-hover': hover }"
                >
                  <v-container>
                    <v-card-title
                      >Service providers per specialization</v-card-title
                    >
                    <BarSp :type="'specializations'"></BarSp>
                  </v-container>
                </v-card>
              </v-hover>
            </v-flex>
            <v-flex md6 xs12>
              <v-hover v-slot="{ hover }">
                <v-card
                  light
                  :elevation="hover ? 12 : 2"
                  :class="{ 'on-hover': hover }"
                >
                  <v-container>
                    <v-card-title>Services per day of week</v-card-title>
                    <BarValor></BarValor>
                  </v-container>
                </v-card>
              </v-hover>
            </v-flex>
          </v-layout>
          <v-hover v-slot="{ hover }">
            <v-card
              light
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
            >
              <v-card-subtitle> Service providers per country</v-card-subtitle>
              <v-card-text>
                <geo-chart :data="countries"></geo-chart>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-container>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import Loading from "@/components/generic/Loading";
import Bar from "./chart/Bar";
import BarValor from "./chart/BarValor";
import BarSp from "./chart/BarSp";

export default {
  data: () => ({
    stats: [],
    ready: false,
    countries: [],
    countryColors: []
  }),
  components: {
    Loading,
    Bar,
    BarValor,
    BarSp
  },
  async mounted() {
    await this.getNumberOfServices();
    await this.usersCountByLevel();
  },
  async created() {
    await this.getInfo();
  },
  methods: {
    async getInfo() {
      let countries_info = await this.$request("get", "/countries");

      var usersByCountry = {};
      var country_name = "";

      await this.$request("get", "/services/monitoring?action=8")
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            country_name = countries_info.data.find(
              c => c._id === res.data[i].location_info[0].country
            ).name;

            if (country_name in usersByCountry)
              usersByCountry[country_name] += 1;
            else usersByCountry[country_name] = 1;
          }
          this.countries = Object.keys(usersByCountry).map(key => [
            key,
            usersByCountry[key]
          ]);
        })
        .catch(error => alert(error));

      this.ready = true;
    },
    async getNumberOfServices() {
      await this.$request("get", "/services/monitoring?action=2")
        .then(res => {
          this.stats.push({
            bgColor: "primary",
            icon: "design_services",
            title: "Services",
            data: res.data,
            action: {
              label: "",
              link: ""
            }
          });
        })
        .catch(error => alert(error));
    },
    async usersCountByLevel() {
      await this.$request("get", "/services/monitoring?action=3")
        .then(res => {
          this.stats.push({
            bgColor: "primary",
            icon: "person",
            title: "Clients",
            data: res.data.clients,
            action: {
              label: "",
              link: ""
            }
          });
          this.stats.push({
            bgColor: "primary",
            icon: "engineering",
            title: "Service_providers",
            data: res.data.service_providers,
            action: {
              label: "",
              link: ""
            }
          });
          this.stats.push({
            bgColor: "primary",
            icon: "admin_panel_settings",
            title: "Admins",
            data: res.data.admins,
            action: {
              label: "",
              link: ""
            }
          });
        })
        .catch(error => alert(error));
    },
    go(path) {
      this.$router.push(path);
    }
  }
};
</script>
