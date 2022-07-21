<template>
  <div>
    <!-- 搜索结果列表 -->
    <van-cell-group>
      <van-cell
        :title="item.title"
        v-for="(item, index) in suggestionsList"
        :key="index"
      />
    </van-cell-group>
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
    }
  },
  data() {
    return {
      value: this.keywords
    }
  },
  methods: {
    onSearch(val) {
      this.$toast(val)
    },
    onCancel() {
      this.$toast('取消')
    }
  }
}
</script>

<style scoped lang="less"></style>
