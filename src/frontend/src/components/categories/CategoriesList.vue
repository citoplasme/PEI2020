<template>
  <v-content>
    <v-card class="ma-4">
      <v-card-title>
        <h1>Categories</h1>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filter"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="categories"
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
            <td class="subheading">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon medium color="primary">search</v-icon>
                  </v-btn>
                </template>
                <span>See subcategories</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>

<script>
export default {
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
        text: "Operations",
        value: "ops"
      }
    ],
    categories: [],
    color: "",
    text: ""
  }),
  async created() {
    await this.getCategories();
  },
  methods: {
    async getCategories() {
      try {
        var response = await this.$request("get", "/categorias");
        this.categories = response.data;
      } catch (e) {
        return e;
      }
    }
  }
};
</script>
