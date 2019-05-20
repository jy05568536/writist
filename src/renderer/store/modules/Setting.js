import dbSetting from '../../lib/dbSetting'

const state = {
  setting: {}
}

const mutations = {
  SET_SETTING (state, obj) {
    state.setting = obj
  }
}

const actions = {
  getSetting ({commit}, obj) {
    dbSetting.getSetting((err, obj) => {
      if (err) console.log(err)
      commit('SET_SETTING', obj)
    })
  },
  saveSetting ({commit, dispatch}, obj) {
    dbSetting.save(obj, (err, data) => {
      if (err) console.log(err)
      commit('SET_SETTING', obj)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
