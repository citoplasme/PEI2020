<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>What is Servicify</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>The Platform</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <p>
                  <b>Servicify</b> is a platform developed to help people find
                  the best service providers.
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
      panelHeaderColor: "primary"
    };
  }
};
</script>
