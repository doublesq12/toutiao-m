<template>
  <div class="SearchHistoryPage">
    <div class="SearchHistory">
      搜索历史
      <div class="delText" v-if="isShowDelButton">
        <span class="left" @click="delAllFn">全部删除</span>
        <span @click="completeFn">完成</span>
      </div>
      <i class="toutiao toutiao-shanchu" @click="delFn" v-else></i>
    </div>
    <div class="history" v-for="(item, index) in historyList" :key="index">
      {{ item }}
      <!-- 删除按钮 -->
      <van-icon name="close" v-if="isShowDelButton" @click="delOneFn(index)" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    historyList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 清空按钮的显隐
      isShowDelButton: false,
      // 删除按钮的显隐
      isShowCloseButton: false
    }
  },
  methods: {
    delFn() {
      this.isShowDelButton = true
    },
    completeFn() {
      this.isShowDelButton = false
    },
    delAllFn() {
      this.$emit('empty')
    },
    delOneFn(index) {
      this.$emit('delOne', index)
    }
  }
}
</script>

<style scoped lang="less">
.SearchHistoryPage {
  background-color: #f5f7f9;
  height: 1300px;
  //搜索历史盒子
  .SearchHistory {
    color: #323233;
    font-size: 0.37333rem;
    line-height: 0.64rem;
    //添加
    background-color: #fff;
    width: 750px;
    height: 88px;
    line-height: 88px;
    padding-left: 25px;
    position: relative;
    //搜索历史的删除按钮
    .toutiao-shanchu {
      position: absolute;
      right: 60px;
    }
    //搜索历史盒子的全部删除、完成文字
    .delText {
      position: absolute;
      right: 60px;
      top: 3px;
      z-index: 99;
      color: #969799;
      .left {
        padding-right: 5px;
      }
    }
  }
  //装每条历史记录的盒子
  .history {
    position: relative;
    color: #323233;
    font-size: 0.37333rem;
    line-height: 88px;
    background-color: #fff;
    border-top: 1px solid #eee;
    height: 88px;
    padding-left: 25px;
    //每一条的删除图标
    :deep(.van-icon-close) {
      position: absolute;
      right: 32px;
      top: 0.4rem;
      color: #969799;
    }
  }
}
</style>
