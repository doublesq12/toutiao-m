import request from '@/utils/request'
// 搜索——获取联想建议（自动补全）
export const getSearchSuggestion = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
// 搜索——获取搜索结果
export const getSearchResult = (q) => {
  return request({
    url: '/v1_0/search',
    params: {
      q
    }
  })
}
