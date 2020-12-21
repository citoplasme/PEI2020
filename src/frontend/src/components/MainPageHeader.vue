<template>
  <v-app-bar app color="primary" dark height="64px">
    <v-btn to="/" color="primary" text>
      <v-img :src="require('../assets/hands.png')" width="50px" height="30px" />
    </v-btn>
    <v-toolbar-title class="headline" @click="goHome">
      <span class="text" style="font-weight:600">SERVICIFY</span>
      <span class="text"> - Any Service, Anytime</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
      :top="true"
    >
      {{ text }}
      <v-btn text @click="fecharSnackbar">Close</v-btn>
    </v-snackbar>

    <v-toolbar-title class="subheading">
      <v-btn
        class="mr-2 text"
        color="blue darken-4"
        to="/users/login"
        v-if="this.$store.state.name === ''"
      >
        Login
      </v-btn>

      <v-btn
        color="blue darken-4"
        to="/users/registo"
        v-if="this.$store.state.name === ''"
        class="text"
      >
        Register
      </v-btn>

      <span class="font-weight-light ma-2" v-if="this.$store.state.name != ''">
        Welcome, {{ this.$store.state.name }}</span
      >

      <v-menu
        v-if="this.$store.state.name != ''"
        open-on-hover
        offset-y
        class="elevation-0"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon color="white">
              menu
            </v-icon>
          </v-btn>
        </template>

        <v-spacer></v-spacer>

        <v-list>
          <v-list-item @click="$router.push('/users/viewProfile')">
            <v-list-item-title>View Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('/users/alteracaoPassword')">
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logoutUtilizador">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!--v-btn
        class="mr-2 text"
        color="blue darken-4"
        v-if="this.$store.state.name != ''"
        @click="$router.push('/users/alteracaoPassword')"
      >
        Change Password
      </v-btn>
      <v-btn
        class="text"
        color="blue darken-4"
        v-if="this.$store.state.name != ''"
        @click="logoutUtilizador"
      >
        Logout
      </v-btn-->
      <!--v-btn
        color="red"
        v-if="this.$store.state.name != ''"
        @click="testJWT"
      >
        JWT
      </v-btn-->
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      color: "",
      timeout: 4000,
      text: "",
      counter: 10
    };
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    logoutUtilizador() {
      this.text = "Successfully logged out.";
      this.color = "success";
      this.snackbar = true;

      this.$store.commit("guardaTokenUtilizador", "");
      this.$store.commit("guardaNomeUtilizador", "");

      //se já está na página inicial (home)
      if (this.$route.path == "/") {
        //faz reload da página para atualizar os componentes que dependem do nível do utilizador
        this.$router.go();
      } else {
        this.$router.push("/");
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    async testJWT() {
      var res = await this.$request(
        "get",
        "/users/" + this.$store.state.token + "/token"
      );
      alert(JSON.stringify(res.data));
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Questrial&display=swap");
.text {
  font-family: "Questrial", sans-serif;
}
.headline:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
