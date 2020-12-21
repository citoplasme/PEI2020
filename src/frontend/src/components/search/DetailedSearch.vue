<template>
  <Loading v-if="!dataReady" :message="'the necessary information'" />
  <v-container v-else fluid>
    <v-overlay :value="overlay">
      <Loading :message="'the necessary information'" />
    </v-overlay>
    <v-row row wrap justify-center>
      <v-col>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Detailed Search</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <div class="info-label">Categories</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  v-model="search.categories"
                  :items="categories"
                  auto-select-first
                  clearable
                  dense
                  chips
                  rounded
                  deletable-chips
                  multiple
                  label="Categories"
                  solo
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="info-label">Specializations</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  v-model="search.specializations"
                  :items="specializations"
                  auto-select-first
                  clearable
                  dense
                  chips
                  rounded
                  deletable-chips
                  multiple
                  label="Specializations"
                  solo
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="info-label">Countries</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  v-model="search.countries"
                  :items="countries"
                  auto-select-first
                  clearable
                  dense
                  chips
                  rounded
                  deletable-chips
                  multiple
                  label="Countries"
                  solo
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="info-label">Locations</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  v-model="search.locations"
                  :items="locations"
                  auto-select-first
                  clearable
                  dense
                  chips
                  rounded
                  deletable-chips
                  multiple
                  label="Locations"
                  solo
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="info-label">Type of Service Provider</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  v-model="search.level"
                  :items="level"
                  auto-select-first
                  clearable
                  dense
                  chips
                  rounded
                  deletable-chips
                  multiple
                  label="Type"
                  solo
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="cancelar">
              Cancel
            </v-btn>
            <v-btn color="primary" dark @click="pesquisar">
              Search
            </v-btn>
            <v-btn color="primary" dark @click="clear">
              Clear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Loading v-if="!results_ready" :message="'the results'" />
        <v-card v-else>
          <v-card-title class="primary white--text" dark>
            Results
            <v-spacer></v-spacer>
            <v-text-field
              v-model="pesquisa"
              append-icon="search"
              label="Filter"
              single-line
              hide-details
              dark
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="results"
              :search="pesquisa"
              class="elevation-1"
              :footer-props="footer_props"
              v-if="this.headers[this.cabecalhos.length - 1]"
            >
              <template v-slot:no-results>
                <v-alert :value="true" color="error" icon="warning"
                  >No results were found for "{{ pesquisa }}".</v-alert
                >
              </template>

              <template v-slot:item="props">
                <tr>
                  <td class="subheading">{{ props.item.name }}</td>
                  <td class="subheading">{{ props.item.email }}</td>
                  <td class="subheading">{{ props.item.karma }}</td>
                  <td class="subheading">
                    {{ props.item.servicos_realizados }}
                  </td>
                  <td class="subheading">
                    <v-tooltip bottom v-if="props.item.level <= 3">
                      <template v-slot:activator="{ on }">
                        <v-icon color="primary" v-on="on">person</v-icon>
                      </template>
                      <span>Unverified Service Provider</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else-if="props.item.level == 3.5">
                      <template v-slot:activator="{ on }">
                        <v-icon color="green darken-1" v-on="on"
                          >verified_user</v-icon
                        >
                      </template>
                      <span>Verified Service Provider</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else>
                      <template v-slot:activator="{ on }">
                        <v-icon color="amber lighten-1" v-on="on">stars</v-icon>
                      </template>
                      <span>Premium Service Provider</span>
                    </v-tooltip>
                  </td>
                  <td class="subheading">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" @click="go(props.item._id)">
                          <v-icon medium color="gray">search</v-icon>
                        </v-btn>
                      </template>
                      <span>See details</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>

              <template v-slot:pageText="props">
                Results: {{ props.pageStart }} - {{ props.pageStop }} of
                {{ props.itemsLength }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="clearResults">
              Clear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog :value="dialog_warning" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Warning</v-card-title>
        <v-card-text>
          If tou want to search using locations, please select from the
          available ones based on the country or countries selected.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_warning = false">
            Close
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
  </v-container>
</template>

<script>
import Loading from "@/components/generic/Loading";
import querystring from "querystring";
export default {
  data: () => ({
    dataReady: false,
    overlay: false,
    results_ready: true,
    search: {
      countries: [],
      locations: [],
      categories: [],
      specializations: [],
      level: []
    },
    categories: [],
    specializations: [],
    countries: [],
    locations: [],
    level: [
      {
        text: "Unverified",
        value: 3
      },
      {
        text: "Verified",
        value: 3.5
      },
      {
        text: "Premium",
        value: 4
      }
    ],
    results: [],
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Show"
    },
    pesquisa: "",
    headers: [],
    cabecalhos: [],
    campos: [],
    snackbar: false,
    text: "",
    color: "",
    timeout: 4000,
    dialog_warning: false
  }),
  components: {
    Loading
  },
  watch: {
    "search.countries": function(new_val) {
      this.load_locations(new_val);
    },
    "search.categories": function(new_val) {
      this.load_specialziations(new_val);
    }
  },
  methods: {
    // Specialziations
    async load_specialziations(cats) {
      // Iniciar loading
      this.overlay = true;
      // Caso não haja categories selecionadas
      if (cats == [] || cats == null || cats == undefined || cats == "") {
        this.specializations = [];
        this.search.specializations = [];
      }
      // Caso haja categorias selecionadas
      else {
        // GET Locations na BD
        let locs = await this.get_specialziations(cats);
        // Converter para array de text/value
        this.specializations = await this.preparaCampos(locs);
        // Ficar só com ids para limpar lista
        let possible_locs = this.specializations.map(x => x.value);
        // Limpar selecionadas que não estejam na lista de possibilidades
        this.search.specializations = this.search.specializations.filter(id =>
          possible_locs.includes(id)
        );
      }
      // Parar o loading
      this.overlay = false;
    },
    async get_specialziations(paises) {
      try {
        let qs = this.filter_query_string_specs(paises);
        let queryS = qs === "" ? "" : "?" + qs;
        var response = await this.$request("get", "/specializations/" + queryS);
        return response.data;
      } catch (e) {
        return e;
      }
    },
    filter_query_string_specs(ids) {
      let obj = {
        category: ids
      };
      let new_qs = querystring.stringify(obj);
      return new_qs;
    },
    // Locations
    async load_locations(paises) {
      // Iniciar loading
      this.overlay = true;
      // Caso não haja paises selecionadas
      if (
        paises == [] ||
        paises == null ||
        paises == undefined ||
        paises == ""
      ) {
        this.locations = [];
        this.search.locations = [];
      }
      // Caso haja paises selecionadas
      else {
        // GET Locations na BD
        let locs = await this.get_locations(paises);
        // Converter para array de text/value
        this.locations = await this.preparaCampos(locs);
        // Ficar só com ids para limpar lista
        let possible_locs = this.locations.map(x => x.value);
        // Limpar selecionadas que não estejam na lista de possibilidades
        this.search.locations = this.search.locations.filter(id =>
          possible_locs.includes(id)
        );
      }
      // Parar o loading
      this.overlay = false;
    },
    async get_locations(paises) {
      try {
        let qs = this.filter_query_string_locs(paises);
        let queryS = qs === "" ? "" : "?" + qs;
        var response = await this.$request("get", "/locations/" + queryS);
        return response.data;
      } catch (e) {
        return e;
      }
    },
    filter_query_string_locs(ids) {
      let obj = {
        country: ids
      };
      let new_qs = querystring.stringify(obj);
      return new_qs;
    },
    // Actions
    cancelar() {
      this.$router.push("/");
    },
    clear() {
      this.search.countries = [];
      this.search.locations = [];
      this.search.categories = [];
      this.search.specializations = [];
      this.search.level = [];
    },
    clearResults() {
      this.results = [];
      this.pesquisa = "";
    },
    // Get response
    async getServiceProviders(query) {
      try {
        let queryS = query === "" ? "" : "?" + query;
        let response = await this.$request(
          "get",
          "/users/service_providers/" + queryS
        );
        // Crop do karma a uma casa decimal
        let aux = response.data;

        this.results = aux.map(p => {
          p.karma = p.karma.toFixed(1);
          return p;
        });
      } catch (e) {
        return e;
      }
    },
    rename_before_request(o) {
      let copy = {};
      copy.categorias = o.categories;
      copy.subcategorias = o.specializations;
      copy.locations = o.locations;
      copy.level = o.level;
      return copy;
    },
    clean_qs(myObj) {
      Object.keys(myObj).forEach(
        key =>
          (myObj[key] == null || myObj[key] == [] || myObj[key] == "") &&
          delete myObj[key]
      );
      return myObj;
    },
    filter_query_string(qs) {
      let qs2 = this.clean_qs(qs);
      let new_qs = querystring.stringify(qs2);
      return new_qs;
    },
    async pesquisar() {
      // caso tenha countries e não localizações, dialog é ativado
      if (
        this.search.countries !== null &&
        this.search.countries !== undefined &&
        this.search.countries != "" &&
        this.search.countries != [] &&
        (this.search.locations == null ||
          this.search.locations == undefined ||
          this.search.locations == "" ||
          this.search.locations == [])
      ) {
        this.dialog_warning = true;
      }
      // Tudo preenchido devidamente
      else {
        this.results_ready = false;
        let q = this.rename_before_request(this.search);
        //delete q.countries;
        let query = this.filter_query_string(q);
        await this.getServiceProviders(query);
        this.results_ready = true;
      }
    },
    preparaCabecalhos() {
      this.cabecalhos = [
        "Name",
        "Email",
        "Karma",
        "Number of Services",
        "Type",
        "Operations"
      ];
      this.campos = ["name", "email", "karma", "servicos_realizados", "level"];
      for (let i = 0; i < this.cabecalhos.length; i++) {
        this.headers[i] = {
          text: this.cabecalhos[i],
          value: this.campos[i],
          class: ["table-header", "subtitle-2", "font-weight-bold"]
        };
      }
    },
    go(id) {
      this.$router.push("/users/" + id);
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    preparaCampos: async function(array) {
      try {
        let res = array.map(v => {
          return {
            text: v.name,
            value: v._id
          };
        });
        return res;
      } catch (e) {
        return [];
      }
    }
  },
  created: async function() {
    this.preparaCabecalhos();

    let response = await this.$request("get", "/categories?active=true");
    this.categories = await this.preparaCampos(response.data);

    //let r2 = await this.$request("get", "/specializations?active=true");
    //this.specializations = await this.preparaCampos(r2.data);

    let r3 = await this.$request("get", "/countries");
    this.countries = await this.preparaCampos(r3.data);

    this.dataReady = true;
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
</style>
