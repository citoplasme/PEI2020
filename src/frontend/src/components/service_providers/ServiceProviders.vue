<template>
  <Loading v-if="!ready" :message="'the service providers'" />
  <v-container v-else fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar class="mb-2" color="primary" dark flat>
          <v-toolbar-title>Service Providers</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="search"
            label="Search"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-select
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="keys"
            prepend-inner-icon="search"
            label="Sort by"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn-toggle v-model="sortDesc" mandatory>
            <v-btn large depressed color="blue" :value="false">
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
            <v-btn large depressed color="blue" :value="true">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >
            <v-card>
              <img
                v-if="
                  item.photo !== undefined &&
                    item.photo.content !== undefined &&
                    item.photo.extension !== undefined
                "
                :src="
                  `data:image/${item.photo.extension};base64,${
                    item.photo.content
                  }`
                "
                style="width:100%; height:100%;"
              />
              <img
                v-else
                style="width:100%; height:100%;"
                src="@/assets/default_user.png"
              />
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{ key }}:
                  </v-list-item-content>
                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{
                      key === "Finished Services"
                        ? item["servicos_realizados"]
                        : item[key.toLowerCase()]
                    }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text type="submit">
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import Loading from "@/components/generic/Loading";

export default {
  props: ["queryString"],
  components: {
    Loading
  },
  data: () => ({
    items: [],
    itemsPerPage: 20,
    ready: false,
    itemsPerPageArray: [10, 20, 30],
    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    sortBy: "karma",
    keys: [
      "Email",
      "Name",
      "Finished Services", // servicos_realizados
      "Karma"
    ]
  }),
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== "Name");
    }
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    async getServiceProviders() {
      try {
        let response = await this.$request("get", "/users/service_providers/");
        this.items = response.data;
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
