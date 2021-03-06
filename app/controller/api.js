'use strict';

const Controller = require('egg').Controller;
const Application = require('../components/Application')
const constjs = require('../utils/const')
const utils = require('../utils/utils')
const errResult = require('../utils/err_result')
const ffmpeg = require('fluent-ffmpeg');

class ApiController extends Controller {
  /**
   * 获取语音校验码
   */
  async randomKey() {
    const { ctx } = this
    let application = new Application(ctx, 'faceH5')
    let accessToken = await application.getAccessToken()

    let result = await ctx.curl(`https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/sessioncode?access_token=${accessToken}`, {
      method: 'POST',
      // contentType: 'json',   // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      data: { appid: constjs['faceH5'].AppID },
      dataType: 'json',    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
    })
    console.log(result.data)

    //处理
    let returnData = null
    if (
      result.data &&
      result.data.err_no == 0 &&
      result.data.result &&
      result.data.result.code
    ) {
      returnData = {
        code: 200,
        systemMessage: '成功',
        data: result.data.result
      }
    } else {
      returnData = {
        code: 100,
        systemMessage: '获取语音校验码失败',
      }
    }

    //返回
    ctx.status = 200 //状态
    ctx.body = returnData
  }

  /**
   * 视频活体检测
   */
  async videoLiveCheck() {
    const { ctx } = this
    let query = ctx.request.body
    let application = new Application(ctx, 'faceH5')
    let accessToken = await application.getAccessToken()

    let file = ctx.request.files && ctx.request.files[0] ? ctx.request.files[0] : null
    let filepath = file.filepath
    let newPath = filepath.split('.')[0] + ('' + new Date().getTime()) + '.' + filepath.split('.')[1]

    //降低视频质量
    let startStamp = new Date().getTime()
    const zipVideo = (filepath) => {
      return new Promise((resolve) => {
        let command = ffmpeg(filepath)
          // .size('40%')
          .size('640x?')
          .save(newPath)
          .on('end', async function (res) {
            resolve(res)
          })
      })
    }
    await zipVideo(filepath)
    let endStamp = new Date().getTime()
    let dur = endStamp - startStamp
    console.log('压缩视频时间', dur)
    //降低视频质量 end

    let base64 = await utils.fileToBase64(newPath)
    console.log('转base64完毕')

    let postData = {
      session_id: query.session_id,
      video_base64: base64,
    }

    console.log('百度验证')
    let result = await ctx.curl(`https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/verify?access_token=${accessToken}`, {
      method: 'POST',
      // contentType: 'application/x-www-form-urlencoded',
      data: postData,
      dataType: 'json',    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      timeout: 120000,
    })
    console.log('*************百度验证完毕*************')

    let err_no = result.data.err_no

    //处理
    let returnData = null
    if (err_no == 0) {
      if (result.data.result && result.data.result.pic_list) {
        let pic_list = result.data.result.pic_list
        let pic_list2 = [pic_list[pic_list.length - 1]]
        result.data.result.pic_list = pic_list2
      }
      returnData = {
        code: 200,
        systemMessage: '成功',
        data: result.data.result
      }
    } else {
      let systemMessage = errResult.errObj[err_no] ? errResult.errObj[err_no] : '视频检测失败'
      returnData = {
        code: 100,
        systemMessage,
      }
    }
    console.log(returnData)

    //插入日志
    // ctx.logger.warn(JSON.stringify(returnData));
    ctx.logger.info(JSON.stringify(returnData));

    //返回
    ctx.status = 200 //状态
    ctx.body = {
      ...returnData,
      baiduMsg: result.data.err_msg
    }
  }
}

module.exports = ApiController;
