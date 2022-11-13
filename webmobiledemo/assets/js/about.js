;(function ($) {
    var About = function () {
        this.$sidebar = $('#J_sidebar')
        this.scrollStatus = []
        this.config = config
        this.key = ''
    }

    $.extend(About.prototype, {
        init: function () {
            this.wow()
            this.initialize()
            this.bindEvent()
        },
        bindEvent: function () {
            $(window).on('scroll', $.proxy(this.sideBar, this))
            var that = this
            $('.j_submit').on('click', function () {
                that.handleFeedbak()
            })
            that.getCaptcha()
            $('.j_get_captcha').on('click', function () {
                that.getCaptcha()
            })
        },
        handleFeedbak: function () {
            var j_feedback = $('.j_feedback')
            var that = this
            var title = j_feedback.find('input[name="title"]').val()
            var email = j_feedback.find('input[name="email"]').val()
            var phone_number = j_feedback.find('input[name="phone_number"]').val()
            var captcha = j_feedback.find('input[name="captcha"]').val()
            var content = j_feedback.find('textarea[name="content"]').val()
            if (title == '') {
                j_feedback.toast({
                    content: '请输入标题~',
                    duration: 3000,
                    position: 'fixed'
                })
                return false
            }
            if (email == '') {
                j_feedback.toast({
                    content: '请输入邮箱~',
                    duration: 3000,
                    position: 'fixed'
                })
                return false
            }
            if (phone_number == '') {
                //
            } else if (!/^1[3-8]{1}[0-9]{9}$/.test(phone_number) && !/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(phone_number)) {
                j_feedback.toast({
                    content: '请输入正确的手机号码或电话号码~',
                    duration: 3000,
                    position: 'fixed'
                })
                return false
            }
            if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
                j_feedback.toast({
                    content: '请输入正确的邮箱~',
                    duration: 3000,
                    position: 'fixed'
                })
                return false
            }
            if (captcha == '') {
                j_feedback.toast({
                    content: '请输入验证码~',
                    duration: 3000,
                    position: 'fixed'
                })
                return false
            }
            if (captcha.length != 4) {
                j_feedback.toast({
                    content: '请输入正确的4位验证码~',
                    duration: 3000,
                    position: 'fixed'
                })
                return false
            }
            if (content == '') {
                j_feedback.toast({
                    content: '请输入内容~',
                    duration: 3000,
                    position: 'fixed'
                })
                return false
            }
            var params = {
                title: title,
                email: email,
                phone_number: phone_number,
                captcha: captcha,
                content: content,
                key: that.key
            }
            this.submitFeedbak(params)
        },
        submitFeedbak: function (params) {
            var j_feedback = $('.j_feedback')
            var that = this
            var api_params = {}
            api_params['title'] = params.title
            api_params['email'] = params.email
            api_params['phone_number'] = params.phone_number
            api_params['code'] = params.captcha
            api_params['content'] = params.content
            api_params['ts'] = Math.round(new Date() / 1000)
            api_params['sign'] = sign(api_params, config.commonapi_secret)
            $.ajax({
                url: that.config.commonapi_web_url + '/web/about/contactUsCreate',
                type: 'POST',
                data: api_params,
                success: function (response) {
                    if (response.code == 0) {
                        j_feedback.toast({
                            content: '留言提交成功，我们会及时给您反馈~',
                            duration: 4000,
                            position: 'fixed'
                        })
                        that.resetForm()
                        that.getCaptcha()
                    } else {
                        that.getCaptcha()
                        j_feedback.toast({
                            content: response.message,
                            duration: 2000,
                            position: 'fixed'
                        })
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (XMLHttpRequest.status != 200) {
                        j_feedback.toast({
                            content: '服务器出小差，请稍候再试~',
                            duration: 2000,
                        })
                    }
                },
            })
        },
        resetForm: function () {
            var j_feedback = $('.j_feedback')
            j_feedback.find('input[name="title"]').val('')
            j_feedback.find('input[name="email"]').val('')
            j_feedback.find('input[name="phone_number"]').val('')
            j_feedback.find('input[name="captcha"]').val('')
            j_feedback.find('textarea[name="content"]').val('')
        },

        //获取图片验证码
        getCaptcha: function (type) {
            var that = this
            var api_params = {}
            var j_feedback = $('.j_feedback')

            api_params['type'] = type || 'login'
            api_params['ts'] = Math.round(new Date() / 1000)
            api_params['sign'] = sign(api_params, that.config.sdkapi_secret)

            $.ajax({
                url: that.config.sdkapi_web_url + '/web/captcha',
                type: 'get',
                data: api_params,
                success: function (response) {
                    if (response.code == 0) {
                        j_feedback.find('.pic-feed-captcha').attr('src', response.data.captcha)
                    } else {
                        j_feedback.toast({
                            content: '获取图片验证码失败，请稍候再试~',
                            isCenter: true,
                            duration: 3000,
                            position: 'fixed'
                        })
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    //
                },
            })
        },

        //刷新图片验证码
        refreshCaptcha: function (e) {
            this.getCaptcha()
        },
        
        initialize: function () {
            var swiper = new Swiper('.history-swiper', {
                slidesPerView: 5,
                spaceBetween: 20,
                centeredSlides: true,
                roundLengths: true,
                freeMode: true,
                navigation: {
                    nextEl: '.backward',
                    prevEl: '.forward'
                }
            })
            var Numb = $('.swiper-slide').length
            $(window).one('scroll', function () {
                swiper.slideTo(Numb - 2, Numb * 3000, false)
            })

            new Swiper('.honor-swiper', {
                pagination: {
                    el: '.honor-pagination',
                    clickable: true
                }
            })

            this.sideStatus()
        },
        wow: function () {
            new WOW().init()
        },
        sideStatus: function () {
            var that = this,
                t1 = $('.about').offset().top - 300,
                t2 = $('.culture').offset().top - 300,
                t3 = $('.history').offset().top - 300,
                t4 = $('.contact').offset().top - 300,
                t5 = $('.honor').offset().top - 520
            that.scrollStatus = [t1, t2, t3, t4, t5]

            $('.sidebar-top a').each(function (index) {
                $(this).on('click', function () {
                    $('body,html').animate({
                        scrollTop: that.scrollStatus[index] + 'px'
                    })
                })
            })
        },
        sideBar: function (e) {
            var scroll_top = $(window).scrollTop()
            for (var i = 0; i < this.scrollStatus.length; i++) {
                if (scroll_top >= this.scrollStatus[i] - 1) {
                    $('.sidebar-top a')
                        .eq(i)
                        .addClass('on')
                        .siblings()
                        .removeClass('on')
                }
            }
        }
    })

    $(document).ready(function () {
        new About().init()
    })
})(jQuery)