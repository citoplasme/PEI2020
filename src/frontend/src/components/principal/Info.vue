<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>What is the Authentication Template</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header
            >The Authentication Template</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <p>
                  The <b>Authentication Template</b> is a platform developed in
                  order to have a simple app with authetication using email and
                  password. Besides this, it allows multilevel access operations
                  and platform management.
                </p>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      panelHeaderColor: "indigo darken-4"
    };
  }
};
</script>
