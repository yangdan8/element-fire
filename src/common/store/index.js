import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
// 模态框
import Modal from './modal'

import stores from './stores'

Vue.use(Vuex)

const store = new Vuex.Store({
        modules: {
            ...stores,
            Modal
        },
        ...app
})

export default store