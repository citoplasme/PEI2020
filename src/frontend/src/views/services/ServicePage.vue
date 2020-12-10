<template>
  <ServicePage :id="this.id" />
</template>

<script>
import ServicePage from "@/components/services/ServicePage.vue";

export default {
  data: () => ({
    id: -1
  }),
  components: {
    ServicePage
  },
  created() {
    this.id = window.location.pathname.split("/")[2];
  }
};
</script>
