import { login, logout, requestUserInfoFromSession, getSessionInfo, changeRole } from '@/api/user'
import { getToken, setToken, removeToken, getCurrentRole, setCurrentRole, removeCurrentRole } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import language from '@/lang'

const state = {
  token: getToken(),
  name: '',
  userUuid: '',
  avatar: '',
  introduction: '',
  rol: {}, // info current rol
  rolesList: [],
  roles: [],
  isSession: false,
  sessionInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLES_LIST: (state, payload) => {
    state.rolesList = payload
  },
  SET_ROL: (state, rol) => {
    state.rol = rol
  },
  SET_USER_UUID: (state, payload) => {
    state.userUuid = payload
  },
  setIsSession(state, payload) {
    state.isSession = payload
  },
  setSessionInfo(state, payload) {
    state.sessionInfo = payload
  }
}

const actions = {
  // user login
  login({ commit }, {
    userName,
    password
  }) {
    return new Promise((resolve, reject) => {
      login({
        userName,
        password
      })
        .then(logInResponse => {
          const { uuid: token } = logInResponse

          commit('SET_TOKEN', token)
          setToken(token)

          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },
  // session info
  getInfo({ commit, dispatch }, sessionUuid = null) {
    if (isEmptyValue(sessionUuid)) {
      sessionUuid = getToken()
    }
    return new Promise(resolve => {
      getSessionInfo(sessionUuid)
        .then(responseGetInfo => {
          const { role } = responseGetInfo

          commit('setIsSession', true)
          commit('setSessionInfo', {
            id: responseGetInfo.id,
            uuid: responseGetInfo.uuid,
            name: responseGetInfo.name,
            processed: responseGetInfo.processed
          })

          const userInfo = responseGetInfo.userInfo
          commit('SET_NAME', responseGetInfo.name)
          commit('SET_INTRODUCTION', userInfo.description)
          commit('SET_USER_UUID', userInfo.uuid)

          // TODO: return 'Y' or 'N' string values as data type Booelan (4)
          // TODO: return #Date as long data type Date (5)
          responseGetInfo.defaultContextMap.set('#Date', new Date())
          // set multiple context
          dispatch('setMultipleContextMap', responseGetInfo.defaultContextMap, {
            root: true
          })

          const sessionResponse = {
            name: responseGetInfo.name,
            defaultContext: responseGetInfo.defaultContextMap
          }

          commit('SET_ROL', role)
          setCurrentRole(role.uuid)

          resolve(sessionResponse)

          dispatch('getUserInfoFromSession', sessionUuid)
            .catch(error => {
              console.warn(`Error ${error.code} getting user info value: ${error.message}.`)
            })
        })
        .catch(error => {
          console.warn(`Error ${error.code} getting context session: ${error.message}.`)
        })
    })
  },
  // get user info
  getUserInfoFromSession({ commit }, sessionUuid = null) {
    if (isEmptyValue(sessionUuid)) {
      sessionUuid = getToken()
    }
    return new Promise((resolve, reject) => {
      requestUserInfoFromSession(sessionUuid).then(responseGetInfo => {
        if (isEmptyValue(responseGetInfo)) {
          reject({
            code: 0,
            message: 'Verification failed, please Login again.'
          })
        }
        // roles must be a non-empty array
        if (isEmptyValue(responseGetInfo.rolesList)) {
          reject({
            code: 0,
            message: 'getInfo: roles must be a non-null array!'
          })
        }

        commit('SET_ROLES_LIST', responseGetInfo.rolesList)

        const rolesName = responseGetInfo.rolesList.map(roleItem => {
          return roleItem.name
        })
        commit('SET_ROLES', rolesName)

        if (isEmptyValue(state.rol)) {
          const role = responseGetInfo.rolesList.find(itemRole => {
            return itemRole.uuid === getCurrentRole()
          })
          if (!isEmptyValue(role)) {
            commit('SET_ROL', role)
          }
        }

        // TODO: Add support from ADempiere
        const avatar = 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4'
        commit('SET_AVATAR', avatar)

        resolve({
          ...responseGetInfo,
          avatar,
          roles: rolesName
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('setIsSession', false)
        dispatch('resetStateBusinessData', null, {
          root: true
        })
        dispatch('dictionaryResetCache', null, {
          root: true
        })

        dispatch('tagsView/delAllViews', null, { root: true })
        removeToken()
        removeCurrentRole()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  // dynamically modify permissions
  changeRoles({ commit, dispatch }, {
    roleUuid,
    isCloseAllViews = true
  }) {
    const route = router.app._route
    const selectedTag = {
      fullPath: route.fullPath,
      hash: route.hash,
      matched: route.matched,
      meta: route.meta,
      name: route.name,
      params: route.params,
      path: route.path,
      query: route.query,
      title: route.meta.title
    }

    let actionToDispatch = 'tagsView/delOthersViews'
    if (isCloseAllViews) {
      actionToDispatch = 'tagsView/delAllViews'
    }
    dispatch(actionToDispatch, selectedTag, { root: true })

    return changeRole({
      sessionUuid: getToken(),
      roleUuid,
      organizationUuid: null,
      warehouseUuid: null
    })
      .then(changeRoleResponse => {
        const { role } = changeRoleResponse
        commit('SET_ROL', role)
        setCurrentRole(role.uuid)
        commit('SET_TOKEN', changeRoleResponse.uuid)
        setToken(changeRoleResponse.uuid)

        // Update user info and context associated with session
        dispatch('getInfo', changeRoleResponse.uuid)

        dispatch('resetStateBusinessData', null, {
          root: true
        })
        dispatch('dictionaryResetCache', null, {
          root: true
        })

        showMessage({
          message: language.t('notifications.successChangeRole'),
          type: 'success'
        })
        return {
          ...role,
          sessionUuid: changeRoleResponse.uuid
        }
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error'
        })
        console.warn(`Error change role: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        resetRouter()
        dispatch('permission/generateRoutes', null, {
          root: true
        })
          .then(response => {
            router.addRoutes(response)
          })
      })
    //  return new Promise(async resolve => {
    //  const token = role
    //  commit('SET_TOKEN', token)
    //  commit('SET_CURRENTROLE',)
    //  setToken(token)
    //  const { roles } = await dispatch('getInfo')

    //  generate accessible routes map based on roles
    //  const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

    //  dynamically add accessible routes
    //  router.addRoutes(accessRoutes)
    // })
  }
}

const getters = {
  getRoles: (state) => {
    return state.rolesList
  },
  // current rol info
  getRol: (state) => {
    return state.rol
  },
  getIsSession: (state) => {
    return state.isSession
  },
  getUserUuid: (state) => {
    return state.userUuid
  },
  getIsPersonalLock: (state) => {
    return state.rol.isPersonalLock
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
