<template>
  <!-- 评论列表 -->
  <div class="comment">
    <div class="userComment">
      <div class="left-img">
        <van-image
          round
          width="0.96rem"
          height="0.96rem"
          :src="item.aut_photo"
        />
      </div>
      <div class="right-content">
        <div class="top">
          <p class="number">{{ item.aut_name }}</p>
          <div class="like">
            <van-icon
              :name="item.is_liking ? 'good-job' : 'good-job-o'"
              :color="item.is_liking ? 'red' : '#000'"
              @click="likesOfTheArticleCommentListFn"
            />
            <span>{{ item.like_count === 0 ? '赞' : item.like_count }}</span>
          </div>
        </div>
        <div class="middle">{{ item.content }}</div>
        <div class="bottom">
          <span>{{ dayjs(item.pubdate).fromNow() }}</span>
          <van-button round @click="clickTheReplyButtonFn"
            >回复 {{ item.reply_count }}</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  data() {
    return {
      dayjs
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 回复按钮点击事件
    clickTheReplyButtonFn() {
      // console.log(this.item)
      this.$emit('replyButtonFn', this.item)
    },
    // 文章评论列表的点赞事件
    likesOfTheArticleCommentListFn() {
      // console.log(this.item)
      this.$emit('likesOfTheArticleCommentList', this.item)
    }
  }
}
</script>

<style scoped lang="less">
//评论
.comment {
  padding: 0 0.42667rem;
  .userComment {
    display: flex;
    border-bottom: 0.02667rem solid #ebedf0;
    padding: 0.26667rem 0;
  }
  .left-img {
    padding-left: 10px;
  }
  .right-content {
    flex: 1;
    margin-left: 20px;
    align-items: flex-start;
    padding-right: 10px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .number {
      color: #406599;
      font-size: 0.34667rem;
    }
    .van-icon[data-v-09eba30e] {
      font-size: 0.4rem;
      margin-right: 10px;
    }
    .like {
      width: 70px;
      height: 20px;
      line-height: 0.4rem;
      .van-icon {
        margin-bottom: 10px;
      }
    }
    .like > span {
      font-size: 0.25333rem;
      line-height: 19.5px;
    }
  }
  .middle {
    font-size: 0.42667rem;
    color: #222;
  }
  .bottom > span {
    font-size: 0.25333rem;
    color: #222;
    margin-right: 0.33333rem;
  }
  .bottom {
    .van-button--round {
      white-space: nowrap;
      width: 1.8rem;
      height: 0.64rem;
      line-height: 0.64rem;
      font-size: 0.28rem;
      color: #222;
    }
  }
  .van-icon[data-v-09eba30e] {
    font-size: 0.4rem;
    margin-right: 10px;
  }
}
</style>
