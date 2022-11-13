; (function ($) {
  var Common = function () {
    this.$nav = $('#J_nav')
    this.$nav_line = this.$nav.find('.nav-line')
    this.$drop_menu = $('#J_drop_menu')
    this.$btn_login = $('.J_btn_login')
    this.$btn_personal = $('.J_btn_personal')
    this.$btn_logout = $('.J_btn_logout')
    this.$btn_change = $('.J_btn_change')
    this.$change_panel = $('#J_change_panel')
    this.$pop_panel = $('#J_pop_panel')
    this.$pop_login = this.$pop_panel.find('.pop-login')
    this.$pop_register = this.$pop_panel.find('.pop-register')
    this.$pop_verified = $('#J_pop_verified') //实名认证弹窗
    this.$user_avatar = $('#J_user_avatar') //个人中心头像
    this.$service_my = $('#J_service_my') //客服中心头像
    this.$copyright = $('#copyright') //版权
    this.sms_timer = null //短信验证码倒计时
    this.is_captcha = false //图片验证码
    this.config = config //首页配置问题（企点qq）
  }

  $.support.cors = true
  $.extend(Common.prototype, {
    init: function () {
      this.initialize()
      this.inputClear()
      this.bindEvent()
    },
    initialize: function () {
      // 设置cookie
      if (window.kfLoginCookies) {
        window.kfLoginCookies.saveUserData()
        window.kfLoginCookies.getSyncUserData()
      }
      var that = this,
        acc = storage.getItem('sy_acc'),
        is_real = storage.getItem('sy_is_real'),
        acc_info = storage.getItem('sy_acc_info')

      if (acc != null) {
        that.$btn_login.hide()
        that.$btn_personal.css('display', 'block')
        that.$btn_logout.css('display', 'block')

        that.getAccInfo() //实时更新个人信息数据

        // if (acc_info == null) {
        //   that.getAccInfo()
        // } else {
        //   that.setAccInfo(acc_info)
        // }
      } else {
        that.$btn_login.show()
        that.$btn_personal.css('display', 'none')
        that.$btn_logout.css('display', 'none')
      }

      that.setNav()
      that.setFooter()
    },
    bindEvent: function () {
      this.$nav.on('mouseover', 'li', $.proxy(this.moveNav, this))
      this.$nav.on('mouseleave', 'li', $.proxy(this.leaveNav, this))
      this.$drop_menu.on('click', '.avatar', $.proxy(this.showDropMenu, this))
      this.$btn_login.on('click', $.proxy(this.showPopLog, this))
      this.$btn_logout.on('click', $.proxy(this.logout, this))
      this.$btn_change.on('click', $.proxy(this.handleShowChange, this))
      this.$change_panel.on('click', '.get-sms', $.proxy(this.getPwdSms, this, this.$change_panel, 'findpwd_auth'))
      this.$pop_panel.on('click', '.login-menu li', $.proxy(this.loginTab, this))
      this.$pop_panel.on('click', '.pop-reg-btn', $.proxy(this.showPopReg, this))
      this.$pop_panel.on('click', '.pop-log-btn', $.proxy(this.showPopLog, this))
      this.$pop_panel.on('click', '.pop-close', $.proxy(this.hidePopPanel, this))
      this.$pop_panel.on('click', '.pop-btn-login', $.proxy(this.login, this))
      this.$pop_panel.on('click', '.pop-btn-register', $.proxy(this.register, this))
      this.$pop_panel.on('click', '.refresh-captcha', $.proxy(this.refreshCaptcha, this))
      this.$pop_login.on('click', '.get-sms', $.proxy(this.getSms, this, this.$pop_login, 'phone_login'))
      this.$pop_register.on('click', '.get-sms', $.proxy(this.getSms, this, this.$pop_register, 'phone_reg_login'))
      $(document).on('click', $.proxy(this.hideDropMenu, this))
    },
    handleShowChange: function () {
      var acc = storage.getItem('sy_acc')
      if (acc == null) {
        window.location.href = 'login.html'
      }

      var personal_info = storage.getItem('sy_acc_info')
      if (personal_info == null) {
        getInfo()
      }

      if (acc['phone_number'] == '') {
        $('body').toast({
          content: '请先绑定手机',
          isCenter: true,
          duration: 2000
        })
        setTimeout(function () {
          window.location.href = 'phone_bind.html'
        }, 1000)
      } else {
        window.location.href = 'change_pwd.html'
      }
    },
    setNav: function () {
      var that = this,
        q = location.href.indexOf('?'),
        s = location.href.lastIndexOf('/') + 1,
        m = q == -1 ? location.href.substring(s) : location.href.substring(s, q)

      that.$nav.find('li').removeClass('cur')

      if (m == 'index.html' || location.pathname == '/') {
        that.navLine(that.$nav.find('li').eq(0))
        that.$nav.find('li').eq(0).addClass('cur')
      } else if (m == 'games.html') {
        that.navLine(that.$nav.find('li').eq(1))
        that.$nav.find('li').eq(1).addClass('cur')
      } else if (m == 'gifts.html') {
        that.navLine(that.$nav.find('li').eq(2))
        that.$nav.find('li').eq(2).addClass('cur')
      } else if (m == 'about.html') {
        that.navLine(that.$nav.find('li').eq(3))
        that.$nav.find('li').eq(3).addClass('cur')
      } else if (m == 'join.html' || m == 'society.html') {
        that.navLine(that.$nav.find('li').eq(4))
        that.$nav.find('li').eq(4).addClass('cur')
      }
      // 客服首页
      if (/kf\.shiyue\.com/.test(document.domain)) {
        this.$nav_line.stop().animate({ left: '-100px' }, 300)
        that.$nav.find('li').removeClass('cur')
      }
    },
    setFooter: function () {
      var year = new Date().getFullYear()
      this.$copyright.html('广州诗悦网络科技有限公司 版权所有 Copyright © ' + year + ' shiyue.com. All Rights Reserved.')
    },
    navLine: function (obj) {
      var currentWidth = obj.width(),
        left = obj.index() * (this.$nav.find('li').width() + parseInt(this.$nav.find('li').css('margin-right')))

      this.$nav_line.stop().animate({ left: left }, 300)
    },
    moveNav: function (e) {
      var e = e || window.event,
        current = e.currentTarget
      this.navLine($(current))
    },
    leaveNav: function (e) {
      var e = e || window.event,
        current = e.currentTarget,
        isHas = this.$nav.find('li').hasClass('cur'),
        isActive = this.$nav.find('li.cur')

      if (isHas) {
        this.navLine(isActive)
      } else {
        this.$nav_line.stop().animate({ left: '-100px' }, 300)
      }
    },
    //阻止冒泡
    stopBubble: function (e) {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      } else {
        window.event.cancelBubble = true
      }
    },
    //显示下拉菜单
    showDropMenu: function (e) {
      this.stopBubble(e)
      this.$drop_menu.find('.drop-menu').slideToggle('500')
      this.$drop_menu.find('.avatar i').toggleClass('show')
    },
    //隐藏下拉菜单
    hideDropMenu: function (e) {
      this.$drop_menu.find('.drop-menu').hide()
      this.$drop_menu.find('.avatar i').removeClass('show')
    },
    //登录方式切换
    loginTab: function (e) {
      var e = e || window.event,
        current = e.currentTarget,
        index = $(current).index()

      $(current).addClass('cur').siblings().removeClass('cur')

      this.$pop_panel.find('.pop-group-box').eq(index).show().siblings('.pop-group-box').hide()
    },
    //显示登录
    showPopLog: function (e) {
      var user = storage.getItem('sy_user'),
        login_type = this.$pop_login.find('.login-menu li.cur').attr('data-login_type')

      if (user != null) {
        if (login_type == '1') {
          this.$pop_login.find('input[name="username"]').val(user)
        } else {
          this.$pop_login.find('input[name="phone"]').val(user)
        }
      }

      this.$drop_menu.find('.drop-menu').removeClass('show')
      this.$pop_panel.show()
      this.$pop_panel.find('.pop-register').hide()
      this.$pop_panel.find('.pop-login').show()

      var login_number = storage.getItem('login_number') == null ? 0 : storage.getItem('login_number')
      if (login_number >= 5) {
        this.$pop_login.find('input[name="captcha"]').val('')
        this.getCaptcha('login')
      }
    },
    //显示注册
    showPopReg: function () {
      this.$pop_panel.show()
      this.$pop_panel.find('.pop-login').hide()
      this.$pop_panel.find('.pop-register').show()
    },
    //隐藏登录注册
    hidePopPanel: function (e) {
      this.$pop_panel.hide()
      this.$pop_panel.find('.pop-login').hide()
      this.$pop_panel.find('.pop-register').hide()
    },
    //是否手机
    isPhone: function (str) {
      var phone_reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (phone_reg.test(str)) {
        return true
      } else {
        return false
      }
    },
    //是否身份证
    isIdentityCard: function (str) {
      var identity_card_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (identity_card_reg.test(str)) {
        return true
      } else {
        return false
      }
    },
    //获取账号相关信息
    getAccInfo: function () {
      var that = this,
        token = storage.getItem('sy_token'),
        api_params = {}
      api_params['token'] = token
      api_params['ts'] = Math.round(new Date() / 1000)
      api_params['sign'] = sign(api_params, config.sdkapi_secret)

      $.ajax({
        url: config.sdkapi_web_url + '/web/personalInfo',
        data: api_params,
        type: 'post',
        success: function (response) {
          if (response.code == 0 && response.data.length != 0) {
            var acc_info = response.data
            storage.setItem('sy_acc_info', acc_info)
            that.setAccInfo(acc_info)
          } else if (response.code == 1003) {
            that.refreshToken(token, $.proxy(that.getAccInfo, that))
          } else if (response.code == 1101 || response.code == 1006) {
            storage.removeItem('sy_acc_info')
          } else if (response.code == 1132) {
            $('body').toast({
              content: '系统繁忙，请稍候再试~',
              duration: 2000,
            })
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status != 200) {
            $('body').toast({
              content: '系统繁忙，请稍候再试~',
              duration: 2000,
            })
          }
        },
      })
    },
    //设置账号相关信息
    setAccInfo: function (acc_info) {
      var acc = storage.getItem('sy_acc')

      if (acc_info['portrait'] != '') {
        this.$drop_menu.find('.avatar img').attr('src', acc_info['portrait'])
        this.$user_avatar.find('img').attr('src', acc_info['portrait'])
        this.$service_my.find('.user-avatar img').attr('src', acc_info['portrait'])
      }

      var name = acc['phone_number'] == '' ? acc['name'] : (acc['phone_number'].slice(0, 3) + '****' + acc['phone_number'].slice(-4))
      this.$drop_menu.find('.avatar span').text(name)
      this.$service_my.find('.user-account span').text(name)

      var currency = acc_info['currency'] == '' ? '0' : acc_info['currency']
      this.$service_my.find('.user-balance span').text('(' + currency + ')')
    },
    //刷新Token
    refreshToken: function (token, callback) {
      var that = this,
        api_params = {}
      api_params['token'] = token
      api_params['ts'] = Math.round(new Date() / 1000)
      api_params['sign'] = sign(api_params, config.sdkapi_secret)

      $.ajax({
        url: config.sdkapi_web_url + '/web/token/refresh',
        type: 'post',
        data: api_params,
        success: function (response) {
          if (response.code == 0) {
            storage.setItem('sy_token', response.data.token)
            callback && callback()
          } else {
            console.log(response.message)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status != 200) {
            console.log('请求出错')
          }
        },
      })
    },
    //登录
    login: function (e) {
      var that = this,
        login_url = '/web/login',
        api_params = {},
        login_type = that.$pop_login.find('.login-menu li.cur').attr('data-login_type'),
        is_remember = that.$pop_login.find('input[name="remember"]').is(':checked')

      // 公用参数
      api_params['source_mod'] = that.config.source_mod
      api_params['os_type'] = that.config.os_type
      api_params['sdk_ver'] = that.config.sdk_ver
      api_params['dev_str'] = that.config.dev_str

      //账号密码登录
      if (login_type == '1') {
        login_url = '/web/login'

        api_params['phone_number'] = that.$pop_login.find('input[name="username"]').val()
        api_params['password'] = that.$pop_login.find('input[name="pwd"]').val()

        if (api_params['phone_number'] == '') {
          that.$pop_login.toast({
            content: '请输入手机号/账号~',
            duration: 3000,
          })
          return false
        }

        var login_number = storage.getItem('login_number') == null ? 0 : storage.getItem('login_number')
        if (login_number >= 5 || that.is_captcha) {
          api_params['code'] = that.$pop_login.find('input[name="captcha"]').val()
          that.$pop_login.find('.captcha').show()

          if (api_params['code'] == '') {
            that.$pop_login.toast({
              content: '请输入验证码~',
              duration: 3000,
            })
            return false
          }
        }

        if (api_params['password'] == '') {
          that.$pop_login.toast({
            content: '请输入密码~',
            duration: 3000,
          })
          return false
        }
      } else {
        //短信登录登录
        login_url = '/web/phoneLogin'
        api_params['phone_number'] = that.$pop_login.find('input[name="phone"]').val()
        api_params['code'] = that.$pop_login.find('input[name="code"]').val()

        if (api_params['phone_number'] == '' || !that.isPhone(api_params['phone_number'])) {
          that.$pop_login.toast({
            content: '请输入11位手机号码~',
            duration: 2000,
          })
          return false
        }

        if (api_params['code'] == '') {
          that.$pop_login.toast({
            content: '请输入短信验证码~',
            duration: 2000,
          })
          return false
        }

        if (!/^[0-9]{4}$/.test(api_params['code'])) {
          that.$pop_login.toast({
            content: '请输入正确短信验证码~',
            duration: 2000,
          })
          return false
        }
      }

      api_params['ts'] = Math.round(new Date() / 1000)
      api_params['sign'] = sign(api_params, that.config.sdkapi_secret)

      $.ajax({
        url: that.config.sdkapi_web_url + login_url,
        data: api_params,
        type: 'post',
        success: function (response) {
          if (response.code == 0) {
            storage.setItem('sy_acc', response.data, 10 * 60 * 60 * 1000)
            storage.setItem('sy_is_real', response.data.is_real, 10 * 60 * 60 * 1000)
            storage.setItem('sy_token', response.data.token)
            storage.removeItem('login_number')
            // 设置cookie
            if (window.kfLoginCookies) {
              window.kfLoginCookies.saveUserData()
            }

            if (is_remember) {
              storage.setItem('sy_user', api_params['phone_number'])
            } else {
              storage.removeItem('sy_user')
            }

            that.$btn_login.hide()
            that.$btn_personal.css('display', 'block')
            that.$btn_logout.css('display', 'block')

            that.$pop_login.hide()
            that.$pop_panel.hide()

            window.location.reload()
          } else {
            if (response.code == 1101 || response.code == 1007 || response.code == 1102) {
              login_number++
              storage.setItem('login_number', login_number, 10 * 60 * 1000)
            }

            if (login_number >= 5 || response.code == 1007) {
              that.getCaptcha('login')
            }

            that.$pop_login.toast({
              content: response.message,
              duration: 2000,
            })
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status != 200) {
            that.$pop_login.toast({
              content: '系统繁忙，请稍候再试~',
              duration: 2000,
            })
          }
        },
      })
    },
    //登出
    logout: function (e) {
      storage.removeItem('sy_acc')
      storage.removeItem('sy_is_real')
      storage.removeItem('sy_acc_info')
      storage.removeItem('sy_token')
      // 设置cookie
      if (window.kfLoginCookies) {
        window.kfLoginCookies.removeUserData()
      }
      window.location.href = ''
    },
    //注册
    register: function (e) {
      var that = this,
        api_params = {},
        is_agreement = that.$pop_register.find('input[name="agreement"]').is(':checked'),
        phone_number = that.$pop_register.find('input[name="phone"]').val(),
        ph_code = that.$pop_register.find('input[name="code"]').val(),
        password = that.$pop_register.find('input[name="pwd"]').val(),
        repassword = that.$pop_register.find('input[name="cpwd"]').val(),
        card_name = that.$pop_register.find('input[name="card_name"]').val(),
        card_id = that.$pop_register.find('input[name="card_id"]').val()

      // 公用参数
      api_params['source_mod'] = that.config.source_mod
      api_params['os_type'] = that.config.os_type
      api_params['sdk_ver'] = that.config.sdk_ver
      api_params['dev_str'] = that.config.dev_str

      if (!is_agreement) {
        that.$pop_register.toast({
          content: '请勾选“同意诗悦网络用户协议”',
          duration: 2000,
        })
        return false
      }

      if (phone_number == '' || !that.isPhone(phone_number)) {
        that.$pop_register.toast({
          content: '请输入11位手机号码~',
          duration: 2000,
        })
        return false
      }

      if (ph_code == '') {
        that.$pop_register.toast({
          content: '请输入短信验证码~',
          duration: 2000,
        })
        return false
      }

      if (!/^[0-9]{4}$/.test(ph_code)) {
        that.$pop_register.toast({
          content: '请输入正确短信验证码~',
          duration: 2000,
        })
        return false
      }

      if (password == '') {
        that.$pop_register.toast({
          content: '请输入密码~',
          duration: 2000,
        })
        return false
      }

      if (!/^[a-zA-Z0-9]{6,20}$/.test(password)) {
        that.$pop_register.toast({
          content: '密码必须由6-20位字母、数字组成~',
          duration: 2000,
        })
        return false
      }

      if (password != repassword) {
        that.$pop_register.toast({
          content: '请确认密码是否一致',
          duration: 2000,
        })
        return false
      }

      if (card_name == '') {
        that.$pop_register.toast({
          content: '请输入真实姓名~',
          duration: 2000,
        })
        return false
      }

      if (!that.isIdentityCard(card_id)) {
        that.$pop_register.toast({
          content: '请输入有效的18位身份证号码~',
          duration: 2000,
        })
        return false
      }

      api_params['phone_number'] = phone_number
      api_params['password'] = password
      api_params['ph_code'] = ph_code
      api_params['sms_type'] = 'phone_reg_login'
      api_params['card_id'] = card_id
      api_params['card_name'] = card_name
      api_params['ts'] = Math.round(new Date() / 1000)
      api_params['sign'] = sign(api_params, that.config.sdkapi_secret)

      $.ajax({
        url: that.config.sdkapi_web_url + '/web/phoneReg',
        type: 'post',
        data: api_params,
        success: function (response) {
          if (response.code == 0) {
            storage.setItem('sy_acc', response.data, 10 * 60 * 60 * 1000)
            storage.setItem('sy_is_real', response.data.is_real, 10 * 60 * 60 * 1000)
            storage.setItem('sy_token', response.data.token)
            window.location.href = 'personal.html'
          } else {
            that.$pop_register.toast({
              content: response.message,
              duration: 2000,
            })
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status != 200) {
            that.$pop_register.toast({
              content: '服务器出小差，请稍候再试~',
              duration: 2000,
            })
          }
        },
      })
    },
    //获取图片验证码
    getCaptcha: function (type) {
      var that = this,
        api_params = {}
      api_params['type'] = type || 'login'
      api_params['ts'] = Math.round(new Date() / 1000)
      api_params['sign'] = sign(api_params, that.config.sdkapi_secret)

      $.ajax({
        url: that.config.sdkapi_web_url + '/web/captcha',
        type: 'post',
        data: api_params,
        success: function (response) {
          if (response.code == 0) {
            that.is_captcha = true
            that.$pop_login.find('.pic-captcha').attr('src', response.data.captcha)
            that.$pop_login.find('input[name="captcha"]').val()
            that.$pop_login.find('.captcha').show()
          } else {
            that.$pop_login.toast({
              content: '获取图片验证码失败，请稍候再试~',
              isCenter: true,
              duration: 2000,
            })
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status != 200) {
            that.$pop_login.toast({
              content: '获取图片验证码失败，请稍候再试~',
              isCenter: true,
              duration: 2000,
            })
          }
        },
      })
    },
    //刷新图片验证码
    refreshCaptcha: function (e) {
      this.getCaptcha('login')
    },
    //获取短信验证码
    getPwdSms: function (obj, sms_type) {
      var acc = storage.getItem('sy_acc')
      var that = this,
        api_params = {},
        phone_number = acc['phone_number']

      if (phone_number == '' || !that.isPhone(phone_number)) {
        obj.toast({
          content: '请输入11位手机号码~',
          duration: 2000,
        })
        return false
      }

      api_params['phone_number'] = phone_number
      api_params['sms_type'] = sms_type
      api_params['ts'] = Math.round(new Date() / 1000)
      api_params['sign'] = sign(api_params, that.config.sdkapi_secret)

      that.countDown(obj.find('.get-sms'))

      $.ajax({
        url: that.config.sdkapi_web_url + '/web/sms/send',
        type: 'post',
        data: api_params,
        success: function (response) {
          if (response.code == 0) {
            obj.toast({
              content: '手机验证码发送成功~',
              duration: 2000,
            })
          } else {
            obj.find('.get-sms').text('获取验证码').removeAttr('disabled').removeClass('gray')
            clearInterval(that.sms_timer)

            obj.toast({
              content: response.message,
              duration: 2000,
            })
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status != 200) {
            obj.toast({
              content: '服务器出小差，请稍候再试~',
              duration: 2000,
            })
          }
        },
      })
    },
    //获取短信验证码
    getSms: function (obj, sms_type) {
      var that = this,
        api_params = {},
        phone_number = obj.find('input[name="phone"]').val()

      if (phone_number == '' || !that.isPhone(phone_number)) {
        obj.toast({
          content: '请输入11位手机号码~',
          duration: 2000,
        })
        return false
      }

      api_params['phone_number'] = phone_number
      api_params['sms_type'] = sms_type
      api_params['ts'] = Math.round(new Date() / 1000)
      api_params['sign'] = sign(api_params, that.config.sdkapi_secret)

      that.countDown(obj.find('.get-sms'))

      $.ajax({
        url: that.config.sdkapi_web_url + '/web/sms/send',
        type: 'post',
        data: api_params,
        success: function (response) {
          if (response.code == 0) {
            obj.toast({
              content: '手机验证码发送成功~',
              duration: 2000,
            })
          } else {
            obj.find('.get-sms').text('获取验证码').removeAttr('disabled').removeClass('gray')
            clearInterval(that.sms_timer)

            obj.toast({
              content: response.message,
              duration: 2000,
            })
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status != 200) {
            obj.toast({
              content: '服务器出小差，请稍候再试~',
              duration: 2000,
            })
          }
        },
      })
    },
    //验证码倒计时
    countDown: function (obj) {
      var that = this,
        count = 60 //倒计时时间
      that.sms_timer = setInterval(function () {
        if (count == 0) {
          obj.text('获取验证码').removeAttr('disabled').removeClass('gray')
          clearInterval(that.sms_timer)
        } else {
          obj.text('已发送(' + count + 's)')
          obj.attr('disabled', true).addClass('gray')
        }
        count--
      }, 1000)
    },
    //清楚input标签内容
    inputClear: function () {
      $('input').focus(function () {
        $(this).parent().children('.clear-input').show()
      })
      $('input').blur(function () {
        if ($(this).val() == '') {
          $(this).parent().children('.clear-input').hide()
        }
      })
      $('.clear-input').on('click', function () {
        $(this).parent().find('input').val('')
        $(this).hide()
      })
    },
  })

  $(document).ready(function () {
    new Common().init()
  })
})(jQuery)