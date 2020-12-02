<template>
  <Biding :idService="this.idService" />
</template>

<script>
import Biding from "@/components/services/Biding.vue";

export default {
  components: {
    Biding
  },
  data: () => ({
    id: ""
  }),

  created() {
    this.idService = window.location.pathname.split("/")[3];
  }
};
</script>
