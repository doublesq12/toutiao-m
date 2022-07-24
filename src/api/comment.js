import request from '@/utils/request'
// 评论——获取评论或评论回复
export const getCommentsOrCommentReplies = (type, source, offset) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type,
      source,
      offset
    }
  })
}
// 评论——对文章进行评论
export const commentOnArticles = (target, content) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target,
      content
    }
  })
}
// 评论——对评论进行评论
export const commentOnComments = (target, content, artId) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id: artId
    }
  })
}
// 评论——对评论或评论回复点赞
export const likeCommentsOrReplyToComments = (target) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target
    }
  })
}
