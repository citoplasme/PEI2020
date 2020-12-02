<template>
  <div>
    <v-card>
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title> Searching for: {{ this.oldsearch }} </v-toolbar-title>
      </v-toolbar>
    </v-card>
    <Loading v-if="!categoriasReady" :message="'categories'" />
    <v-card v-else>
      <v-container fluid>
        <v-row align="center" v-for="(item, i) in this.operacoes" :key="i">
          <v-col cols="10">
            <v-autocomplete
              v-model="searchString"
              :append-outer-icon="search ? 'search' : 'search'"
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
              v-for="op in item.ops"
              @click:append-outer="go(op.url)"
              :key="op.url"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import Loading from "@/components/generic/Loading";
export default {
  created() {
    this.created();
  },
  data: () => ({
    categories: [],
    panelHeaderColor: "primary",
    categoriasReady: false,
    oldsearchString: [],
    searchString: [],
    oldsearch: "",
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
    reloadPage() {
      window.location.reload();
    },
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
        this.reloadPage();
      }
    },
    created: async function() {
      this.oldsearchString = this.$route.query;
      let tam = 0;
      for (let i = 0; this.oldsearchString[i] != null; i++) tam = i;
      if (tam == 0) this.oldsearch = this.oldsearchString[0];
      else {
        let aux = "";
        for (let i = 0; i <= tam; i++) {
          aux = aux + ", " + this.oldsearchString[i];
        }
        this.oldsearch = aux.slice(2);
      }
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
