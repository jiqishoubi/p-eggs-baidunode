const path = require('path')
const constjs = require('../utils/const')
const utils = require('../utils/utils')

/**
 * eggCtx
 * appKey  百度云 应用的 我的key
 */
function Application(eggCtx, appKey) {
  this.eggCtx = eggCtx
  this.appKey = appKey
}

//===================================================================================================================================

//ajax获取accessToken
Application.prototype.getAccessTokenAjax = function () {
  let self = this
  return new Promise(async function (resolve) {
    let postData = {
      grant_type: 'client_credentials',
      client_id: constjs[self.appKey].APIKey,
      client_secret: constjs[self.appKey].SecretKey,
    }
    console.log('获取accessToken')
    let result = await self.eggCtx.curl('https://aip.baidubce.com/oauth/2.0/token', {
      method: 'POST',
      // contentType: 'json',   // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      data: postData,
      dataType: 'json',    // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
    })
    if (!result || !result.data) {
      resolve(null)
      return
    }
    console.log(result.data)
    resolve(result.data)
  })
}

//从db中读取accessToken
Application.prototype.readAccessToken = function () {
  let self = this
  return new Promise(function (resolve) {
    console.log('读取accessToken')
    utils.readFileAsync(path.join(__dirname, `../db/accessToken/${self.appKey}.txt`))
      .then(function (data) {
        try {
          let dataObj = JSON.parse(data)
          resolve(dataObj)
        } catch (e) {
          resolve(null)
        }
      })
  })
}

//写入accessToken到db
Application.prototype.writeAccessToken = function (data) { //Object
  let self = this
  return new Promise(function (resolve) {
    console.log('写入accessToken')
    let dataStr = JSON.stringify(data)
    utils.writeFileAsync(path.join(__dirname, `../db/accessToken/${self.appKey}.txt`), dataStr)
      .then(function () {
        resolve()
      })
  })
}

//验证accessToken是否合法（到期）
Application.prototype.isValidAccessToken = function (dbObj) {
  if (!dbObj || !dbObj.access_token || !dbObj.expires_in) {
    return false
  }
  let expires_in = dbObj.expires_in
  let now = new Date().getTime()
  return now < expires_in
}

//===================================================================================================================================

//重新获取accessToken，存到db
Application.prototype.updateAccessToken = async function () {
  let self = this
  return new Promise(async function (resolve) {
    let result = await self.getAccessTokenAjax()
    if (!result) return
    //处理一下ajax获取的Object 
    //考虑到网络延迟 提前2000秒到期
    let expires_in = new Date().getTime() + (result.expires_in - 2000) * 1000
    result.expires_in = expires_in
    //处理一下ajax获取的Object end
    await self.writeAccessToken(result)
    resolve(result.access_token)
  })
}

//拿到accessToken
Application.prototype.getAccessToken = function () {
  let self = this
  return new Promise(async function (resolve) {
    let dbObj = await self.readAccessToken()

    if (!self.isValidAccessToken(dbObj)) { //不合法
      let access_token = await self.updateAccessToken()
      console.log(access_token)
      resolve(access_token)
      return access_token
    }

    console.log(dbObj.access_token)
    resolve(dbObj.access_token)
    return dbObj.access_token
  })
}

module.exports = Application
