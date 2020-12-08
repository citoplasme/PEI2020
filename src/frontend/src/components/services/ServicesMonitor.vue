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
              <v-card :class="stat.bgColor" dark>
                <v-container fluid grid-list-sm dark>
                  <v-layout class="mt-0 mb-0 mx-0" row wrap>
                    <v-flex sm3 hidden-xs-only>
                      <v-icon class="mx-0" x-large dark>{{ stat.icon }}</v-icon>
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
            </v-flex>
          </v-layout>
          <v-layout class="" row wrap>
            <v-flex md6 xs12>
              <v-card light>
                <v-container>
                  <bar></bar>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-col>
      <v-col>
        <v-container fluid grid-list-md>
          <v-layout class="" row wrap>
            <v-flex md6 xs12>
              <v-card light>
                <v-container>
                  <BarValor></BarValor>
                </v-container>
              </v-card>
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
import BarValor from "./chart/BarValor";

export default {
  data: () => ({
    stats: [],
    valorizacao: [],
    valores: [],
    totalServices: [],
    number_of_services: -1,
    ready: false
  }),
  components: {
    Loading,
    Bar,
    BarValor
  },
  mounted() {
    this.getNumberOfServices();
  },
  methods: {
    async getNumberOfServices() {
      await this.$request("get", "/services/monitoring?action=total")
        .then(res => {
          this.number_of_services = res.data;
          this.stats.push({
            bgColor: "primary",
            icon: "person",
            title: "Services",
            data: res.data,
            action: {
              label: "",
              link: ""
            }
          });
          this.ready = true;
        })
        .catch(error => alert(error));
    },
    go(path) {
      this.$router.push(path);
    }
  }
};
</script>
