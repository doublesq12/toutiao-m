<template>
  <div>
    <!-- 搜索结果列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="0"
    >
      <van-cell
        :title="item.title"
        v-for="(item, index) in suggestionsList"
        :key="index"
      />
    </van-list>
  </div>
</template>

<script>
export default {
  props: {
    keywords: {
      type: String,
      required: true
    },
    suggestionsList: {
      type: Array,
      required: true
    },
    finished: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: this.keywords,
      loading: false
    }
  },
  methods: {
    onSearch(val) {
      this.$toast(val)
    },
    onCancel() {
      this.$toast('取消')
    },
    onLoad() {
      this.$emit('loadNextPage')
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
