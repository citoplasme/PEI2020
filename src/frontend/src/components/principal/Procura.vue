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
            label: "pesquisar",
            url: "/users/pesquisa"
          }
        ]
      }
    ]
  }),
  components: {
    Loading
  },
  methods: {
    go: function(url) {
      let query = [];
      if (this.searchString.length > 0) {
        query = this.searchString;
      } else {
        query = ["all"];
      }
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push({ path: url, query: query });
      }
    }
  },
  created: async function() {
    try {
      let response = await this.$request("get", "/categories");
      let categorias = [];
      for (let i = 0; i < response.data.length; i++) {
        categorias.push(response.data[i].name);
      }
      this.categories = categorias;
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
