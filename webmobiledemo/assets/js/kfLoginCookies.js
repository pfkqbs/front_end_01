;(function () {
    var kfLoginCookies = {};
    // 登录信息保存在cookies
    kfLoginCookies.saveUserData = function () {
        var sy_acc = storage.getItem('sy_acc') || null
        var is_real = storage.getItem('sy_is_real')
        var sy_acc_info = storage.getItem('sy_acc_info') || null
        var sy_token = storage.getItem('sy_token')
        // 如果存在storage数据，才同步到cookies数据
        var devMode = ''
        if (document.domain === 'www.shiyue.com' || document.domain === 'kf.shiyue.com') {
            devMode = 'prod'
        } else {
            devMode = 'test'
        }
        if (sy_acc) {
            Cookies.set('sy_acc_' + devMode, sy_acc, {domain: 'shiyue.com'})
        }
        Cookies.set('is_real_' + devMode, is_real, {domain: 'shiyue.com'})
        if (sy_acc_info) {
            Cookies.set('sy_acc_info_' + devMode, sy_acc_info, {domain: 'shiyue.com'})
        }
        if (sy_token) {
            Cookies.set('sy_token_' + devMode, sy_token, {domain: 'shiyue.com'})
        }
    };

    kfLoginCookies.removeUserData = function () {
        var devMode = ''
        if (document.domain === 'www.shiyue.com' || document.domain === 'kf.shiyue.com') {
            devMode = 'prod'
        } else {
            devMode = 'test'
        }
        Cookies.set('sy_acc_' + devMode, null, {domain: 'shiyue.com'})
        Cookies.set('is_real_' + devMode, '', {domain: 'shiyue.com'})
        Cookies.set('sy_acc_info_' + devMode, null, {domain: 'shiyue.com'})
        Cookies.set('sy_token_' + devMode, '', {domain: 'shiyue.com'})
    };

    // kfLoginCookies.getUserData = function(){
    // 在客服页面，获取cookies并同步到storage
    kfLoginCookies.getSyncUserData = function () {
        // 设置cookie方式
        var devMode = ''
        if (document.domain === 'www.shiyue.com' || document.domain === 'kf.shiyue.com') {
            devMode = 'prod'
        } else {
            devMode = 'test'
        }

        var sy_acc = Cookies.get('sy_acc_' + devMode, {domain: 'shiyue.com'})
        if (sy_acc) {
            sy_acc = JSON.parse(sy_acc)
        }

        var sy_acc_info = Cookies.get('sy_acc_info_' + devMode, {domain: 'shiyue.com'})
        if (sy_acc_info) {
            sy_acc_info = JSON.parse(sy_acc_info)
        }

        var sy_token = Cookies.get('sy_token_' + devMode, {domain: 'shiyue.com'})
        sy_token = sy_token

        storage.setItem('sy_acc', sy_acc, 10 * 60 * 60 * 1000)
        storage.setItem('sy_acc_info', sy_acc_info, 10 * 60 * 60 * 1000)
        storage.setItem('sy_token', sy_token)

    };
    //写入window
    window.kfLoginCookies = kfLoginCookies;
})();