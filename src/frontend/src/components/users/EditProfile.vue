<template>
  <Loading v-if="!ready" :message="'your profile'" />
  <v-card v-else class="mx-auto" max-width="1000" tile>
    <v-row class="mx-auto">
      <v-list-item>
        <v-list-item-avatar size="250">
          <img
            v-if="
              user.photo !== undefined &&
                user.photo.content !== undefined &&
                user.photo.extension !== undefined
            "
            :src="
              `data:image/${user.photo.extension};base64,${user.photo.content}`
            "
            style="width:100%; height:100%;"
          />
          <img
            v-else
            style="width:100%; height:100%;"
            src="@/assets/default_user.png"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-row>
    <v-row class="mx-auto">
      <v-list>
        <v-list-item> Country/City: </v-list-item>
        <v-list-item> Birthday: </v-list-item>
        <v-list-item> Bio: </v-list-item>
        <v-list-item> Categories: {{ user.categories }} </v-list-item>
        <v-list-item> Specializations: {{ user.specializations }} </v-list-item>
        <v-list-item> Karma: {{ user.karma }} </v-list-item>
        <v-list-item> Services: {{ user.servicos_realizados }} </v-list-item>
        <v-list-item>
          <div class="text-xs-center">
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark rounded v-on="on">
                  Edit Profile
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                  Edit Profile
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      >Name:
                      <v-flex xs12 md4>
                        <v-text-field
                          v-model="Nome"
                          :rules="regraNomes"
                          required
                        ></v-text-field>
                      </v-flex>
                    </v-list-item>
                    <v-list-item
                      >Birthday:
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="200px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          ref="picker"
                          v-model="date"
                          :max="new Date().toISOString().substr(0, 10)"
                          min="1900-01-01"
                          @change="save"
                        ></v-date-picker>
                      </v-menu>
                    </v-list-item>
                    <v-list-item
                      >Bio:
                      <v-flex xs12 md8>
                        <v-text-field
                          v-model="Bio"
                          :rules="regraNomes"
                          required
                        ></v-text-field> </v-flex
                    ></v-list-item>
                    <v-list-item
                      >Country/City:
                      <v-flex xs12 md4>
                        <v-text-field v-model="Country" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4>
                        <v-text-field
                          v-model="City"
                          required
                        ></v-text-field> </v-flex
                    ></v-list-item>
                    <v-list-item
                      >Gender:
                      <v-flex xs12 sm6 d-flex>
                        <v-select :items="gender"></v-select> </v-flex
                    ></v-list-item>
                    <v-list-item
                      >Categories:
                      <v-flex xs12 md4>
                        <v-text-field
                          v-model="categoriesUser"
                        ></v-text-field> </v-flex
                    ></v-list-item>
                    <v-list-item
                      >Specializations:
                      <v-flex xs12 md4>
                        <v-text-field
                          v-model="specializationsUser"
                        ></v-text-field> </v-flex
                    ></v-list-item>
                  </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="dialog = false">
                    Apply
                  </v-btn>
                </v-card-actions></v-card
              ></v-dialog
            >
          </div></v-list-item
        >
      </v-list>
    </v-row>
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";
import querystring from "querystring";
export default {
  components: {
    Loading
  },
  data: () => ({
    gender: ["Male", "Female", "Other", "None"],
    user: {},
    panelHeaderColor: "primary",
    dialog: false,
    date: null,
    menu: false,
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
    id: "",
    ready: false,
    categories: [],
    specializations: []
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  async created() {
    var res = await this.$request(
      "get",
      "/users/" + this.$store.state.token + "/token"
    );
    this.id = res.data._id;

    await this.getUser();

    await this.getCategories();

    await this.getSpecializations();

    //await this.merge_fields();

    await this.getLocations();

    this.ready = true;
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    async getUser() {
      try {
        var response = await this.$request("get", "/users/" + this.id);
        this.user = response.data;
      } catch (e) {
        return e;
      }
    },
    async getLocations() {
      try {
        if (this.user.locations && this.user.locations.length > 0) {
          let qs = this.filter_query_string(this.user.locations);
          let queryS = qs === "" ? "" : "?" + qs;
          var response = await this.$request("get", "/locations/" + queryS);
          let specs = this.user.locations.map(sc => {
            return response.data.find(obj => obj._id === sc);
          });
          this.user.locations = specs;
        }
      } catch (e) {
        return e;
      }
    },
    async getCategories() {
      try {
        var response = await this.$request("get", "/categories/");
        this.categories = response.data;
      } catch (e) {
        return e;
      }
    },
    async getSpecializations() {
      try {
        var response = await this.$request("get", "/specializations/");
        this.specializations = response.data;
      } catch (e) {
        return e;
      }
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}
.card-heading {
  font-size: x-large;
  font-weight: bold;
}
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
.fakea:hover {
  text-decoration: underline;
  cursor: pointer;
}
.fakea {
  color: #1a76d2;
}
</style>
