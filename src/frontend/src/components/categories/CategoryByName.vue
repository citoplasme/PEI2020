<template>
  <v-content>
    <Loading v-if="!ready" :message="'the category'" />
    <v-card v-else class="ma-4">
      <v-card-title>
        <h1>{{ category.name }}</h1>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filter"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-subheader>{{ category.desc }}</v-subheader>
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
            <td class="subheading">{{ props.item.active }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>

<script>
import Loading from "@/components/generic/Loading";
export default {
  props: ["categoryId"],
  components: {
    Loading
  },
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
        text: "Active",
        sortable: true,
        value: "active",
        class: "title"
      }
    ],
    categories: [],
    categoryDesc: "",
    subCategories: [],
    color: "",
    text: "",
    category: {
      name: "",
      desc: "",
      active: false
    },
    ready: false
  }),
  async created() {
    await this.getCategory(this.categoryId);
    await this.getSubCategories(this.categoryId);

    this.ready = true;
  },
  methods: {
    async getSubCategories(id) {
      try {
        var response = await this.$request(
          "get",
          "/specializations?category=" + id
        );

        this.subCategories = Array.from(response.data);
      } catch (e) {
        return e;
      }
    },
    async getCategory(id) {
      try {
        var response = await this.$request("get", "/categories/" + id);
        this.category = response.data;
      } catch (e) {
        return e;
      }
    }
  }
};
</script>
