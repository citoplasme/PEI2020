<template>
  <Loading v-if="!ready" :message="'the service'" />
  <v-card v-else class="mx-auto my-4" max-width="1000" tile>
    <div>
      <v-system-bar height="30%" dark :color="barColor">
        <span>{{ displayed_service.status }}</span>
      </v-system-bar>
    </div>
    <v-list>
      <v-list-item
        v-if="
          displayed_service.desc !== undefined &&
            displayed_service.desc !== null &&
            displayed_service.desc !== ''
        "
      >
        <v-col cols="2">
          <div class="info-label">Description</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ displayed_service.desc }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="displayed_service.urgent != undefined && displayed_service.urgent !== null"
      >
        <v-col cols="2">
          <div class="info-label">Urgent</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ displayed_service.urgent }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="
          displayed_service.client != undefined &&
            displayed_service.client !== null &&
            displayed_service.client !== ''
        "
      >
        <v-col cols="2">
          <div class="info-label">Client</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <span class="fakea" @click="go(`/users/${displayed_service.client.id}`)">{{
              displayed_service.client.name
            }}</span>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="
          displayed_service.service_provider != undefined &&
            displayed_service.service_provider !== null &&
            displayed_service.service_provider !== ''
        "
      >
        <v-col cols="2">
          <div class="info-label">Service provider</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <span
              class="fakea"
              @click="go(`/users/${displayed_service.service_provider.id}`)"
              >{{ displayed_service.service_provider.name }}</span
            >
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="
          displayed_service.duration != undefined &&
            displayed_service.duration !== null &&
            displayed_service.duration !== ''
        "
      >
        <v-col cols="2">
          <div class="info-label">Duration</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ displayed_service.duration }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="
          displayed_service.date != undefined &&
            displayed_service.date !== null &&
            displayed_service.date !== ''
        "
      >
        <v-col cols="2">
          <div class="info-label">Date</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ displayed_service.date }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="
          displayed_service.hour != undefined &&
            displayed_service.hour !== null &&
            displayed_service.hour !== ''
        "
      >
        <v-col cols="2">
          <div class="info-label">Hour</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ displayed_service.hour }}</p>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="displayed_service.orcamento !== undefined && displayed_service.orcamento.length > 0"
      >
        <v-col cols="2">
          <div class="info-label">Budget flow</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in displayed_service.orcamento" :key="item._id">
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
      <v-list-item
        v-if="
          displayed_service.review !== undefined &&
            displayed_service.review !== null &&
            (Object.keys(displayed_service.review.client).length >= 0 ||
              Object.keys(displayed_service.review.service_provider).length >= 0)
        "
      >
        <v-col cols="2">
          <div class="info-label">Review</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li
                v-if="
                  displayed_service.review.client !== undefined &&
                    displayed_service.review.client !== null &&
                    Object.keys(displayed_service.review.client).length >= 0
                "
              >
                <b>Client:</b>
                <ul>
                  <li
                    v-if="
                      displayed_service.review.client.ponctuality !== undefined &&
                        displayed_service.review.client.ponctuality !== null
                    "
                  >
                    <b>Ponctuality:</b> {{ displayed_service.review.client.ponctuality }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.client.payment !== undefined &&
                        displayed_service.review.client.payment !== null
                    "
                  >
                    <b>Payment:</b> {{ displayed_service.review.client.payment }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.client.security !== undefined &&
                        displayed_service.review.client.security !== null
                    "
                  >
                    <b>Security:</b> {{ displayed_service.review.client.security }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.client.general !== undefined &&
                        displayed_service.review.client.general !== null
                    "
                  >
                    <b>General:</b> {{ displayed_service.review.client.general }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.client.karma !== undefined &&
                        displayed_service.review.client.karma !== null
                    "
                  >
                    <b>Karma:</b> {{ displayed_service.review.client.karma }}
                  </li>
                </ul>
              </li>
              <li
                v-if="
                  displayed_service.review.service_provider !== undefined &&
                    displayed_service.review.service_provider !== null &&
                    Object.keys(displayed_service.review.service_provider).length >= 0
                "
              >
                <b>Service provider:</b>
                <ul>
                  <li
                    v-if="
                      displayed_service.review.service_provider.ponctuality !==
                        undefined &&
                        displayed_service.review.service_provider.ponctuality !== null
                    "
                  >
                    <b>Ponctuality:</b>
                    {{ displayed_service.review.service_provider.ponctuality }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.service_provider.quality !== undefined &&
                        displayed_service.review.service_provider.quality !== null
                    "
                  >
                    <b>Quality:</b>
                    {{ displayed_service.review.service_provider.quality }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.service_provider.security !== undefined &&
                        displayed_service.review.service_provider.security !== null
                    "
                  >
                    <b>Security:</b>
                    {{ displayed_service.review.service_provider.security }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.service_provider.attendance !==
                        undefined &&
                        displayed_service.review.service_provider.attendance !== null
                    "
                  >
                    <b>Attendance:</b>
                    {{ displayed_service.review.service_provider.attendance }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.service_provider.general !== undefined &&
                        displayed_service.review.service_provider.general !== null
                    "
                  >
                    <b>General:</b>
                    {{ displayed_service.review.service_provider.general }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.service_provider.comentario !==
                        undefined &&
                        displayed_service.review.service_provider.comentario !== null
                    "
                  >
                    <b>Comment:</b>
                    {{ displayed_service.review.service_provider.comentario }}
                  </li>
                  <li
                    v-if="
                      displayed_service.review.service_provider.karma !== undefined &&
                        displayed_service.review.service_provider.karma !== null
                    "
                  >
                    <b>Karma:</b> {{ displayed_service.review.service_provider.karma }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>
      <v-list-item
        v-if="displayed_service.fatura != undefined && displayed_service.fatura !== null"
      >
        <v-col cols="2">
          <div class="info-label">Bill</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p @click="get_fatura()">
              <v-btn icon color="primary">
                <v-icon text>
                  search
                </v-icon>
              </v-btn>
            </p>
          </div>
        </v-col>
      </v-list-item>
    </v-list>
    <v-col class="text-right">
      <v-tooltip
        bottom
        v-if="
          displayed_service.client.id == idLoged &&
            (displayed_service.status == 'Generated' ||
              displayed_service.status == 'Negotiating')
        "
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="editar_servico(displayed_service)"
            color="primary"
            class="mr-1"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
        <span>Edit Service</span>
      </v-tooltip>
      <v-tooltip
        bottom
        v-if="
          displayed_service.service_provider.id == idLoged &&
            (displayed_service.status == 'Waiting for evaluation' ||
              displayed_service.status == 'Finalized')
        "
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="editar_imagem()"
            color="primary"
            class="mr-1"
          >
            <v-icon medium>attach_file</v-icon>
          </v-btn>
        </template>
        <span>Edit Bill</span>
      </v-tooltip>
      <v-tooltip
        bottom
        v-if="
          displayed_service.status == 'Negotiating' ||
            displayed_service.status == 'Accepted' ||
            displayed_service.status == 'Waiting for evaluation'
        "
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="go('/services/biding/' + displayed_service._id)"
            color="primary"
            class="mr-1"
          >
            <v-icon medium>attach_money</v-icon>
          </v-btn>
        </template>
        <span>Negociate</span>
      </v-tooltip>
    </v-col>
    <v-dialog v-model="dialog_service" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit Service</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form_service" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-textarea
                    prepend-icon="description"
                    v-model="editedService.desc"
                    label="Description"
                    auto-grow
                    solo
                    clearable
                    color="indigo"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <selecionar-data
                    :dataMinima="new Date(new Date().setTime( new Date().getTime() + 1 * 86400000 )).toISOString().substr(0, 10)"
                    :d="editedService.date"
                    @dataSelecionada="editedService.date = $event"
                    :label="'AAAA-MM-DD'"
                  >
                  </selecionar-data>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <selecionar-hora
                    :d="editedService.hour"
                    @dataSelecionada="editedService.hour = $event"
                    :label="'HH:MM'"
                  >
                  </selecionar-hora>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="label"
                    v-model="editedService.duration"
                    label="Service's duration"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select
                    :items="['Yes', 'No']"
                    :rules="regraTipo"
                    prepend-icon="warning"
                    v-model="editedService.urgent"
                    label="Urgent"
                    required
                  >
                  </v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_service = false">Cancel</v-btn>
          <v-btn color="primary" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_image" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit Bill</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form_image" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-file-input
                    v-model="ficheiro"
                    placeholder="Select the file"
                    show-size
                    clearable
                    single-line
                    accept="application/pdf"
                    solo
                    :rules="regraImagem"
                    required
                  ></v-file-input>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_image = false">Cancel</v-btn>
          <v-btn color="primary" text @click="guardar_image">Save</v-btn>
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
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";
import SelecionarData from "../generic/SelecionarData.vue";
import SelecionarHora from "../generic/SelecionarHora";
import querystring from "querystring";
const lhost = require("@/config/global").host;
export default {
  props: ["id"],
  components: {
    Loading,
    SelecionarData,
    SelecionarHora
  },
  data: () => ({
    ficheiro: {},
    dialog_image: false,
    dialog_service: false,
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
    regraImagem: [v => !!v || "File is required."],
    service: {},
    original_service: {},
    displayed_service: {},
    barColor: "",
    idLoged: "",
    regraTipo: [v => !!v || "Type is required."],
    color: "",
    text: "",
    snackbar: false,
    done: false,
    editedService: {
      _id: "",
      desc: "",
      date: "",
      hour: "",
      duration: "",
      review: {},
      status: "",
      urgent: ""
    },
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
    var res2 = await this.$request(
      "get",
      "/users/" + this.$store.state.token + "/token"
    );
    this.idLoged = res2.data._id;

    await this.getService(this.id);
  },
  methods: {
    fecharSnackbar() {
      this.snackbar = false;
    },
    async guardar_image() {
      if (this.$refs.form_image.validate()) {
        var formData = new FormData();

        if (this.ficheiro != null) {
          formData.append("file", this.ficheiro);
        }
        await this.$request("put", "/services/" + this.id + "/bill", formData)
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog_image = false;
            this.getService(this.id);
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    editar_imagem() {
      this.dialog_image = true;
    },
    editar_servico(item) {
      this.editedService = Object.assign({}, item);
      this.dialog_service = true;
    },
    async get_fatura() {
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      var path = "/services/" + this.id + "/bill/";
      path = lhost + path + "?" + token;
      window.open(path);
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async fix_parametros_servico(service_info) {
        this.displayed_service = Object.assign({}, service_info)
        if (this.displayed_service.status !== undefined && this.displayed_service.status !== null) {
          this.barColor = this.status_info.find(
            s => s.value === this.displayed_service.status
          ).color;
          this.displayed_service.status = this.status_info.find(
            s => s.value === this.displayed_service.status
          ).desc;
        } else {
          this.barColor = "#ff4dd2";
          this.displayed_service.status = "Undefined";
        }

        if (this.displayed_service.urgent !== undefined && this.displayed_service.urgent !== null) {
          this.displayed_service.urgent = this.displayed_service.urgent == false ? "No" : "Yes";
        }

        if (
          this.displayed_service.client !== undefined &&
          this.displayed_service.client !== null &&
          this.displayed_service.client !== ""
        ) {
          var client_info = await this.$request(
            "get",
            "/users/" + this.displayed_service.client
          );
          this.displayed_service.client = {
            id: this.displayed_service.client,
            name: client_info.data.name
          };
        }
        if (
          this.displayed_service.service_provider !== undefined &&
          this.displayed_service.service_provider !== null &&
          this.displayed_service.service_provider !== ""
        ) {
          var service_provider_info = await this.$request(
            "get",
            "/users/" + this.displayed_service.service_provider
          );

          this.displayed_service.service_provider = {
            id: this.displayed_service.service_provider,
            name: service_provider_info.data.name
          };
        }

        if (
          this.displayed_service.orcamento !== undefined &&
          this.displayed_service.orcamento.length > 0
        )
        await this.getNamesInBudgetFlow();
    },
    async save() {
      if (this.$refs.form_service.validate()) {
        var parsedUrgent;

        switch (this.editedService.urgent) {
          case "Yes":
            parsedUrgent = true;
            break;
          case "No":
            parsedUrgent = false;
            break;
        }

        var object_to_send = {
          date: this.editedService.date,
          hour: this.editedService.hour,
          duration: this.editedService.duration,
          review: this.original_service.review,
          status: this.original_service.status,
          urgent: (parsedUrgent == false) ? "false" : parsedUrgent,
          orcamento: this.original_service.orcamento,
          client: this.original_service.client,
          service_provider: this.original_service.service_provider
        }

        if (this.editedService.desc !== null){
          object_to_send.desc = this.editedService.desc
        }

        await this.$request(
          "put",
          "/services/" + this.id,
          object_to_send
        )
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog_service = false;
            this.getService(this.id)
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    async getNamesInBudgetFlow() {
      for (let i = 0; i < this.displayed_service.orcamento.length; i++) {
        var user_id = this.displayed_service.orcamento[i].user;
        var proposed_by_info = await this.$request("get", "/users/" + user_id);

        this.displayed_service.orcamento[i].user = {
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
        this.original_service = request_service.data;

        await this.fix_parametros_servico(this.original_service)

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
