<template>
  <v-content>
    <Loading v-if="!ready" :message="'the urgent services'" />
    <v-card v-else class="ma-4">
      <v-card-title>
        <h1>Urgent requests</h1>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue darken-4" dark v-bind="attrs" v-on="on">
              New Urgent Request
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Request</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form" lazy-validation>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md12>
                        <selecionar-data
                          :dataMinima="new Date().toISOString().substr(0, 10)"
                          :d="form.date"
                          @dataSelecionada="form.date = $event"
                          :label="'AAAA-MM-DD'"
                        >
                        </selecionar-data>
                      </v-flex>
                      <v-flex xs12 sm6 md12>
                        <selecionar-hora
                          :d="form.hour"
                          @dataSelecionada="form.hour = $event"
                          :label="'HH:MM'"
                        >
                        </selecionar-hora>
                      </v-flex>
                      <v-flex xs12 sm6 md12>
                        <v-text-field
                          prepend-icon="label"
                          v-model="form.duration"
                          label="Duration"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md12>
                        <v-textarea
                          prepend-icon="description"
                          v-model="form.description"
                          label="Description"
                          auto-grow
                          solo
                          clearable
                          color="primary"
                          required
                          :rules="regraDesc"
                        ></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                type="submit"
                @click="makeService"
              >
                Send
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filter"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="services"
        :search="search"
        class="elevation-1"
        footer-props.items-per-page-options="[10, 20, 50]"
        footer-props.items-per-page-text="Show"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            No results were found for "{{ search }}" .
          </v-alert>
        </template>

        <template v-slot:item="props">
          <tr>
            <td class="subheading">{{ props.item.client }}</td>
            <td class="subheading">{{ props.item.desc }}</td>
            <td class="subheading">
              <v-chip :color="getColor(props.item.status)" dark>
                {{ number_to_status(props.item.status) }}
              </v-chip>
            </td>
            <td class="subheading">{{ props.item.date }}</td>
            <td class="subheading">{{ props.item.hour }}</td>
            <td class="subheading" align="center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="levelU >= 3 && logged !== props.item.client"
                    icon
                    v-on="on"
                    @click="accept(props.item)"
                  >
                    <v-icon medium color="green">done_outline</v-icon>
                  </v-btn>
                </template>
                <span>Accept</span>
              </v-tooltip>
              <v-tooltip bottom v-if="logged === props.item.client">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="eliminarId = props.item._id">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete request</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog :value="eliminarId != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Action Confirmation</v-card-title>
        <v-card-text>
          Are you sure that you want to delete the category?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="eliminarId = ''">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="eliminar(eliminarId)">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      :top="true"
    >
      {{ text }}
      <v-btn text @click="fecharSnackbar">Close</v-btn>
    </v-snackbar>
  </v-content>
</template>

<script>
import Loading from "@/components/generic/Loading";
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";
import SelecionarData from "@/components/generic/SelecionarData";
import SelecionarHora from "@/components/generic/SelecionarHora";

