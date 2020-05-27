'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  //允许跨域
  cors: {
    enable: true,
    package: 'egg-cors'
  }
};
