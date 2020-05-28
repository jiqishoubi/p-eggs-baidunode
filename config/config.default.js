/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1578030341841_5384';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    //关闭csrf
    security: {
      csrf: {
        enable: false,
      },
    },
    //允许跨域
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
    },
    //开启file模式 可以接收file
    multipart: {
      mode: 'file',
      //针对ios对file格式进行扩展
      // 白名单：
      // // images
      // '.jpg', '.jpeg', // image/jpeg
      // '.png', // image/png, image/x-png
      // '.gif', // image/gif
      // '.bmp', // image/bmp
      // '.wbmp', // image/vnd.wap.wbmp
      // '.webp',
      // '.tif',
      // '.psd',
      // // text
      // '.svg',
      // '.js', '.jsx',
      // '.json',
      // '.css', '.less',
      // '.html', '.htm',
      // '.xml',
      // // tar
      // '.zip',
      // '.gz', '.tgz', '.gzip',
      // // video
      // '.mp3',
      // '.mp4',
      // '.avi',
      fileExtensions: [
        '.MP3', '.MP4', '.AVI',

        '.m4v', '.mov', '.3gp', '.mpeg1', '.mpeg4', '.flv', '.mjpeg', '.rmvb', '.wmv', '.f4v', '.mkv', '.rm',
        '.M4V', '.MOV', '.3GP', '.MPEG1', '.MPEG4', '.FLV', '.MJPEG', '.RMVB', '.WMV', '.F4V', '.MKV', '.RM',

        '.asf', '.asx', '.dat', '.vob', '.mpeg', '.mpg', '.navi',
        '.ASF', '.ASX', '.DAT', '.VOB', '.MPEG', '.MPG', '.NAVI',
      ],
    }
  };


  return {
    ...config,
    ...userConfig,
  };
};
