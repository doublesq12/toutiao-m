<template>
  <div>
    <van-pull-refresh v-model="refreshLoading" @refresh="loadNextPage" success-text="刷新成功">
      <van-list
        @load="loadNextPage"
        offset="0"
        :immediate-check="false"
        v-model="loading"
        :finished="isFinished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="出错了,请重新加载"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getAriticleList } from '@/api'
import ArticleItem from './ArticleItem.vue'
export default {
  data() {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      isFinished: false,
      error: false,
      refreshLoading: false
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    ArticleItem
  },
  created() {
    this.getAriticleList()
  },
  methods: {
    async getAriticleList() {
      try {
        const { data } = await getAriticleList(this.id, +new Date())
        this.pre_timestamp = data.data.pre_timestamp
        // console.log(data)
        this.articles = data.data.results
      } catch (error) {
        // 1、获取状态码
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    async loadNextPage() {
      // if (Math.random() < 0.7) {
      //   throw new Error('错误了')
      // }
      try {
        const { data } = await getAriticleList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.isFinished = true
        }
        // console.log(data)
        if (this.refreshLoading) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        this.pre_timestamp = data.data.pre_timestamp
        // this.loading = false
      } catch (error) {
        this.error = true
        // this.loading = false
      } finally {
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style></style>
