<template>
  <Loading v-if="!ready" :message="'the profile'" />
  <v-card v-else class="mx-auto" max-width="1000" tile>
    <v-row class="mx-auto">
      <v-list-item>
        <v-list-item-avatar size="250">
          <v-img
            v-if="
              user.photo !== undefined &&
                user.photo.content !== undefined &&
                user.photo.extension !== undefined
            "
            :src="
              `data:image/${user.photo.extension};base64,${user.photo.content}`
            "
            style="width:100%; height:100%;"
          />
          <v-img
            v-else
            style="width:100%; height:100%;"
            :src="require('@/assets/default_user.png')"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ user.name }}
            <v-icon v-if="user.level == 3.5" color="primary"
              >verified_user</v-icon
            >
            <v-icon v-else-if="user.level == 4" color="amber lighten-1"
              >stars</v-icon
            >
          </v-list-item-title>
          <v-list-item-subtitle>
            <a :href="`mailto:${user.email}`">
              {{ user.email }}
            </a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-row>
    <v-list>
      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.categorias &&
            user.categorias.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Categories</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.categorias" :key="item._id">
                <span class="fakea" @click="go(`/categories/${item._id}`)">{{
                  item.name
                }}</span>
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.subcategorias &&
            user.subcategorias.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Specializations</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.subcategorias" :key="item._id">
                <span
                  class="fakea"
                  @click="go(`/serviceProviders/?subcategorias=${item._id}`)"
                  >{{ item.name }}</span
                >
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.locations &&
            user.locations.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Locations</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.locations" :key="item._id">
                <span
                  class="fakea"
                  @click="go(`/serviceProviders/?locations=${item._id}`)"
                  >{{ item.name }}</span
                >
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item>
        <v-col cols="2">
          <div class="info-label">Karma</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ user.karma }}</p>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item>
        <v-col cols="2">
          <div class="info-label">Completed Services</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ user.servicos_realizados }}</p>
          </div>
        </v-col>
      </v-list-item>
    </v-list>
    <v-card-actions v-if="user.level >= 3 && user.level <= 4">
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            color="blue darken-1"
            text
            type="submit"
            @click="service = user._id"
            v-on="on"
          >
            <v-icon> touch_app </v-icon>
          </v-btn>
        </template>
        <span>Send Request</span>
      </v-tooltip>
    </v-card-actions>

    <v-dialog :value="service != ''" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Request Service</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formPost" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-select
                    :items="['Yes', 'No']"
                    :rules="regraTipo"
                    prepend-icon="warning"
                    v-model="form.urgent"
                    label="Urgent"
                    required
                  >
                  </v-select>
                </v-flex>
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
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="service = ''">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="makeService(service)"
            >Request</v-btn
          >
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
import querystring from "querystring";

import SelecionarData from "@/components/generic/SelecionarData.vue";
import SelecionarHora from "@/components/generic/SelecionarHora";

export default {
  props: ["id"],
  components: {
    Loading,
    SelecionarData,
    SelecionarHora
  },
  data: () => ({
    regraTipo: [v => !!v || "Type is required."],
    form: {
      urgent: "",
      service_provider: "",
      date: "",
      hour: "",
      duration: "",
      desc: ""
    },
    user: {},
    panelHeaderColor: "primary",
    dialog: false,
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
    ready: false,
    categories: [],
    specializations: [],
    service: ""
  }),
  async created() {
    await this.getUser();

    await this.getCategories();

    await this.getSpecializations();

    await this.merge_fileds();

    await this.getLocations();

    this.ready = true;
  },
  methods: {
    filter_query_string(ids) {
      let obj = {
        _id: ids
      };
      let new_qs = querystring.stringify(obj);
      return new_qs;
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async merge_fileds() {
      try {
        // Merge
        let cats = this.user.categorias.map(c => {
          return this.categories.find(obj => obj._id === c);
        });
        // FILTRAR ACTIVES
        cats = cats.filter(c => c.active == true);

        // Merge
        let specs = this.user.subcategorias.map(sc => {
          return this.specializations.find(obj => obj._id === sc);
        });
        // FILTRAR ACTIVES
        specs = specs.filter(c => c.active == true);

        this.user.categorias = cats;
        this.user.subcategorias = specs;
      } catch (e) {
        return e;
      }
    },
    async getUser() {
      try {
        var response = await this.$request("get", "/users/" + this.id);
        this.user = response.data;
      } catch (e) {
        return e;
      }
    },
    async getLocations() {
      try {
        if (this.user.locations && this.user.locations.length > 0) {
          let qs = this.filter_query_string(this.user.locations);
          let queryS = qs === "" ? "" : "?" + qs;
          var response = await this.$request("get", "/locations/" + queryS);
          let specs = this.user.locations.map(sc => {
            return response.data.find(obj => obj._id === sc);
          });
          this.user.locations = specs;
        }
      } catch (e) {
        return e;
      }
    },
    async getCategories() {
      try {
        var response = await this.$request("get", "/categories/");
        this.categories = response.data;
      } catch (e) {
        return e;
      }
    },
    async getSpecializations() {
      try {
        var response = await this.$request("get", "/specializations/");
        this.specializations = response.data;
      } catch (e) {
        return e;
      }
    },
    async makeService(id) {
      if (this.$refs.formPost.validate()) {
        let data = {
          status: "1",
          client: this.user._id,
          service_provider: id
        };

        if (this.form.urgent == "Yes") data.urgent = true;
        else if (this.form.urgent == "No") data.urgent = "false";

        if (
          this.form.description !== undefined &&
          this.form.description !== "" &&
          this.form.description !== null
        ) {
          data.desc = this.form.description;
        }

        if (
          this.form.date !== undefined &&
          this.form.date !== "" &&
          this.form.date !== null
        ) {
          data.date = this.form.date;
        }

        if (
          this.form.hour !== undefined &&
          this.form.hour !== "" &&
          this.form.hour !== null
        ) {
          data.hour = this.form.hour;
        }

        if (
          this.form.duration !== undefined &&
          this.form.duration !== "" &&
          this.form.duration !== null
        ) {
          data.duration = this.form.duration;
        }

        try {
          var response = await this.$request("post", "/services/", data).then(
            result => {
              this.service = "";
              this.text = result.data;
              this.color = "success";
              this.snackbar = true;
              this.done = true;
              this.$refs.formPost.reset();
            }
          );
        } catch (err) {
          this.text =
            "An error occurred during the register: " + err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.service = "";
        }
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
      //if (this.done == true) this.getServices();
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
  border-radius: 10px;
  box-shadow: -1px 1px #77aaff, -2px 2px #77aaff, -3px 3px #77aaff,
    -4px 4px #77aaff, -5px 5px #77aaff;
}
.fakea:hover {
  text-decoration: underline;
  cursor: pointer;
}
.fakea {
  color: #1a76d2;
}
</style>
