<template>
  <div>
    <Loading v-if="!categoriasReady" :message="'categories'" />
    <v-card v-else class="ma-4 pa-2">
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title>Detailed Search</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="3">
            <div class="info-label">Categories</div>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="searchString"
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
        <v-row align="center">
          <v-col cols="3">
            <div class="info-label">Specializations</div>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="searchString2"
              :items="subcategories"
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
        <v-row v-for="(item, i) in this.operacoes" :key="i">
          <v-card-text>
            <div>
              <v-btn
                v-for="op in item.ops"
                color="primary"
                dark
                class="ma-2"
                @click="go(op.url)"
                :key="op.url"
              >
                Search
              </v-btn>
            </div>
          </v-card-text>
        </v-row>
      </v-container>
    </v-card>  
  </div>
</template>
<script>
import Loading from "@/components/generic/Loading";
import querystring from "querystring";
export default {
  data: () => ({
    categories: [],
    subcategories: [],
    categoriasReady: false,
    panelHeaderColor: "primary",
    searchString: [],
    searchString2: [],
    operacoes: [
      {
        entidade: "Search",
        ops: [
          {
            label: "search",
            url: "/serviceProviders"
          }
        ]
      }
    ]
  }),
  components: {
    Loading
  },
  methods: {
    filter_query_string(qs) {
      let new_qs = querystring.stringify(qs);
      return new_qs;
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
    },
    go: function(url) {
      let query = {};
      if (this.searchString.length > 0) {
        query.categorias = this.searchString;
      }

      if (this.searchString2.length > 0) {
        query.subcategorias = this.searchString2;
      }

      let qs = this.filter_query_string(query);
      let queryS = qs === "" ? "" : "?" + qs;
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url + queryS);
      }
    }
  },
  created: async function() {
    try {
      let response = await this.$request("get", "/categories?active=true");
      this.categories = await this.preparaCampos(response.data);

      let r2 = await this.$request("get", "/specializations?active=true");
      this.subcategories = await this.preparaCampos(r2.data);

      this.categoriasReady = true;
    } catch (e) {
      return e;
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
</style>
