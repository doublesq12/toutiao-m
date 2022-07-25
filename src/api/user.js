import request from '@/utils/request'
// import store from '@/store'

export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}
export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}
// 用户——获取用户自己信息
export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 用户——关注用户
export const followUsers = (target) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target
    }
  })
}
// 用户——取消关注用户
export const cancelFollowingUsers = (target) => {
  return request({
    url: `/v1_0/user/followings/${target}`,
    method: 'DELETE'
  })
}
// 用户——编辑用户个人资料
export const editUserProfile = (data) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}
// 图片的FORM DATA
export const uploadPhoto = (file) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: file
  })
}
// 用户——获取用户个人资料
export const getUserProfile = (file) => {
  return request({
    url: '/v1_0/user/profile'
  })
}
