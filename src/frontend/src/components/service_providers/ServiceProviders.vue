<template>
  <v-container fluid>
    <h2>{{ subcategoryName }}</h2>
    <h5 v-if="service_providers.length == 0">
      No service providers related with this specialization
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
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"
              ></v-img>
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
export default {
  props: ["subcategoryId", "subcategoryName"],
  components: {},
  data: () => ({
    service_providers: [],
    itemsPerPage: -1
  }),
  methods: {},
  async created() {
    await this.$request(
      "get",
      "/users/service_providers?subcategorias=" + this.subcategoryId
    )
      .then(res => {
        res.data.forEach(element => {
          this.service_providers.push(Object.assign({}, element));
        });

        this.itemsPerPage = this.service_providers.length;
      })
      .catch(err => {});
  }
};
</script>
