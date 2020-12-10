<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    :return-value.sync="dataValor"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        filled
        v-model="dataValor"
        label="Hour: HH:MM"
        prepend-icon="event"
        readonly
        v-on="on"
      ></v-text-field>
    </template>

    <v-time-picker format="24hr" v-model="dataValor" scrollable>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu1 = false">Close</v-btn>
      <v-btn text color="primary" @click="dataSelecionada">Select</v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script>
export default {
  props: ["d"],

  data() {
    return {
      dataValor: this.d,
      menu1: false,
    };
  },

  methods: {
    dataSelecionada: function() {
      this.$refs.menu1.save(this.dataValor);
      this.$emit("dataSelecionada", this.dataValor);
      this.dataValor = "";
    }
  }
};
</script>
