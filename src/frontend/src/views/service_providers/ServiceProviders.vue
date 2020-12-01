<template>
  <SerciceProviders :subcategoryId="this.subcategoryId" />
</template>

<script>
import SerciceProviders from "@/components/service_providers/ServiceProviders.vue";

export default {
  components: {
    SerciceProviders
  },
  data: () => ({
    subcategoryId: ""
  }),

  created() {
    var queryString = this.$route.query;

    this.subcategoryId = queryString.subcategoryId;
  }
};
</script>
