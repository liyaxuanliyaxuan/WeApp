// 云函数入口文件
//该函数用于获取成员动态并将他们按某一属性（暂定为时间排序）
//函数的返回值如下
// userMoments:[{name:"hhhhh",moment:"kkkkkkk",stars:22},{name:"uuuu",moment:"ooooooo",stars:19}]



const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数

const db = cloud.database()
const _ = db.command
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async(event, context) => {
  try {
   
    return await db.collection('member').where(event.id).get({
      success:function(res){return res}
    })
    
    //数组合并

  } catch (e) {
    console.error(e)
  }
}


