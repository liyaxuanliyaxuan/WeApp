// 云函数入口文件
//该云函数用来处理添加意见
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数

  const db = cloud.database()
  const _ = db.command
  // 云函数入口函数
  //传递的参数可通过event.xxx得到
  exports.main = async (event, context) => {
    try {
      return await db.collection('team').doc(event.id).update({
        // data 传入需要局部更新的数据
        data: {
          teamId: event.name,

          advice:_.push({content:event.advice,key:event.key,when:[],who:""})

        }
      })
    } catch (e) {
      console.error(e)
    }
  }
 
 
 