import Datastore from 'nedb'
import fs from 'fs'
import uuid from 'uuid'
import store from '../store'

const dbDoc = new Datastore({filename: './data/docdb', autoload: true})

/**
 * 新增文档
 */
const addDoc = (title, doc, cb) => {
  let fileName = store.state.Setting.setting.docPath + uuid.v1()
  fs.writeFile(fileName, doc, (err) => {
    if (err) throw err
    let obj = {
      title: title,
      fileName: fileName,
      createTime: new Date(),
      statusTime: new Date()
    }
    dbDoc.insert(obj, cb)
  })
}

/**
 * 编辑文档
 */
const editDoc = (obj, title, doc, cb) => {
  obj.title = title
  obj.statusTime = new Date()
  fs.writeFile(obj.fileName, doc, (err) => {
    if (err) throw err
    dbDoc.update({_id: obj._id}, obj, {}, cb)
  })
}

/**
 * 获取所有文档
 */
const getAllDocs = (cb) => {
  dbDoc.find({}).sort({statusTime: -1}).exec(cb)
}

/**
 * 通过ID获取文档
 */
const getDocById = (id, cb) => {
  dbDoc.findOne({_id: id}, cb)
}

/**
 * 获取第一篇文档
 */
const getFirstDoc = (cb) => {
  dbDoc.findOne().sort({statusTime: -1}).exec(cb)
}

/**
 * 删除文档
 * @param id
 * @param cb
 */
const delDoc = (id, cb) => {
  dbDoc.remove({_id: id}, {}, cb)
}

const docStore = {
  addDoc,
  editDoc,
  getAllDocs,
  getDocById,
  getFirstDoc,
  delDoc
}

export default docStore
