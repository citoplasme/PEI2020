<template>
  <v-content>
    <Loading v-if="!ready" :message="'the category'" />
    <v-card v-else class="ma-4">
      <v-card-title>
        <h1>{{ category.name }}</h1>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="levelU >= 3"
              color="blue darken-4"
              dark
              v-bind="attrs"
              v-on="on"
            >
              New Sub-category
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Sub-Category</span>
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
                  <v-textarea
                    name="description"
                    v-model="form.description"
                    label="Description"
                    auto-grow
                    solo
                    clearable
                    color="indigo"
                  ></v-textarea>
                  <v-select
                    v-if="levelU >= levelMin"
                    :items="['Yes', 'No']"
                    v-model="form.active"
                    label="Active"
                    required
                  >
                  </v-select>
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
                @click="registSubCategory"
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
            <td class="subheading">

              <v-tooltip bottom v-if="levelU >= levelMin">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="eliminarName = props.item.id">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete category</span>
              </v-tooltip>
              <v-tooltip bottom v-if="levelU >= levelMin">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="validateName = props.item">
                    <v-icon color="green">done_outline</v-icon>
                  </v-btn>
                </template>
                <span>Validate category</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
        
      </v-data-table>
    </v-card>
  </v-content>
</template>

<script>
import Loading from "@/components/generic/Loading";
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  props: ["categoryId"],
  components: {
    Loading
  },
  data: () => ({
    search: "",
    headers: [],
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
    ready: false,
    dialog: false,
    form: {
      name: "",
      description: "",
      active: "No"
    },
    levelMin: NIVEL_MINIMO_ALTERAR,
    levelU: "",
  }),
  methods: {
    preparaCabecalhos(level) {
      console.log(level)
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
            text: "Active",
            sortable: true,
            value: "active",
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
    async getSubCategories(id) {
      this.preparaCabecalhos(this.levelU)
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
    },
    async registSubCategory() {
      let data = {
        name: this.$data.form.name,
        category: this.categoryId
      };

      if (
        this.$data.form.description !== undefined &&
        this.$data.form.description !== "" &&
        this.$data.form.description !== null
      ) {
        data.desc = this.$data.form.description;
      }

      if (this.levelU >= this.levelMin) {
        if (this.$data.form.active == "Yes") data.active = true;
        else if (this.$data.form.active == "No") data.active = "false";
      } else data.active = "false";

      try {
        var response = await this.$request("post", "/specializations/", data).then(
          result => {
            this.$refs.form.reset();

            this.getSubCategories(this.categoryId);
          }
        );
        this.dialog = false;
      } catch (err) {
        this.text =
          "An error occurred during the register: " + err.response.data;
        this.color = "error";
        this.dialog = false;
      }
    }
  },
  async created() {
    console.log(this.props.categoryId)
    await this.getCategory(this.categoryId);
    await this.getSubCategories(this.categoryId);
    this.ready = true;
    let level = await this.$userLevel(this.$store.state.token);
    this.levelU=level
  },
};
</script>
