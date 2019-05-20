import Datastore from 'nedb'
import fs from 'fs'

const settingDb = new Datastore({filename: './data/setttingdb', autoload: true})

const getSetting = (cb) => {
  settingDb.findOne({_id: 1}, (err, data) => {
    let picPath = './data/pic/'
    let docPath = './data/doc/'
    if (err || data === null || data._id !== 1) {
      // 初始化配置
      let obj = {
        _id: 1,
        picPath: picPath,
        docPath: docPath,
        createTime: new Date(),
        statusTime: new Date()
      }
      settingDb.insert(obj, cb)
    } else {
      picPath = data.picPath
      docPath = data.docPath
      cb(null, data)
    }
    /**
     * 创建图片目录
     */
    fs.mkdir(picPath, (err) => {
      if (err) console.error(err)
      else console.log('图片目录创建成功')
    })

    /**
     * 创建文档目录
     */
    fs.mkdir(docPath, (err) => {
      if (err) console.error(err)
      else console.log('文档目录创建成功')
    })
  })
}

/**
 * 保存配置
 */
const save = (obj, cb) => {
  obj._id = 1
  obj.statusTime = new Date()
  settingDb.update({_id: 1}, obj, {}, cb)
}

const settingStore = {
  save,
  getSetting
}

export default settingStore
