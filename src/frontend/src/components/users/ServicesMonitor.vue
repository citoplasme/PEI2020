<template>
  <v-content>
    <v-row>
      <v-col>
        <Loading
          v-if="!ready"
          :message="'the user\'s services management info'"
        />
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
                    <bar :type="'services_by_status'"></bar>
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
                    <bar :type="'days_of_week'"></bar>
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
                    <v-card-title>Services per month</v-card-title>
                    <bar :type="'months'"></bar>
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
                    <v-card-title>Services per year</v-card-title>
                    <bar :type="'years'"></bar>
                  </v-container>
                </v-card>
              </v-hover>
            </v-flex>

          </v-layout>
        </v-container>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import Loading from "@/components/generic/Loading";
import Bar from "./chart/Bar";
//import { GChart } from 'vue-google-charts'

export default {
  data: () => ({
    stats: [],
    ready: false,
    userId: -1
  }),
  components: {
    Loading,
    Bar/*,
    GChart*/
  },
  async mounted() {
    await this.getNumberOfServices();
    await this.getClientsBySP();
  },
  methods: {
    async getNumberOfServices() {
      var res = await this.$request(
        "get",
        "/users/" + this.$store.state.token + "/token"
      );

      this.userId = res.data._id;

      await this.$request(
        "get",
        "/services/monitoringByUser?idUser=" + this.userId + "&action=2"
      )
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
    async getClientsBySP() {
      await this.$request(
        "get",
        "/services/monitoringByUser?idUser=" + this.userId + "&action=6"
      )
        .then(res => {
          this.stats.push({
            bgColor: "primary",
            icon: "person",
            title: "Clients",
            data: res.data,
            action: {
              label: "",
              link: ""
            }
          });
          this.ready = true;
        })
        .catch(error => alert(error));
    }
  }
};
</script>
