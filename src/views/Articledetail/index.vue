<template>
  <div class="article">
    <!-- 导航栏 -->
    <div class="navbar">
      <van-nav-bar title="黑马头条" left-arrow @click-left="onClickLeft" />
    </div>
    <!-- 头部 -->
    <div class="header">
      <p class="title">{{ ariticleDetailList.title }}</p>
      <div class="grid">
        <div class="left">
          <div>
            <van-image
              round
              width="1.1rem"
              height="1.1rem"
              :src="ariticleDetailList.aut_photo"
            />
          </div>
          <div class="text">
            <p>{{ ariticleDetailList.aut_name }}</p>
            <span>{{ dayjs(ariticleDetailList.pubdate).fromNow() }}</span>
          </div>
        </div>
        <div class="right">
          <van-button
            round
            v-if="!ariticleDetailList.is_followed"
            @click="followButtonFn(ariticleDetailList.aut_id)"
            class="followButton"
          >
            <van-icon name="plus" />关注
          </van-button>
          <van-button
            round
            v-else
            @click="followedButtonFn(ariticleDetailList.aut_id)"
            class="followedButton"
          >
            已关注
          </van-button>
        </div>
      </div>
    </div>
    <!-- 中间文章部分 -->
    <div class="center">
      <article
        class="markdown-body"
        style="text-align: left"
        v-html="ariticleDetailList.content"
      ></article>
    </div>
    <!-- 底部标签页 -->
    <div class="footer">
      <!-- 回复评论的弹出层 -->
      <van-cell @click="showPopup"
        ><van-button round>写评论</van-button></van-cell
      >
      <van-popup v-model="show" position="bottom" :style="{ height: '18%' }">
        <div class="popup">
          <van-field
            v-model="message"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            show-word-limit
            placeholder="请输入留言"
          ></van-field>
          <van-button class="publish" @click="publishFn">发布</van-button>
        </div>
      </van-popup>
      <!-- <div class="icon-channel"> -->
      <!-- 评论数量 -->
      <van-badge :content="commentList.length">
        <van-icon name="comment-o" />
      </van-badge>
      <!-- 收藏按钮 -->
      <van-icon
        name="star-o"
        v-if="!ariticleDetailList.is_collected"
        @click="favoriteButtonFn(ariticleDetailList.art_id)"
      />
      <van-icon
        name="star"
        v-if="ariticleDetailList.is_collected"
        @click="notFavoriteButtonFn(ariticleDetailList.art_id)"
      />
      <!-- 点赞按钮 -->
      <van-icon
        name="good-job-o"
        v-if="ariticleDetailList.attitude <= 0"
        @click="noLikesButtonFn(ariticleDetailList.art_id)"
      />
      <van-icon
        name="good-job"
        v-if="ariticleDetailList.attitude > 0"
        @click="likeButtonFn(ariticleDetailList.art_id)"
      />
      <van-icon name="share" @click="showShare = true" />
      <!-- 分享面板 -->
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
      />
    </div>
    <!-- 评论 -->
    <!-- 文章评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="0"
      :immediate-check="false"
    >
      <commentList
        v-for="(item, index) in commentList"
        :key="index"
        :item="item"
        @replyButtonFn="showReplyPopupFn"
        @likesOfTheArticleCommentList="likesOfTheArticleCommentListFn"
      ></commentList>
    </van-list>
    <!-- 评论回复弹出层 -->
    <div class="replyPopup">
      <van-popup
        v-model="showReply"
        position="bottom"
        :style="{ height: '100%' }"
      >
        <van-nav-bar
          :title="
            commentReplyList.length === 0
              ? '暂无回复'
              : commentReplyList.length + '条回复'
          "
          left-arrow
          @click-left="showReply = false"
        />
        <commentList
          :item="isitem"
          @likesOfTheArticleCommentList="likesOfTheArticleCommentListFn"
        ></commentList>
        <div class="replyAll">全部回复</div>
        <!-- 评论的评论评论回复列表 -->
        <commentList
          v-for="(item, index) in commentReplyList"
          :key="index"
          :item="item"
          @likesOfTheArticleCommentList="likesOfTheArticleCommentListFn"
        ></commentList>
        <!-- 回复弹出层底部评论 -->
        <van-cell @click="showReplyPopupFooterFn">
          <div class="commentReplyButton">
            <van-button round type="info">评论</van-button>
          </div>
        </van-cell>
        <van-popup
          v-model="showReplyPopup"
          position="bottom"
          :style="{ height: '18%' }"
        >
          <div class="popup">
            <van-field
              v-model="messages"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              show-word-limit
              placeholder="请输入留言"
              class="field"
            ></van-field>
            <van-button class="publish" @click="commentReplyFn"
              >发布</van-button
            >
          </div>
        </van-popup>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  // 新闻——获取新闻详情
  getAriticleDetailList,
  // 用户——关注用户
  followUsers,
  // 用户——取消关注用户
  cancelFollowingUsers,
  // 收藏文章
  collectArticles,
  // 取消收藏文章
  cancelCollectArticles,
  // 获取评论或评论回复
  getCommentsOrCommentReplies,
  // 对文章进行评论
  commentOnArticles,
  // 对评论进行评论
  commentOnComments,
  // 对文章点赞
  likeTheArticle,
  // 取消对文章点赞
  cancelLikingTheArticle,
  // 评论——对评论或评论回复点赞
  likeCommentsOrReplyToComments,
  // 评论——取消对评论或评论回复点赞
  cancelTheCommentOrReplyToTheCommentLike
} from '@/api'
import dayjs from '@/utils/dayjs'
import commentList from './component/commentList.vue'
export default {
  data() {
    return {
      id: '',
      // 新闻详情列表
      ariticleDetailList: [],
      dayjs,
      // 评论列表
      commentList: [],
      // 评论回复列表
      commentReplyList: [],
      // 评论发布弹出层显隐
      show: false,
      // 回复弹出层显隐
      showReply: false,
      // 去发布输入框的内容
      message: '',
      // 回复评论弹出层评论输入框的内容
      messages: '',
      // 分享面板
      showShare: false,
      // 回复评论的输入框的显隐
      showReplyPopup: false,
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ],
      // 控制回复弹出层对应的评论渲染内容
      isitem: {},
      loading: false,
      finished: null
    }
  },
  components: {
    commentList
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    // 获取新闻详情
    async getAriticleDetailList() {
      try {
        const res = await getAriticleDetailList(this.id)
        console.log(res.data)
        this.ariticleDetailList = res.data.data
        // console.log(this.ariticleDetailList)
        // this.pubdate = dayjs(this.ariticleDetailList.pubdate).fromNow()
        this.getComments()
      } catch (error) {
        console.log(error)
      }
    },
    // 关注用户
    async followButtonFn(id) {
      // console.log(id)
      try {
        await followUsers(id)
        if (!this.ariticleDetailList.is_followed) {
          this.ariticleDetailList.is_followed = true
        }
        // console.log(this.ariticleDetailList)
        // console.log(res.data)
        // 调用获取评论接口
        // this.getAriticleDetailList()
      } catch (error) {
        console.log(error)
      }
    },
    // 取消关注用户
    async followedButtonFn(id) {
      // console.log(id)
      try {
        await cancelFollowingUsers(id)
        if (this.ariticleDetailList.is_followed) {
          this.ariticleDetailList.is_followed = false
        }
        // console.log(this.ariticleDetailList)
        // this.getAriticleDetailList()
      } catch (error) {
        console.log(error)
      }
    },
    // 收藏文章
    async favoriteButtonFn(id) {
      try {
        await collectArticles(id)
        if (!this.ariticleDetailList.is_collected) {
          this.ariticleDetailList.is_collected = true
        }
        // console.log(this.ariticleDetailList)
        // this.getAriticleDetailList()
      } catch (error) {
        console.log(error)
      }
    },
    // 取消收藏文章
    async notFavoriteButtonFn(id) {
      try {
        await cancelCollectArticles(id)
        if (this.ariticleDetailList.is_collected) {
          this.ariticleDetailList.is_collected = false
        }
        // console.log(this.ariticleDetailList)
        // this.getAriticleDetailList()
      } catch (error) {
        console.log(error)
      }
    },
    // 对文章点赞
    async noLikesButtonFn(id) {
      try {
        await likeTheArticle(id)
        if (this.ariticleDetailList.attitude <= 0) {
          this.ariticleDetailList.attitude = 1
        }
        // console.log(this.ariticleDetailList)
        // this.getAriticleDetailList()
      } catch (error) {
        console.log(error)
      }
    },
    // 取消对文章点赞
    async likeButtonFn(id) {
      try {
        await cancelLikingTheArticle(id)
        if (this.ariticleDetailList.attitude > 0) {
          this.ariticleDetailList.attitude = 0
        }
        // console.log(this.ariticleDetailList)
        // this.getAriticleDetailList()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取评论
    async getComments() {
      try {
        const { data } = await getCommentsOrCommentReplies(
          'a',
          this.ariticleDetailList.art_id
        )
        this.commentList = data.data.results
        console.log(this.commentList)
      } catch (error) {
        console.log(error)
      }
    },
    // 评论发布弹出层的显示事件
    showPopup() {
      this.show = true
    },
    /// 回复评论弹出层的显示事件
    showReplyPopupFn(item) {
      this.showReply = true
      this.isitem = item
      this.getCommentReplies()
    },
    // 回复弹出层的隐藏事件
    onClickLef() {
      this.showReply = false
    },
    // 发布评论
    async publishFn() {
      // console.log(this.ariticleDetailList)
      try {
        // 对文章进行评论接口
        await commentOnArticles(this.ariticleDetailList.art_id, this.message)
        this.getComments()
        this.show = !this.show // 关闭遮罩层
        this.message = '' // 清空输入框
        // this.commentList.unshift(data.data.new_obj)
      } catch (error) {
        console.log(error)
      }
    },
    // 发布评论的回复的弹出层的显示事件
    showReplyPopupFooterFn() {
      this.showReplyPopup = true
    },
    // 获取评论回复
    async getCommentReplies() {
      try {
        const { data } = await getCommentsOrCommentReplies(
          'c',
          this.isitem.com_id
        )
        this.commentReplyList = data.data.results
        console.log(this.commentReplyList)
      } catch (error) {
        console.log(error)
      }
    },
    // 发布评论的回复
    async commentReplyFn() {
      console.log(this.isitem.com_id)
      console.log(111)
      try {
        // 对评论进行评论接口
        await commentOnComments(
          this.isitem.com_id,
          this.messages,
          this.ariticleDetailList.art_id
        )
        this.showReplyPopup = false // 关闭遮罩层
        this.messages = '' // 清空输入框
        this.getCommentReplies()
        // this.commentList.unshift(data.data.new_obj)
      } catch (error) {
        console.log(error)
      }
    },
    // 文章评论列表点赞、取消对文章点赞的点击事件
    async likesOfTheArticleCommentListFn(i) {
      try {
        if (!i.is_liking) {
          // 评论——对评论或评论回复点赞接口
          await likeCommentsOrReplyToComments(i.com_id)
          i.is_liking = true
          i.like_count += 1
        } else {
          // 评论——取消对评论或评论回复点赞接口
          await cancelTheCommentOrReplyToTheCommentLike(i.com_id)
          i.is_liking = false
          i.like_count -= 1
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 评论列表加载事件
    async onLoad() {
      console.log(11)
      console.log(this.commentList)
      const { data } = await getCommentsOrCommentReplies(
        'a',
        this.ariticleDetailList.art_id,
        this.commentList[this.commentList.length - 1].com_id
      )
      // console.log(data.data.results)
      if (data.data.results.length === 0) {
        this.finished = true
      }
      this.commentList.push(...data.data.results)
      console.log(data)
      this.loading = false
    }
  },
  created() {
    // console.log(this.$router.currentRoute.params.id)
    this.id = this.$router.currentRoute.params.id
    this.getAriticleDetailList()
  }
}
</script>

<style scoped lang="less">
.article {
  padding-bottom: 1.7rem;
}
//导航栏
.navbar {
  :deep(.van-hairline--bottom) {
    background-color: #3296fa;
  }
  :deep(.van-nav-bar__arrow) {
    color: #fff;
  }
  :deep(.van-ellipsis) {
    color: #fff;
  }
}
//头部
.title {
  font-size: 38px;
  font-weight: 700;
  padding: 60px 0 60px 30px;
  color: #3a3a3a;
}
.grid {
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    padding: 0 150px 60px 30px;
  }
  .text {
    color: #323233;
    font-size: 0.37333rem;
    line-height: 0.64rem;
  }
  .right {
    padding-right: 25px;
  }
  //+关注、已关注按钮文字大小
  .van-button__text {
    font-size: 0.37333rem;
  }
  //关注按钮
  .followButton {
    border-color: rgb(50, 150, 250);
    background-color: rgb(50, 150, 250);
    color: #fff;
  }
  //已关注按钮
  .followedButton {
    color: #323233;
    background-color: #fff;
    border: 0.02667rem solid #ebedf0;
    z-index: 99;
  }
  //+关注、已关注按钮宽高
  .van-button--default {
    width: 2.26667rem;
    height: 0.77333rem;
  }
  //+关注的字体图标
  .van-icon-plus {
    margin-right: 8px;
  }
}
p {
  margin: 0;
  padding: 0;
}
// 文章内容左右内边距，外层盒子宽度设置100%，防止背景颜色不一样，内层标签设置可以避免
.center {
  width: 100%;
  article {
    padding: 0 30px;
  }
}
//底部标签页
.footer {
  z-index: 99;
  color: rgb(119, 119, 119);
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  height: 1.17333rem;
  width: 100%;
  background-color: #fff;
  .van-button {
    width: 3.76rem;
    height: 0.61333rem;
    border: 0.02667rem solid #eee;
    font-size: 0.4rem;
    color: #a7a7a7;
  }
  //回复评论弹出层
  .popup {
    display: flex;
    align-items: center;
    padding: 0.42667rem 0 0.42667rem 0.42667rem;
    :deep(.van-field) {
      background-color: #f5f7f9;
      width: 100%;
      z-index: 999;
    }
    //发布按钮
    :deep(.publish) {
      color: #6ba3d8;
      border: unset;
      width: 2rem;
    }
  }
  .van-cell {
    width: unset;
  }
  .van-icon-arrow:before {
    margin-top: 9px;
  }
}
//回复评论的弹出层
.replyPopup {
  .commentReplyButton {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff69b4;
    width: 100%;
    height: 1.33333rem;
    :deep(.van-button--round) {
      width: 8.53333rem;
      height: 1.06667rem;
      background-color: #fff;
      z-index: 999;
    }
    :deep(.van-button--info) {
      color: #323233;
      font-size: 0.37333rem;
      z-index: 99;
      border: unset;
    }
  }
  .replyAll {
    color: #323233;
    font-size: 0.37333rem;
    line-height: 0.64rem;
    padding: 0.26667rem 0.42667rem;
  }
  //回复评论的弹出层
  .popup {
    display: flex;
    align-items: center;
    padding: 0.42667rem 0 0.42667rem 0.42667rem;
    .field {
      background-color: #f5f7f9;
      width: 83%;
    }
    //发布按钮
    :deep(.publish) {
      border: unset;
      font-size: 0.37333rem;
      color: #6ba3d8;
    }
  }
}
</style>
