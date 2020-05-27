const fs = require("fs")
const path = require('path');
// const mineType = require('mime-types');  // 文件类型

//读取
exports.readFileAsync = function (fpath, encoding) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fpath, encoding, function (err, content) {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

//写入
exports.writeFileAsync = function (fpath, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fpath, content, function (err, content) {
      if (err) reject(err)
      else resolve()
    })
  })
}

//生成随机字符串
exports.createNonce = function () {
  return Math.random().toString(36).substr(2, 15)
}

//生成时间戳
exports.createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000, 10) + ""
}

//file转base64
exports.fileToBase64 = function (tempFilePath) {
  return new Promise((resolve) => {
    let filePath = path.resolve(tempFilePath);

    let data = fs.readFileSync(filePath);
    data = Buffer.from(data, 'utf-8').toString('base64');
    resolve(data)
    // let base64 = 'data:' + mineType.lookup(filePath) + ';base64,' + data;
    // resolve(base64)
  })
}

