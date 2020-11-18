<template>
  <v-content>
    <v-card class="ma-4">
      <v-card-title>
        <h1>{{ categoryName }}</h1>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filter"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-subheader>{{ categoryDesc }}</v-subheader>
      <v-data-table
        :headers="headers"
        :items="subCategories"
        :search="search"
        class="elevation-1"
        footer-props.items-per-page-options="[10, 20, 50]"
        footer-props.items-per-page-text="Show"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            No results were found for "{{ search }}" .
          </v-alert>
        </template>

        <template v-slot:item="props">
          <tr>
            <td class="subheading">{{ props.item.name }}</td>
            <td class="subheading">{{ props.item.desc }}</td>
            <td class="subheading">{{ props.item.status }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>

<script>
export default {
  props: ["categoryName"],
  data: () => ({
    search: "",
    headers: [
      {
        text: "Name",
        sortable: true,
        value: "name",
        class: "title"
      },
      {
        text: "Description",
        sortable: true,
        value: "desc",
        class: "title"
      },
      {
        text: "Status",
        sortable: true,
        value: "status",
        class: "title"
      }
    ],
    categories: [],
    categoryDesc: "",
    subCategories: [],
    color: "",
    text: ""
  }),
  async created() {
    await this.getSubCategories(this.categoryName);
  },
  methods: {
    async getSubCategories(categoryName) {
      try {
        var response = await this.$request(
          "get",
          "/categorias/" + categoryName
        );

        this.categoryDesc = response.data.desc;

        this.subCategories = Array.from(response.data.subcategories);
      } catch (e) {
        return e;
      }
    }
  }
};
</script>
