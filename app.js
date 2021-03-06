App({
  globalData: {
    url: "https://zuel.harryshaun.wang",
    token: wx.getStorageSync("token"),
    isverified: false,
    curTeacher: "刘萍"
  },
  onLaunch() {
    console.log("初始化");
    wx.getSystemInfo({
      success: (result) => {
        this.globalData.statusBarHeight = result.statusBarHeight;
      }
    });
    this.checkLoginStatus();
    this.checkVerifyStatus();
  },
  checkLoginStatus: function () {
    if (this.globalData.token) {
      console.log("token:", this.globalData.token);
      // 检验session_key是否过期
      wx.checkSession({
        fail: () => {
          console.log("token expired!");
          this.login();
        }
      });
    }
    else {
      this.login();
      console.log("login!");
    }
  },
  login: function () {
    return new Promise(function (resolve, reject) {
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: "https://zuel.harryshaun.wang/users/checkuser",
              data: { code: res.code },
              header: { 'content-type': 'application/json' },
              method: 'POST',
              success: (res) => {
                wx.setStorageSync("token", res.data.data);
                resolve(res.data.data);
              }
            });
          }
        }
      });
    });
  },
  // 获取该用户身份认证状况
  checkVerifyStatus: function () {
    wx.request({
      url: `${this.globalData.url}/users/isverified`,
      header: { 'content-type': 'application/json', "authorization": `Bearer ${this.globalData.token}` },
      success: (res) => {
        if (res.data.data) {
          this.globalData.isverified = res.data.data;
        }
      }
    });
  },
});