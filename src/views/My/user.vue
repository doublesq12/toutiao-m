<template>
  <div>
    <!--头部个人信息-->
    <div class="header">
      <van-nav-bar title="个人信息" left-arrow @click-left="backToPrePage" />
    </div>
    <!-- 列表 -->
    <!-- 头像 -->
    <input type="file" ref="file" hidden />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image round width="40" height="40" :src="UserInformation.photo" />
    </van-cell>
    <van-popup v-model="show" height="300px" position="bottom">
      <UpdatePhoto :photo="photo" @confirmClickFn="confirmFn"></UpdatePhoto>
    </van-popup>
    <!-- 昵称 -->
    <div class="nickname">
      <van-cell
        title="昵称"
        @click="showPopupNickname"
        is-link
        :value="UserInformation.name"
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
        <van-field
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          show-word-limit
        />
      </van-popup>
    </div>
    <!-- 性别 -->
    <div class="gender">
      <van-cell
        title="性别"
        @click="showPopupGender"
        is-link
        :value="UserInformation.gender == '0' ? '男' : '女'"
      />
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
        :value="UserInformation.birthday"
      />
      <van-popup
        v-model="birthdayShow"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-datetime-picker
          v-model="UserInformation.birthday"
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
// 引入用户——编辑用户个人资料接口
import { editUserProfile, getUserProfile } from '@/api'
import UpdatePhoto from './UpdatePhoto.vue'
export default {
  data() {
    return {
      nicknameShow: false,
      genderShow: false,
      birthdayShow: false,
      columns: ['男', '女'],
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17),
      gender: '',
      nicknameValue: '',
      message: '',
      show: false,
      photo: '',
      UserInformation: {}
    }
  },
  components: {
    UpdatePhoto
  },
  methods: {
    backToPrePage() {
      this.$router.back()
    },
    // 昵称的点击事件
    showPopupNickname() {
      this.nicknameShow = true
    },
    // 性别的点击事件
    showPopupGender() {
      this.genderShow = true
    },
    // 生日的点击事件
    showPopupBirthday() {
      this.birthdayShow = true
    },
    // 昵称的取消事件
    onClickLeft() {
      this.nicknameShow = false
    },
    // 昵称的保存事件
    async onClickRight() {
      try {
        await editUserProfile({ name: this.message })
        this.nicknameShow = false
        this.UserInformation.name = this.message
      } catch (error) {
        console.log(error)
      }
    },
    // 性别的取消事件
    onCancel() {
      this.genderShow = false
    },
    // 性别的确认事件
    async onConfirm(value) {
      let res = 0
      if (value === '女') {
        res = 1
      }
      try {
        const data = await editUserProfile({ gender: res })
        this.genderShow = false
        console.log(data)
        this.gender = value
        if (value === '女') {
          this.UserInformation.gender = 1
        } else {
          this.UserInformation.gender = 0
        }

        // this.gender = data.data.gender
      } catch (error) {
        console.log(error)
      }
    },
    // 生日确认事件
    async completeFn(a) {
      // 先下包，在第四天笔记yarn add dayjs，然后utils下新建dayjs.js
      // this.birthdayDate = dayjs(a).format('YYYY-MM-DD')
      try {
        await editUserProfile({ birthday: dayjs(a).format('YYYY-MM-DD') })
        this.birthdayShow = false
        this.UserInformation.birthday = dayjs(a).format('YYYY-MM-DD')
      } catch (error) {
        console.log(error)
      }
    },
    // 获取个人信息
    async getUserProfile() {
      const { data } = await getUserProfile()
      // console.log(data.data)
      this.UserInformation = data.data
    },
    // 生日的取消事件
    cancelFn() {
      this.birthdayShow = false
    },
    // 图片的剪裁事件
    confirmFn(croppedPicture) {
      console.log(croppedPicture)
      this.UserInformation.photo = croppedPicture
      this.show = false
    }
  },
  mounted() {
    this.$refs.file.addEventListener('change', (e) => {
      // this.photo = e.target.files[0]
      const file = e.target.files[0]
      // file = URL.createObjectURL(file)
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = (e) => {
        this.photo = e.target.result
        this.show = true
      }
      // this.photo = file
      // console.log(photo)
      // this.show = true
    })
  },
  created() {
    this.getUserProfile()
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
