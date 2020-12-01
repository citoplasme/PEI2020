<template>
  <div>
    <Loading v-if="!categoriasReady" :message="'categories'" />
    <v-card v-else class="ma-4 pa-2">
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title>Search by Category</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="10">
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
              label="Example: Arts"
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
    categoriasReady: false,
    panelHeaderColor: "primary",
    searchString: [],
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
</style>
