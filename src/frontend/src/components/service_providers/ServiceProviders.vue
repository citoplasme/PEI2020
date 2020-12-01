<template>
  <Loading v-if="!ready" :message="'the service providers'" />
  <v-container v-else fluid>
    <h2>Service Providers</h2>
    <h5 v-if="service_providers.length == 0">
      No results found
    </h5>
    <v-data-iterator
      :items="service_providers"
      :items-per-page.sync="itemsPerPage"
      hide-default-footer
      v-else
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item._id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <img style="width:100%; height:100%;" src="@/assets/default_user.png" />
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text type="submit">
                  See info
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import Loading from "@/components/generic/Loading";

export default {
  props: ["subcategoryId"],
  components: {
    Loading
  },
  data: () => ({
    service_providers: [],
    itemsPerPage: 20,
    ready: false
  }),
  methods: {
    async getServiceProviders() {
      try {
        let response = await this.$request("get", "/users/service_providers/");
        this.service_providers = response.data;
      } catch (e) {
        return e;
      }
    }
  },
  async created() {
    try {
      await this.getServiceProviders();
      this.ready = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
