<template>
  <div class="searchPage">
    <!-- 头部搜索框 -->
    <form action="/" class="form">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="backToPrePage"
        background="#3296fa"
        class="search"
        @focus="visibleSearchSuggestion"
      />
    </form>
    <!-- <SearchHistory></SearchHistory>
    <SearchSuggestion></SearchSuggestion>
    <SearchResult></SearchResult> -->
    <component
      :is="componentName"
      :keywords="keywords"
      :historyList="historyList"
      @searchResult="searchResultFn"
      :suggestionsList="suggestions"
      @empty="emptyFn"
      @delOne="delOneFn"
      @loadNextPage="loadNextPageFn"
      :finished="finished"
      @goSearchResultPage="goSearchResultPageFn"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
import SearchResult from './components/SearchResult.vue'
import { getSearchResult } from '@/api'
export default {
  data() {
    return {
      keywords: '',
      isShowSearchResult: false,
      historyList:
        JSON.parse(localStorage.getItem('HEIMA_TOUTIAO_SEARCHHISTORY')) || [],
      suggestions: [],
      page: 1,
      finished: null
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  computed: {
    componentName() {
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }
  },
  methods: {
    onSearch() {
      // console.log('正在搜索')
      this.isShowSearchResult = true
      const kindex = this.historyList.indexOf(this.keywords)
      // 搜索历史,空、空格、去重处理
      if (this.keywords.trim() === '') {
        return
      } else if (this.keywords.trim() !== '' && kindex === -1) {
        this.historyList.unshift(this.keywords)
        localStorage.setItem(
          'HEIMA_TOUTIAO_SEARCHHISTORY',
          JSON.stringify(this.historyList)
        )
      } else {
        this.historyList.splice(kindex, 1)
        this.historyList.unshift(this.keywords)
      }
      // console.log(this.historyList)
      this.getSearchResult()
    },
    backToPrePage() {
      this.$router.back()
    },
    visibleSearchSuggestion() {
      this.isShowSearchResult = false
    },
    async getSearchResult() {
      try {
        const res = await getSearchResult(this.page, this.keywords)
        console.log(res)
        console.log(res.data.data.results)
        // if (res.data.data.options.length === 0) {
        //   this.$toast.fail('没有搜索建议')
        // }
        this.suggestions = res.data.data.results
      } catch (error) {
        console.log(error)
      }
    },
    searchResultFn(res) {
      console.log(111)
      this.keywords = res
      this.onSearch()
    },
    emptyFn() {
      this.historyList = []
    },
    delOneFn(i) {
      this.historyList = this.historyList.filter(
        (item) => this.historyList.indexOf(item, 0) !== i
      )
      localStorage.setItem(
        'HEIMA_TOUTIAO_SEARCHHISTORY',
        JSON.stringify(this.historyList)
      )
    },
    async loadNextPageFn() {
      this.page++
      const { data } = await getSearchResult(this.page, this.keywords)
      console.log(data)
      if (data.data.results.length === 0) {
        this.finished = true
      }
      this.suggestions.push(...data.data.results)
    },
    goSearchResultPageFn(ele) {
      this.keywords = ele
      this.onSearch()
    }
  }
}
</script>

<style scoped lang="less">
.form {
  position: fixed;
  top: 0;
  z-index: 99;
  left: 0;
  right: 0;
  width: 750px;
}
.search {
  [role='button'] {
    color: #fff;
  }
}
.SearchHistoryPage {
  padding-top: 108px;
}
</style>
