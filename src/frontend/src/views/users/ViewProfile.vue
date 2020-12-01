<template>
  <ViewProfile :id="this.id" />
</template>

<script>
import ViewProfile from "@/components/users/ViewProfile.vue";

export default {
  components: {
    ViewProfile
  },
  data: () => ({
    id: ""
  }),

  created() {
    this.id = window.location.pathname.split("/")[2];
  }
};
</script>
