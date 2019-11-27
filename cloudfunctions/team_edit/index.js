// 云函数入口文件
//该云函数用来添加用户的动态
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('team').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        pic: event.pic,
        name: event.name,
        detail: event.detail,
        type: event.type
      }
    })
  } catch (e) {
    console.error(e)
  }
}


