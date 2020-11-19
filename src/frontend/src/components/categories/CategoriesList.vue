<template>
  <v-content>
    <v-card class="ma-4">
      <v-card-title>
        <h1>Categories</h1>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-if="levelU > 3" color="blue darken-4" dark v-bind="attrs" v-on="on">
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
                  <v-textarea
                    name="description"
                    v-model="form.description"
                    label="Description"
                    auto-grow
                    solo
                    clearable
                    color="indigo"
                  ></v-textarea>
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
            <td v-if="levelU >= levelMin" class="subheading">
              {{ props.item.status }}
            </td>
            <td class="subheading">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="go(props.item.name)">
                    <v-icon medium color="grey">search</v-icon>
                  </v-btn>
                </template>
                <span>See subcategories</span>
              </v-tooltip>
              <v-tooltip bottom v-if="levelU >= levelMin">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="edit(props.item)">
                    <v-icon medium color="primary">edit</v-icon>
                  </v-btn>
                </template>
                <span>Edit category</span>
              </v-tooltip>
              <v-tooltip bottom v-if="levelU >= levelMin">
                <template v-slot:activator="{ on }">
                  <!-- <v-btn v-on="on" icon @click="eliminarName = this.categories"> -->
                  <v-btn v-on="on" icon @click="eliminarName = props.item.name">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete category</span>
              </v-tooltip>
              <v-tooltip bottom v-if="levelU >= levelMin">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="validateName = props.item.name">
                    <v-icon color="primary">done_outline</v-icon>
                  </v-btn>
                </template>
                <span>Validate category</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog_edit_category" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Edit category</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="label"
                    v-model="editedItem.name"
                    label="Name"
                    :rules="regraNome"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-textarea
                    prepend-icon="description"
                    v-model="editedItem.desc"
                    label="Description"
                    :rules="regraDesc"
                    auto-grow
                    solo
                    clearable
                    color="indigo"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select
                    :items="['Refused', 'Not active', 'Active']"
                    :rules="regraStatus"
                    prepend-icon="number"
                    v-model="editedItem.status"
                    label="Status"
                    required
                  >
                  </v-select>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog_edit_category = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="eliminarName != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Action Confirmation</v-card-title>
        <v-card-text>
          Are you sure that you want to delete the category?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="eliminarName = ''">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="eliminar(eliminarName)">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="validateName != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Action Confirmation</v-card-title>
        <v-card-text>
          Are you sure that you want to validate the category?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="validateName = ''">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="validar(validateName)">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      :top="true"
    >
      {{ text }}
      <v-btn text @click="fecharSnackbar">Close</v-btn>
    </v-snackbar>
  </v-content>
</template>

<script>
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    statusInfo: [
      {
        value: -1,
        desc: "Refused"
      },
      {
        value: 0,
        desc: "Not active"
      },
      {
        value: 1,
        desc: "Active"
      }
    ],
    regraNome: [v => !!v || "Name is required."],
    regraDesc: [v => !!v],
    regraStatus: [v => !!v || "Status is required"],
    editedItem: {
      name: "",
      desc: "",
      status: ""
    },
    levelMin: NIVEL_MINIMO_ALTERAR,
    levelU: "",
    search: "",
    headers: [],
    categories: [],
    dialog: false,
    dialog_edit_category: false,
    form: {
      name: "",
      description: ""
    },
    eliminarName: "",
    validateName:"",
    snackbar: false,
    color: "",
    done: false,
    text: "",
    timeout: 4000
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
        if (this.levelU >= this.levelMin) {
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
      let data = {
        name: this.$data.form.name,
        desc: this.$data.form.description}

      if(this.levelU >= this.levelMin){ // Teste de admin, se admin submete categoria é imediatamente aprovada
        data.status=1
      }
      else{
        data.status=0
      }

      try {
        var response = await this.$request("post", "/categorias", data)
        .then(result => {
          this.$refs.form.reset();
          this.getCategories();
        });
        this.dialog = false;
      } catch (err) {
        this.text =
          "An error occurred during the register: " + err.response.data;
        this.color = "error";
        this.dialog = false;
      }
    },
    edit(item) {
      this.editedIndex = this.categories.indexOf(item);

      this.editedItem = Object.assign({}, item);

      this.editedItem.status = this.statusInfo.find(
        s => s.value === this.editedItem.status
      ).desc;

      this.dialog_edit_category = true;
    },
    save() {
      if (this.$refs.form.validate()) {
        var parsedStatus;

        switch (this.editedItem.status) {
          case "Refused":
            parsedStatus = -1;
            break;
          case "Not active":
            parsedStatus = 0;
            break;
          case "Active":
            parsedStatus = 1;
            break;
        }
        this.$request("put", "/categorias/" + this.editedItem.name, {
          desc: this.editedItem.desc,
          status: parsedStatus
        })
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog_edit_category = false;
            this.getCategories();
          })
          .catch(err => {
            this.text = err.response.data;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Please check if you have filled every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    eliminar(name) {
      this.$request("delete", "/categorias/" + name)
        .then(res => {
          this.text = "Category succesfully deleted!";
          this.color = "success";
          this.eliminarName = "";
          this.snackbar = true;
          this.done = true;
          this.getCategories();
        })
        .catch(err => {
          this.text = err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    validar(name){
      this.$request("put", "/categorias/"+ name, {
        status:1
      })
        .then(res => {
          this.text = "Category succesfully validated!";
          this.color = "success";
          this.validateName = "";
          this.snackbar = true;
          this.done = true;
          this.getCategories();
        })
        .catch(err => {
          this.text = err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getCategories();
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
