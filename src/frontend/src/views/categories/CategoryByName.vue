<template>
  <CategoryByName :categoryId="this.categoryId" />
</template>

<script>
import CategoryByName from "@/components/categories/CategoryByName.vue";

export default {
  components: {
    CategoryByName
  },
  data: () => ({
    categoryId: ""
  }),

  created() {
    this.categoryId = window.location.pathname.split("/")[2];
  }
};
</script>
