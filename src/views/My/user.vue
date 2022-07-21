<template>
  <div>
    <!--头部个人信息-->
    <div class="header">
      <van-nav-bar title="个人信息" left-arrow @click-left="backToPrePage" />
    </div>
    <!-- 列表 -->
    <!-- 头像 -->
    <van-cell title="头像" is-link />
    <!-- 昵称 -->
    <div class="nickname">
      <van-cell
        title="昵称"
        @click="showPopupNickname"
        is-link
        value="15958039196"
      />
      <van-popup
        v-model="nicknameShow"
        position="bottom"
        :style="{ height: '100%' }"
      >
        <van-nav-bar
          title="更新昵称"
          left-text="取消"
          right-text="保存"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
          class="popup-bottom"
        />
      </van-popup>
    </div>
    <!-- 性别 -->
    <div class="gender">
      <van-cell title="性别" @click="showPopupGender" is-link :value="gender" />
      <van-popup
        v-model="genderShow"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-picker
          title="更新性别"
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </van-popup>
    </div>
    <!-- 生日 -->
    <div class="birthday">
      <van-cell
        title="生日"
        @click="showPopupBirthday"
        is-link
        :value="birthdayDate"
      />
      <van-popup
        v-model="birthdayShow"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="completeFn"
          @cancel="cancelFn"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  data() {
    return {
      nicknameShow: false,
      genderShow: false,
      birthdayShow: false,
      columns: ['男', '女'],
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17),
      birthdayDate: '',
      gender: ''
    }
  },
  methods: {
    backToPrePage() {
      this.$router.back()
    },
    showPopupNickname() {
      this.nicknameShow = true
    },
    showPopupGender() {
      this.genderShow = true
    },
    showPopupBirthday() {
      this.birthdayShow = true
    },
    onClickLeft() {
      this.nicknameShow = false
    },
    onClickRight() {
      this.$toast('按钮')
    },
    onConfirm(value) {
      console.log(value)
      this.gender = value
      this.$toast.success('更新成功')
      this.genderShow = false
    },
    onCancel() {
      this.genderShow = false
    },
    // 生日时间选择完成事件
    completeFn(a) {
      // 先下包，在第四天笔记yarn add dayjs，然后utils下新建dayjs.js
      this.birthdayDate = dayjs(a).format('YYYY-MM-DD')
      this.$toast.success('更新成功')
      this.birthdayShow = false
    },
    cancelFn() {
      this.birthdayShow = false
    }
  }
}
</script>

<style scoped lang="less">
:deep(.header) {
  .van-hairline--bottom[data-v-da774bf8] .van-ellipsis {
    color: #fff !important;
  }
}
.van-hairline--bottom {
  background-color: #3296fa;
  :deep(.van-nav-bar__arrow) {
    color: #fff;
  }
}
.nickname {
  :deep(.popup-bottom) {
    background-color: #fff;
    :deep(.van-hairline--bottom[data-v-da774bf8] .van-ellipsis) {
      color: #000;
    }
  }
}
</style>
