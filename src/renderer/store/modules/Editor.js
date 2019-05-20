import db from '../../lib/dbDoc'

const state = {
  current: null,
  docs: []
}

const mutations = {
  SET_CURRENT (state, obj) {
    state.current = obj
  },
  SET_DOCS (state, docs) {
    state.docs = docs
  }
}

const actions = {
  openDoc ({commit}, obj) {
    commit('SET_CURRENT', obj)
  },
  saveDoc ({commit, dispatch}, {title, doc}) {
    if (state.current == null) {
      db.addDoc(title, doc, (err, obj) => {
        if (err) throw err
        commit('SET_CURRENT', obj)
        dispatch('refreshDocs')
      })
    } else {
      db.editDoc(state.current, title, doc, () => {
        dispatch('refreshDocs')
      })
    }
  },
  refreshDocs ({commit}) {
    db.getAllDocs((err, docs) => {
      if (err) {
        console.log(err)
      } else {
        commit('SET_DOCS', docs)
      }
    })
  },
  getFirstDoc ({commit}) {
    db.getFirstDoc((err, doc) => {
      if (err) console.log(err)
      else commit('SET_CURRENT', doc)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
