<template>
  <SerciceProviders
    :subcategoryId="this.subcategoryId"
    :subcategoryName="this.subcategoryName"
  />
</template>

<script>
import SerciceProviders from "@/components/service_providers/ServiceProviders.vue";

export default {
  components: {
    SerciceProviders
  },
  data: () => ({
    subcategoryId: "",
    subcategoryName: ""
  }),

  created() {
    var queryString = this.$route.query;

    this.subcategoryId = queryString.subcategoryId;
    this.subcategoryName = queryString.subcategoryName;
  }
};
</script>
