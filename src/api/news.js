import request from '@/utils/request'

export const getAriticleList = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
// 新闻——获取新闻详情
export const getAriticleDetailList = (id) => {
  return request({
    url: `/v1_0/articles/${id}`
  })
}
// 新闻——收藏文章
export const collectArticles = (target) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target
    }
  })
}
// 新闻——取消收藏文章
export const cancelCollectArticles = (target) => {
  return request({
    url: `/v1_0/article/collections/${target}`,
    method: 'DELETE'
  })
}
// 新闻——对文章点赞
export const likeTheArticle = (target) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target
    }
  })
}
// 新闻——取消对文章点赞
export const cancelLikingTheArticle = (target) => {
  return request({
    url: `/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}
