<template>
  <div>
    <!--  -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="backToPrePage"
    />
  </div>
</template>

<script>
export default {
  methods: {
    backToPrePage() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.van-hairline--bottom{
  background-color: #3296fa;
  :deep(.van-nav-bar__arrow){
    color: #fff;
  }
  :deep(.van-ellipsis){
    color: #fff;
  }
}
</style>
