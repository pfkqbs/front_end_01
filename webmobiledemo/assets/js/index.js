;(function($) {
    var App = function() {}
  
    $.extend(App.prototype, {
      init: function() {
        this.wow()
        this.initialize()
      },
      wow: function() {
        new WOW().init()
      },
      initialize: function() {
        new Swiper('.banner-swiper', {
          pagination: {
            el: '.banner-pagination',
            clickable: true
          },
          on: {
            init: function() {
              swiperAnimateCache(this)
              swiperAnimate(this)
            },
            slideChangeTransitionEnd: function() {
              swiperAnimate(this)
            }
          }
        })
  
        new Swiper('.news-swiper', {
          pagination: {
            el: '.news-pagination',
            clickable: true
          }
        })
      }
    })
  
    $(document).ready(function() {
      new App().init()
    })
  })(jQuery)
  