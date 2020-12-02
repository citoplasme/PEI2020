<template>
  <v-row>
    <v-col>
      <Info />
      <Operacoes />
      <MyArea v-if="level > 0" :level="level" />
    </v-col>

    <v-col>
      <Pesquisa />
      <Gestao v-if="level > 4" :level="level" />
    </v-col>
  </v-row>
</template>

<script>
import Info from "@/components/principal/Info.vue";
import Gestao from "@/components/principal/Gestao.vue";
import Operacoes from "@/components/principal/Operacoes.vue";
import Pesquisa from "@/components/principal/Procura.vue";
import MyArea from "@/components/principal/MyArea.vue";
export default {
  components: {
    Info,
    Gestao,
    Operacoes,
    Pesquisa,
    MyArea
  },

  methods: {
    go: function(url) {
      this.$router.push(url);
    }
  },
  data() {
    return {
      panelHeaderColor: "indigo accent-4",
      level: 0
    };
  },
  mounted: async function() {
    this.level = await this.$userLevel(this.$store.state.token);
  }
};
</script>
