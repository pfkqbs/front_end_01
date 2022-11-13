var isProd = true,
    production = {},
    development = {}

//正式环境
production = {
  sdkapi_web_url: 'https://api.shiyue.com',
  commonapi_web_url: 'https://api-common.shiyue.com',
  payapi_web_url: 'https://pay.shiyue.com',
  bbsapi_web_url: 'https://api-bbs.shiyue.com',
  bbsimg_web_url: 'https://bbs-img.shiyue.com',
  sdkapi_secret: 'SQz7RrTGbb0j7NCK',
  commonapi_secret: 'JZ0PJRVzpUctYExk',
  payapi_secret: 'V9M3ox6yFL5jXTR7',
  payapi_key: 'webpayqrcode',
  forumapi_secret: 'DDGqbVSsHVt1hOSHxJUys65CVWPu5HhC',
  accountapi_secret: 'KzgSYlXKYVQokE1F0KAwp26ueTj1clNd',
  source_mod: 'web', //官网
  os_type: 3, //客户端系统类型 1安卓 2ios 3win系统
  sdk_ver: '1.1.0', //客户端版本号
  dev_str: navigator.platform, //设备标识
}

//开发环境
development = {
  sdkapi_web_url: 'http://test.shiyue.com',
  commonapi_web_url: 'http://test-common-api.shiyue.com',
  payapi_web_url: 'http://test-pay.shiyue.com',
  bbsapi_web_url: 'http://test-bbs.shiyue.com',
  bbsimg_web_url: 'http://test-bbsimg.shiyue.com',
  sdkapi_secret: 'SQz7RrTGbb0j7NCK',
  commonapi_secret: 'JZ0PJRVzpUctYExk',
  payapi_secret: 'V9M3ox6yFL5jXTR7',
  payapi_key: 'webpayqrcode',
  forumapi_secret: 'DDGqbVSsHVt1hOSHxJUys65CVWPu5HhC',
  accountapi_secret: 'KzgSYlXKYVQokE1F0KAwp26ueTj1clNd',
  source_mod: 'web', //官网
  os_type: 3, //客户端系统类型 1安卓 2ios 3win系统
  sdk_ver: '1.1.0', //客户端版本号
  dev_str: navigator.platform, //设备标识
}

var config = isProd ? production : development;
