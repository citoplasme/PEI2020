<template>
  <Loading v-if="!ready" :message="'the profile'" />
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
    <v-list>
      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.categorias &&
            user.categorias.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Categories</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.categorias" :key="item._id">
                <span class="fakea" @click="go(`/categories/${item._id}`)">{{
                  item.name
                }}</span>
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.subcategorias &&
            user.subcategorias.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Specializations</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.subcategorias" :key="item._id">
                <span
                  class="fakea"
                  @click="go(`/serviceProviders/?subcategorias=${item._id}`)"
                  >{{ item.name }}</span
                >
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item
        v-if="
          user.level >= 3 &&
            user.level <= 4 &&
            user.locations &&
            user.locations.length > 0
        "
      >
        <v-col cols="2">
          <div class="info-label">Locations</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <ul>
              <li v-for="item in user.locations" :key="item._id">
                <span
                  class="fakea"
                  @click="go(`/serviceProviders/?locations=${item._id}`)"
                  >{{ item.name }}</span
                >
              </li>
            </ul>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item>
        <v-col cols="2">
          <div class="info-label">Karma</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ user.karma }}</p>
          </div>
        </v-col>
      </v-list-item>

      <v-list-item>
        <v-col cols="2">
          <div class="info-label">Completed Services</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ user.servicos_realizados }}</p>
          </div>
        </v-col>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";
import querystring from "querystring";
export default {
  props: ["id"],
  components: {
    Loading
  },
  data: () => ({
    user: {},
    panelHeaderColor: "primary",
    dialog: false,
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
    ready: false,
    categories: [],
    specializations: []
  }),
  async created() {
    await this.getUser();

    await this.getCategories();

    await this.getSpecializations();

    await this.merge_fileds();

    await this.getLocations();

    this.ready = true;
  },
  methods: {
    filter_query_string(ids) {
      let obj = {
        _id: ids
      };
      let new_qs = querystring.stringify(obj);
      return new_qs;
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    async merge_fileds() {
      try {
        // FILTRAR ACTIVES ???
        let cats = this.user.categorias.map(c => {
          return this.categories.find(obj => obj._id === c);
        });

        // FILTRAR ACTIVES ???
        let specs = this.user.subcategorias.map(sc => {
          return this.specializations.find(obj => obj._id === sc);
        });

        this.user.categorias = cats;
        this.user.subcategorias = specs;
      } catch (e) {
        return e;
      }
    },
    async getUser() {
      try {
        var response = await this.$request(
          "get",
          "/users/service_providers/" + this.id
        );
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
