<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">이전</button>
    <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  methods: {
    prevPage() {
      this.$emit('page-changed', this.currentPage - 1)
    },
    nextPage() {
      this.$emit('page-changed', this.currentPage + 1)
    },
  },
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  margin: 0 10px;
}
</style>
