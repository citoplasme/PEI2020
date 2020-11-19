<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>Operations</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(item, i) in this.operacoes" :key="i">
          <v-expansion-panel-header>
            {{ item.entidade }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card-text>
              <p>{{ item.texto }}</p>
              <div>
                <v-btn
                  v-for="op in item.ops"
                  color="blue darken-4"
                  dark
                  class="ma-2"
                  @click="go(op.url)"
                  :key="op.url"
                  >{{ op.label }}</v-btn
                >
              </div>
            </v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  methods: {
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    }
  },
  data() {
    return {
      panelHeaderColor: "primary",
      operacoes: [
        {
          entidade: "Categories",
          texto: "View avaiable categories",
          ops: [
            {
              label: "View",
              url: "/categories/list"
            }
          ]
        }
      ]
    };
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
