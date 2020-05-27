/**
 * 活体检测H5 accessToken
 */
const Subscription = require('egg').Subscription
const Application = require('../components/Application')

class UpdateAccess extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '2590000s', // 间隔 2592000s
      type: 'worker',
      immediate: true, //服务启动时，立即执行一次
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    let application = new Application(this.ctx, 'faceH5')
    await application.updateAccessToken()
  }
}

module.exports = UpdateAccess