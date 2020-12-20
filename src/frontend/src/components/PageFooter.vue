<template>
  <v-app-bar color="primary" dark dense height="80px" style="max-height:80px">
    <v-toolbar-title>
      Servicify
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <div class="body-2">Version: 1.0</div>

    <v-spacer></v-spacer>

    <div>
      <v-btn to="/" color="primary" text>
        <v-img
          :src="require('../assets/hands.png')"
          width="110px"
          height="70px"
        />
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <v-toolbar-title>
      <v-btn text depressed href="mailto:a80874@alunos.uminho.pt"
        >Contact</v-btn
      >
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-toolbar-title>
      <v-btn text depressed href="https://github.com/citoplasme">Github</v-btn>
    </v-toolbar-title>
  </v-app-bar>
</template>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>