export default {
  data: () => ({
    regraNome: [v => !!v || "Name is required."],
    regraDesc: [v => !!v || "Description is required."],
    regraActive: [v => !!v || "Active label is required"],
    regraHour: [v => /\d{2}:\d{2}/.test(v) || "Hour has to be in hh:mm."],
    levelMin: NIVEL_MINIMO_ALTERAR,
    levelU: "",
    logged: "",
    search: "",
    headers: [
      {
        text: "Client",
        sortable: true,
        value: "client",
        class: "title"
      },
      {
        text: "Description",
        sortable: true,
        value: "desc",
        class: "title"
      },
      {
        text: "Status",
        sortable: true,
        value: "status",
        class: "title"
      },
      {
        text: "Date",
        sortable: true,
        value: "date",
        class: "title"
      },
      {
        text: "Hour",
        sortable: true,
        value: "hour",
        class: "title"
      },
      {
        text: "Operations",
        value: "ops"
      }
    ],
    services: [],
    dialog: false,
    dialog_edit_category: false,
    form: {
      urgent: "",
      date: "",
      hour: "",
      duration: "",
      desc: ""
    },
    snackbar: false,
    color: "",
    done: false,
    text: "",
    timeout: 4000,
    ready: true,
    eliminarId: ""
  }),
  components: {
    Loading,
    SelecionarData,
    SelecionarHora
  },
  methods: {
    number_to_status(number) {
      if (number == -2) return "Negotiation Failed";
      else if (number == -1) return "Canceled";
      else if (number == 0) return "Generated";
      else if (number == 1) return "Negotiating";
      else if (number == 2) return "Accepted";
      else if (number == 3) return "Waiting Evaluation";
      else if (number == 4) return "Finalized";
      else return "";
    },
    getColor(status) {
      var color;
      switch (status) {
        case -2:
          color = "red darken-4";
          break;
        case -1:
          color = "red";
          break;
        case 0:
          color = "purple darken-3";
          break;
        case 1:
          color = "#cc9900";
          break;
        case 2:
          color = "#cccc00";
          break;
        case 3:
          color = "green";
          break;
        case -4:
          color = "blue";
          break;
        default:
          color = "black";
          break;
      }
      return color;
    },

    async getServices() {
      try {
        let response = await this.$request("get", "/services/urgent");
        this.services = response.data;
        let level = await this.$userLevel(this.$store.state.token);
      } catch (e) {
        return e;
      }
    },
    async accept(item) {
      let data = item;
      data.service_provider = this.logged;
      data.status = "1";
      try {
        var response = await this.$request("post", "/services/", data).then(
          result => {
            this.text = result.data;
            this.dialog = false;
          }
        );
        this.color = "success";
        this.snackbar = true;
        this.done = true;
      } catch (err) {
        this.text =
          "An error occurred during the register: " + err.response.data;
        this.color = "error";
        this.snackbar = true;
        this.service = "";
        this.dialog = false;
      }
    },
    async makeService() {
      if (this.$refs.form.validate()) {
        let data = {
          urgent: true,
          status: "0",
          client: this.logged
        };

        if (
          this.$data.form.description !== undefined &&
          this.$data.form.description !== "" &&
          this.$data.form.description !== null
        ) {
          data.desc = this.$data.form.description;
        }

        if (
          this.$data.form.date !== undefined &&
          this.$data.form.date !== "" &&
          this.$data.form.date !== null
        ) {
          data.date = this.$data.form.date;
        }

        if (
          this.$data.form.hour !== undefined &&
          this.$data.form.hour !== "" &&
          this.$data.form.hour !== null
        ) {
          data.hour = this.$data.form.hour;
        }

        if (
          this.$data.form.duration !== undefined &&
          this.$data.form.duration !== "" &&
          this.$data.form.duration !== null
        ) {
          data.duration = this.$data.form.duration;
        }

        try {
          var response = await this.$request("post", "/services/", data).then(
            result => {
              this.service = "";
              this.$refs.form.reset();
              this.text = result.data;
              this.dialog = false;
            }
          );
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getServices();
        } catch (err) {
          this.text =
            "An error occurred during the register: " + err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.service = "";
          this.dialog = false;
        }
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    eliminar(id) {
      this.$request("delete", "/services/" + id)
        .then(res => {
          this.text = res.data;
          this.color = "success";
          this.eliminarId = "";
          this.snackbar = true;
          this.done = true;
          this.getServices();
        })
        .catch(err => {
          this.text = err.response;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getServices();
    }
  },
  async created() {
    try {
      if (
        this.$store.state.token !== undefined &&
        this.$store.state.token !== "" &&
        this.$store.state.token !== null
      ) {
        var res = await this.$request(
          "get",
          "/users/" + this.$store.state.token + "/token"
        );
        this.logged = res.data._id;
        this.levelU = await this.$userLevel(this.$store.state.token);
      }
      this.getServices();
      this.ready = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
