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
        <v-list-item> Karma: {{ user.karma }} </v-list-item>
        <v-list-item> Services: {{ user.servicos_realizados }} </v-list-item>
      </v-list>
    </v-row>
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";
export default {
  props: ["id"],
  components: {
    Loading
  },
  data: () => ({
    user: {},
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
    ready: false
  }),
  async created() {
    await this.getUser();

    this.ready = true;
  },
  methods: {
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
    }
  }
};
</script>
