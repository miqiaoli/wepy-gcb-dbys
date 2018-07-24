import wepy from 'wepy'
import {
  __getApi
} from '../config.js'

export default class userMixin extends wepy.mixin {
  /* ============= 工具方法（mixins没法复写，就再写一遍了） ============= */
  isFunction(item) {
    return typeof item === 'function'
  }
  async $needLogin(callback) {
    // 首次获取用户信息
    await this.$login(callback)
    // this.$login(() => {
    //   // 再获取用户信息
    //   this._wxUserInfo(token_access, callback)
    // })
  }
  /* ========================== 用户方法 ========================== */
  // 获取用户信息
  $getUserInfo(callback) {
    // 顶级容错
    if (!this.$parent || !this.$parent.$updateGlobalData) return
    // 取缓存信息
    const user = this.$parent.$updateGlobalData('user')
    // 不重复获取用户信息
    if (user && user.nickName) {
      this.isFunction(callback) && callback(user)
      this.$apply()
      return user
    }

    this.$login(callback)
    // this.$login(() => {
    //   this._wxUserInfo(token_access, callback)
    // })
  }

  // 进行微信登陆
  async $login(success = () => {}, noAutoLogin) {
    wepy.showLoading({
      title: '加载中',
    })
    const token_access = wepy.getStorageSync('token_access')
    const that = this
    // 先登录
    const login = await wepy.login()
    const res = await wepy.request({
      url: __getApi._getPrivacyToken,
      data: {
        token_access: token_access,
        code: login.code
      }
    })
    wx.hideLoading()
    if (res.data.data.status == 0) {
      wx.reLaunch({
        url: '/pages/user/login?token_access=' + res.data.data.token_access
      })
    } else {
      wx.setStorage({
        key: "token_access",
        data: res.data.data.token_access
      })
      that.$parent.$updateGlobalData('token_access', res.data.data.token_access)
      that.isFunction(success) && success(res.data.data.token_access)
      that.$apply
    }
    // wepy.login({
    //   success: (res) => {
    //     wepy.request({
    //       url: __getApi._getPrivacyToken,
    //       data: {
    //         token_access: token_access,
    //         code: res.code
    //       },
    //       success: function(res) {
    //         console.log('wx.request.success:', res)
    //         // this.$parent.globalData.token_access = res.data.token_access;
    //         if (res.data.data.status == 0) {
    //           wx.reLaunch({
    //             url: '/pages/user/login?token_access=' + res.data.data.token_access
    //           })
    //         } else {
    //           wx.setStorage({
    //             key: "token_access",
    //             data: res.data.data.token_access
    //           })
    //           that.$parent.$updateGlobalData('token_access', res.data.data.token_access)
    //         }
    //       },
    //       complete: function(res) {
    //         wx.hideLoading()
    //       }
    //
    //     })
    //
    //     // 串行回调
    //     this.isFunction(success) && success(res)
    //     // this.isFunction(callback) && callback(user)
    //     this.$apply()
    //   },
    //   fail: (res) => {
    //     console.log('wepy.login.fail:', res)
    //   }
    // })

    // wx.login({
    //   success: (res) => {
    //     console.log('wx.login.success:', res)
    //
    //     // 如果不需要自动登录，就return
    //     if (noAutoLogin) {
    //       // 串行回调
    //       this.isFunction(success) && success(res)
    //       this.$apply()
    //       return
    //     }
    //
    //     this.$parent.$updateGlobalData('user', {
    //       code: res.code
    //     })
    //
    //     // 串行回调
    //     this.isFunction(success) && success(res)
    //     this.$apply()
    //   },
    //   fail: (res) => {
    //     console.log('wx.login.fail:', res)
    //   }
    // })
  }

  /* ========================= 其他方法 ========================= */
  // 获取用户公开信息（微信）
  _wxUserInfo(token_access, callback) {
    wx.getUserInfo({
      success: (res) => {
        console.log('wx.getUserInfo.success:', res)
        // 缓存用户信息
        const user = this.$parent.$updateGlobalData('user', res.userInfo)
        const that = this
        wx.request({
          url: __getApi._getPrivacyToken,
          data: {
            token_access: token_access,
            code: user.code,
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: function(res) {
            console.log('wx.request.success:', res)
            // this.$parent.globalData.token_access = res.data.token_access;
            if (res.data.data.status == 0) {
              wx.reLaunch({
                url: '/pages/user/login?token_access=' + res.data.data.token_access
              })
            } else {
              wx.setStorage({
                key: "token_access",
                data: res.data.data.token_access
              })
              that.$parent.$updateGlobalData('token_access', res.data.data.token_access)
            }
          },
          complete: function(res) {
            wx.hideLoading()
          }

        })
        this.isFunction(callback) && callback(user)
        this.$apply()
      },
      fail: (res) => {
        console.log('wx.getUserInfo.fail:', res)
        // 用户拒绝授权:填充默认数据
        const user = this.$parent.$updateGlobalData('user', {
          nickName: '未授权',
          avatarUrl: '/images/icon/icon-avatar@2x.png'
        })

        // 串行回调
        this.isFunction(callback) && callback(user)
        this.$apply()

        // 尝试授权
        this._wxAuthModal(callback)
      }
    })
  }

  // 提示用户开启授权
  _wxAuthModal(callback) {
    // 先判断是否支持开启授权页的API
    wx.openSetting && wx.showModal({
      title: '授权提示',
      content: '第八元素希望获得以下权限：\n · 获取您的公开信息（昵称、头像等）',
      confirmText: '去授权',
      cancelText: '先不授权',
      success: (res) => {
        if (res.confirm) {
          console.log('_wxAuthModal.showModal: 用户点击确定', res)
          this._wxOpenSetting(callback)
        }
      }
    })
  }

  // 打开授权页
  _wxOpenSetting(callback) {
    wx.openSetting && wx.openSetting({
      success: ({
        authSetting
      }) => {
        console.log('wx.openSetting.success', authSetting)
        if (authSetting['scope.userInfo']) {
          // 用户打开设置，重新获取信息
          this._wxUserInfo(callback)
        }
      }
    })
  }
}
