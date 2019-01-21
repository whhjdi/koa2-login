const mongoose = require('mongoose');
const db = "mongodb://localhost/muxue-db";
const glob = require('glob')
const {
  resolve
} = require('path')


exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

mongoose.Promise = global.Promise

exports.connect = () => {
  mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    mongoose.connection.on('disconnected', () => {
      console.log('数据库连接已断开')
      //重连次数
      if (maxConnectTimes <= 3) {
        mongoose.connect(db, {
          useCreateIndex: true,
          useNewUrlParser: true
        })
        maxConnectTimes++
      } else {
        reject()
        throw new Error('数据库异常，请检查')
      }
    })
    mongoose.connection.on('error', (err) => {
      console.log('数据库错误', err);
      if (maxConnectTimes <= 3) {
        mongoose.connect(db, {
          useCreateIndex: true,
          useNewUrlParser: true
        })
        maxConnectTimes++
      } else {
        reject(err)
        throw new Error('数据库异常，请检查')
      }
    })
    mongoose.connection.once('open', () => {
      console.log('mongodb 连接成功');
      resolve()
    })
  })
}