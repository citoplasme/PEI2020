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
            <v-card-text>
              <p style="text-align: justify; text-justify: inter-word;">
                <b>Servicify</b> is a platform developed to help people find the
                best service providers, taking in consideration their
                preferences and needs. Differing from the remaining platforms in
                the market, Servicify uses end-to-end multi-field reviews to
                verify the service and to extract more information from it.
                Moreover, the category and specialization system is completely
                dynamic, meaning that every service provider is free to submit
                requests to add their fields of work to the system. By doing
                this, Servicify is not limited to a small group of specific
                jobs, being in constant growth. Lastly, in order to be the most
                user-friendly possible, the platform is free to use, freeing
                every aspect of it by creating an account. However, it is
                important to notice that, if a service provider prefers to
                increase their exposure, they can upgrade their account to
                premium and access some metrics about their services.
              </p>
            </v-card-text>
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
