<template>
  <div @click="goArticledetailPage(articleInfo.art_id)">
    <!-- 渲染无图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 0"
      :title="articleInfo.title"
      :label="articleDesc"
    />
    <!-- 渲染一张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 1"
      :title="articleInfo.title"
      :label="articleDesc"
    >
      <van-image width="3rem" height="2rem" :src="articleInfo.cover.images[0]"
    /></van-cell>
    <!-- 渲染三张图片 -->
    <van-cell v-if="articleInfo.cover.type === 3" :title="articleInfo.title">
      <template #label>
        <div>
          <van-image
            v-for="(item, index) in articleInfo.cover.images"
            :key="index"
            width="3rem"
            height="2rem"
            :src="item"
          />
          <span>{{ articleDesc }}</span>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  props: {
    articleInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    articleDesc() {
      const art = this.articleInfo
      const relativeTime = dayjs(art.pubdate).fromNow()
      return `${art.aut_name}${art.comm_count}评论${relativeTime}`
    }
  },
  // created() {
  //   // console.log(this.articleInfo)
  // },
  methods: {
    goArticledetailPage(id) {
      this.$router.push('/articledetail/' + id)
    }
  }
}
</script>

<style></style>
