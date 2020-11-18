<template>
  <v-content>
    <v-card class="ma-4">
      <v-card-title>
        <h1>Categories</h1>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue darken-4" dark v-bind="attrs" v-on="on">
              New category
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Category</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    name="name"
                    v-model="form.name"
                    label="Name"
                    required
                  ></v-text-field>
                  <v-text-field
                    name="description"
                    v-model="form.description"
                    label="Description"
                    required
                  ></v-text-field>
                </v-form>
              </v-container>
              <small>*all fields are required</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                type="submit"
                @click="registCategories"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
            <td class="subheading">{{ props.item.status }}</td>
            <td class="subheading">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="go(props.item.name)">
                    <v-icon medium color="primary">search</v-icon>
                  </v-btn>
                </template>
                <span>See subcategories</span>
              </v-tooltip>
              <v-tooltip bottom v-if="levelU >= nivelMin">
                <template v-slot:activator="{ on }">
                  <!-- <v-btn v-on="on" icon @click="eliminarName = this.categories"> -->
                  <v-btn icon v-on="on">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete category</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>

<script>
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    nivelMin:NIVEL_MINIMO_ALTERAR,
    levelU: "",
    search: "",
    headers: [],
    categories: [],
    color: "",
    text: "",
    dialog: false,
    form: {
      name: "",
      description: ""
    },
    eliminarName: ""
  }),
  methods: {
    preparaCabecalhos(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.headers = [
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
          },
          {
            text: "Operations",
            value: "ops"
          }
        ];
      } else {
        this.headers = [
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
        ];
      }
    },

    preparaLista(listCategories) {
      let myTree = [];
      for (let i = 0; i < listCategories.length; i++) {
        if (this.levelU >= NIVEL_MINIMO_ALTERAR) {
          myTree.push({
            name: listCategories[i].name,
            desc: listCategories[i].desc,
            status: listCategories[i].status
          });
        } else if (listCategories[i].status == 1) {
          myTree.push({
            name: listCategories[i].name,
            desc: listCategories[i].desc
          });
        }
      }
      return myTree;
    },

    async getCategories() {
      try {
        let response = await this.$request("get", "/categorias/");
        let level = await this.$userLevel(this.$store.state.token);
        this.preparaCabecalhos(level);
        this.categories = await this.preparaLista(response.data);

      } catch (e) {
        return e;
      }
    },
    go(categoryName) {
      var url = "/categories/" + categoryName;
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async registCategories() {
      try {
        var response = await this.$request("post", "/categorias", {
          name: this.$data.form.name,
          desc: this.$data.form.description,
          status: 0 // deve ser sempre zero só depois é que admin valida
        }).then(result => {
          console.log(result);
          this.getCategories();
        });
        this.dialog = false;
        //this.$router.push("/categories/list");
      } catch (err) {
        console.log(err);
        this.text =
          "An error occurred during the register: " + err.response.data;
        this.color = "error";
        this.dialog = false;
      }
    }
  },
  created: async function() {
    try {
      let level = await this.$userLevel(this.$store.state.token);
      this.levelU = level;
      await this.getCategories();
    } catch (e) {
      return e;
    }
  }
};
</script>
