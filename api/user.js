const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()
router.get('/', async (ctx) => {
  ctx.body = "没定义，用不到"
})


router.post('/login', async (ctx) => {
  let loginUser = ctx.request.body
  console.log(loginUser, 123)
  let userName = loginUser.userName
  let password = loginUser.password ? loginUser.password : loginUser.code
  let isSmsLogin = loginUser.isSmsLogin
  //引入User的model
  console.log(password);

  const User = mongoose.model('User')
  try {
    let result = await User.findOne({
      userName,
    }).exec()
    console.log(result, 456)
    if (result) {
      let newUser = new User()
      try {
        let isMatch = await newUser.comparePassword(password, result.password)
        console.log(isMatch)
        if (isMatch) {
          ctx.body = {
            code: 200,
            message: "登录成功"
          }
        } else {
          ctx.body = {
            code: 300,
            message: "密码不匹配"
          }
        }
      } catch (error) {
        console.log(error)
        ctx.body = {
          code: 500,
          message: error
        }
      }
    } else {
      if (isSmsLogin) {
        let newUser = new User({
          userName,
          password,
          isSmsLogin
        })
        await newUser.save()
        ctx.body = {
          code: 201,
          message: '注册成功'
        }
      } else {
        ctx.body = {
          code: 202,
          message: '用户名不存在，请使用手机号注册'
        }
      }
    }

  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 500,
      message: error
    }
  }
})

module.exports = router