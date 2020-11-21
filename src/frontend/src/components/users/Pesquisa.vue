<!--Falta os resultados e a cena da paginação a funcionar direito -->
<template>
  <v-card>
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>Teste</v-toolbar-title>
    </v-toolbar>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      panelHeaderColor: "primary"
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
