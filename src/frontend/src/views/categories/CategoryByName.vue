<template>
  <CategoryByName :categoryName="this.categoryName" />
</template>

<script>
import CategoryByName from "@/components/categories/CategoryByName.vue";

export default {
  components: {
    CategoryByName
  },
  data: () => ({
    categoryName: ""
  }),

  created() {
    this.categoryName = window.location.pathname.split("/")[2];
  }
};
</script>
