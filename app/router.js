'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/randomKey', controller.api.randomKey);
  router.post('/api/videoLiveCheck', controller.api.videoLiveCheck);
};
