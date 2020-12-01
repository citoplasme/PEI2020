<template>
  <SerciceProviders :queryString="this.queryString" />
</template>

<script>
import SerciceProviders from "@/components/service_providers/ServiceProviders.vue";

export default {
  components: {
    SerciceProviders
  },
  data: () => ({
    queryString: ""
  }),

  created() {
    this.queryString = this.$route.query;
  }
};
</script>
