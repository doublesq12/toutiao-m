<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="goSearchResultPage(index)"
    >
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api'
export default {
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  watch: {
    // keywords: 'getSearchSuggestion'
    keywords: {
      immediate: true,
      handler() {
        this.getSearchSuggestion()
      }
    }
  },
  computed: {
    highlightData() {
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  },
  methods: {
    async getSearchSuggestion() {
      try {
        const res = await getSearchSuggestion(this.keywords)
        // console.log(res)
        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggestions = res.data.data.options.filter(Boolean)
      } catch (error) {
        console.log(error)
      }
    },
    goSearchResultPage(index) {
      const res = this.suggestions[index]
      this.$emit('searchResult', res)
    }
  }
}
</script>

<style scoped lang="less">
.search-icon {
  padding-top: 10px;
}
</style>
